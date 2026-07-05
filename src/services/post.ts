/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { withInterval } from "~/util/interval.ts";
import { Post, POST_COLLECTION, PostFacet, PostRecord, TextSegment } from "~/content/post.ts";

export interface PostsServiceConfig {
	/** ATProto PDS base URL */
	pds: string;
	/** DID or handle owning the post records */
	repo: string;
	handle: string;
	/**
	 * filter criteria: If prefixed with '#', matches by facet tag.
	 * otherwise, matches if `record[tag] === true`.
	 */
	tag: string;
	/** how many posts to keep */
	limit: number;
	/** poll interval in seconds */
	pollInterval: number;
	maxRecordsToScan: number;
}

export interface Profile {
	displayName: string;
	url: string;
	avatarUrl?: string;
	handle: string;
}

interface ListRecordsResponse {
	records: Array<{ uri: string; cid: string; value: unknown }>;
	cursor?: string;
}

export const config: PostsServiceConfig = {
	pds: Deno.env.get("ATPROTO_PDS") ?? "https://try.kyu.re",
	repo: Deno.env.get("ATPROTO_REPO") ?? "did:web:kyu.re",
	handle: Deno.env.get("ATPROTO_HANDLE") ?? "suicide.diy",
	tag: Deno.env.get("POSTS_TAG") ?? "w",
	limit: Number(Deno.env.get("POSTS_LIMIT") ?? "100"),
	pollInterval: Number(Deno.env.get("POSTS_POLL_INTERVAL") ?? "120"),
	maxRecordsToScan: Number(Deno.env.get("BSKY_MAX_SCAN") ?? "500"),
};

const encoder = new TextEncoder(),
	decoder = new TextDecoder();

function segmentText(text: string, facets: PostFacet[] = []): TextSegment[] {
	if (!facets.length) return [{ type: "text", text }];

	const bytes = encoder.encode(text);
	const sorted = [...facets].sort((a, b) => a.index.byteStart - b.index.byteStart);
	const segments: TextSegment[] = [];
	let cursor = 0;

	for (const facet of sorted) {
		const { byteStart: start, byteEnd: end } = facet.index;
		if (start > cursor) {
			segments.push({ type: "text", text: decoder.decode(bytes.slice(cursor, start)) });
		}

		const data = decoder.decode(bytes.slice(start, end));
		const feature = facet.features[0];

		if (!feature) {
			segments.push({ type: "text", text: data });
		} else if (feature.$type === "app.bsky.richtext.facet#link") {
			segments.push({ type: "link", text: data, uri: feature.uri });
		} else if (feature.$type === "app.bsky.richtext.facet#mention") {
			segments.push({ type: "mention", text: data, did: feature.did });
		} else if (feature.$type === "app.bsky.richtext.facet#tag") {
			segments.push({ type: "tag", text: data, tag: feature.tag });
		} else {
			segments.push({ type: "text", text: data });
		}

		cursor = end;
	}

	if (cursor < bytes.length) {
		segments.push({ type: "text", text: decoder.decode(bytes.slice(cursor)) });
	}

	return segments;
}

function buildPost(uri: string, cid: string, value: PostRecord): Post {
	const rkey = rkeyFromAtUri(uri);

	const embed: Post["embed"] | undefined = value.embed;
	if (embed) {
		const blobBase = `${config.pds}/xrpc/com.atproto.sync.getBlob?did=${encodeURIComponent(config.repo)}&cid=`;

		if (embed.$type === "app.bsky.embed.images" && embed.images) {
			embed.images = embed.images.map((img: any) => ({
				...img,
				url: blobBase + img.image.ref.$link,
			}));
		} else if (embed.$type === "app.bsky.embed.external" && embed.external) {
			const ext = embed.external;
			embed.external = {
				...embed.external,
				thumbUrl: ext.thumb ? blobBase + ext.thumb.ref.$link : undefined,
			};
		} else if (embed.$type === "app.bsky.embed.recordWithMedia") {
			if (embed.media?.$type === "app.bsky.embed.images" && embed.media.images) {
				embed.media.images = embed.media.images.map((img: any) => ({
					...img,
					url: blobBase + img.image.ref.$link,
				}));
			} else if (embed.media?.$type === "app.bsky.embed.external" && embed.media.external) {
				embed.media.external.thumbUrl = embed.media.external.thumb
					? blobBase + embed.media.external.thumb.ref.$link
					: embed.media.external.thumbUrl;
			}
		}
	}

	return {
		uri,
		cid,
		rkey,
		text: value.text,
		createdAt: new Date(value.createdAt),
		facets: value.facets,
		langs: value.langs,
		isReply: !!value.reply,
		embed,
		segments: segmentText(value.text, value.facets),
		replies: [],
		url: `https://bsky.app/profile/${config.repo}/post/${rkey}`,
	};
}

async function fetchProfile(config: PostsServiceConfig): Promise<Profile> {
	try {
		const data = await xrpc<any>("com.atproto.repo.getRecord", {
			repo: config.repo,
			collection: "app.bsky.actor.profile",
			rkey: "self",
		});

		const avatarCid = data.value?.avatar?.ref?.$link;
		return {
			displayName: data.value?.displayName || config.handle,
			handle: config.handle,
			url: `https://bsky.app/profile/${config.repo}`,
			avatarUrl: avatarCid
				? `${config.pds}/xrpc/com.atproto.sync.getBlob?did=${config.repo}&cid=${avatarCid}`
				: undefined,
		};
	} catch {
		return { displayName: config.handle, handle: config.handle, url: `https://bsky.app/profile/${config.repo}` };
	}
}

const rkeyFromAtUri = (uri: string) => uri.slice(uri.lastIndexOf("/") + 1);

function isPostRecord(value: unknown): value is PostRecord {
	if (typeof value !== "object" || value === null) return false;
	const v = value as Record<string, unknown>;
	return v.$type === POST_COLLECTION && typeof v.text === "string" && typeof v.createdAt === "string";
}

async function xrpc<T>(method: string, params: Record<string, string | number>): Promise<T> {
	const url = new URL(`${config.pds}/xrpc/${method}`);
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, String(value));
	}
	const res = await fetch(url, { headers: { "User-Agent": "kyu.re/1.0" } });
	if (!res.ok) throw new Error(`XRPC ${method}: ${res.status}`);
	return res.json() as Promise<T>;
}

function recordMatchesTag(record: PostRecord, tag: string): boolean {
	const normalise = (tag: string): string => tag.startsWith("#") ? tag.slice(1).toLowerCase() : tag.toLowerCase();
	tag = normalise(tag);

	if (!tag.startsWith("#")) {
		return (record as unknown as Record<string, unknown>)[tag] === true;
	}

	return record.facets?.some((facet) =>
		facet.features.some(
			(f) =>
				f.$type === "app.bsky.richtext.facet#tag" &&
				normalise(f.tag) === tag,
		)
	) ?? false;
}

async function fetchTaggedPosts(config: PostsServiceConfig): Promise<{ posts: Post[]; profile: Profile }> {
	const profile = await fetchProfile(config);

	const allRecords = new Map<string, { uri: string; cid: string; value: PostRecord }>();
	let cursor: string | undefined;
	let count: number = 0;

	do {
		const remaining = config.maxRecordsToScan - count;
		const fetchLimit = Math.min(100, remaining);

		const params: Record<string, string | number> = {
			collection: POST_COLLECTION,
			repo: config.repo,
			limit: fetchLimit,
		};
		if (cursor) params.cursor = cursor;

		try {
			const { records, cursor: next } = await xrpc<ListRecordsResponse>(
				"com.atproto.repo.listRecords",
				params,
			);

			for (const { uri, cid, value } of records) {
				if (!isPostRecord(value)) continue;
				allRecords.set(uri, { uri, cid, value });
			}
			count += records.length;

			cursor = next;
		} catch (error) {
			console.error(`posts xrpc pagination failed at index ${count}:`, error);
			break;
		}
	} while (cursor && count < config.maxRecordsToScan);

	const taggedRoots = new Set<string>();
	const childToParent = new Map<string, string>();

	for (const [uri, { value }] of allRecords) {
		if (recordMatchesTag(value, config.tag)) {
			taggedRoots.add(uri);
		} else if (value.reply) {
			childToParent.set(uri, value.reply.parent.uri);
		}
	}

	const posts = new Map<string, Post>();

	function buildThreadChain(uri: string): Post | null {
		if (posts.has(uri)) return posts.get(uri)!;

		const record = allRecords.get(uri);
		if (!record) return null;

		const post = buildPost(uri, record.cid, record.value);
		posts.set(uri, post);

		const childrenUris: string[] = [];
		for (const [childUri, parentUri] of childToParent.entries()) {
			if (parentUri === uri) {
				childrenUris.push(childUri);
			}
		}

		for (const childUri of childrenUris) {
			const childPost = buildThreadChain(childUri);
			if (childPost) post.replies!.push(childPost);
		}

		post.replies!.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
		return post;
	}

	const roots: Post[] = [];
	for (const rootUri of taggedRoots) {
		const post = buildThreadChain(rootUri);
		if (post) roots.push(post);
	}

	return {
		posts: roots.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, config.limit),
		profile,
	};
}

export const data: () => Awaited<ReturnType<typeof fetchTaggedPosts>> | undefined = await withInterval(
	async () => {
		try {
			return await fetchTaggedPosts(config);
		} catch (error) {
			console.error("failed to fetch posts:", error);
		}
	},
	config.pollInterval,
);

export const getPosts = () => data()?.posts;
export const getProfile = () => data()?.profile;

export function getPost(rkey: string): Post | undefined {
	return getPosts()?.find((p) => p.rkey === rkey);
}
