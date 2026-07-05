/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Lexer, Marked, type MarkedExtension, type Tokens } from "marked";
import { withInterval } from "~/util/interval.ts";
import { BLOG_NSID, BlogPost, BlogPostRecord, BlogPostVisibility } from "~/content/blog.ts";

import markedFootnote from "marked-footnote";

const WORDS_PER_MINUTE = 200;

const parsedByCid = new Map<string, BlogPost>();

export interface BlogServiceConfig {
	/** ATProto PDS base URL */
	pds: string;
	/** DID or handle owning the blog records */
	repo: string;
	/** how often to re-fetch posts, in seconds */
	pollInterval: number;
}

const rubyExtension: MarkedExtension = {
	extensions: [{
		name: "ruby",
		level: "inline",
		start: (src) => src.indexOf("^["),
		tokenizer(src) {
			const match = /^\^\[([^\]]+)\]\{([^}]+)\}/.exec(src);
			if (!match) return undefined;
			return {
				type: "ruby",
				raw: match[0],
				base: match[1],
				annotation: match[2],
			};
		},
		renderer(token) {
			return `<ruby>${token["base"]}<rt>${token["annotation"]}</rt></ruby>`;
		},
	}],
};

const marked = new Marked()
	.use(markedFootnote(), rubyExtension);

export const blogConfig: BlogServiceConfig = {
	pds: Deno.env.get("ATPROTO_PDS") ?? "https://try.kyu.re",
	repo: Deno.env.get("ATPROTO_REPO") ?? "did:web:kyu.re",
	pollInterval: Number(Deno.env.get("BLOG_POLL_INTERVAL") ?? "300"),
};

interface ListRecordsResponse {
	records: Array<{
		uri: string;
		cid: string;
		value: unknown;
	}>;
	cursor?: string;
}

async function xrpc<T>(
	method: string,
	params: Record<string, string | number>,
): Promise<T> {
	const url = new URL(`${blogConfig.pds}/xrpc/${method}`);
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, String(value));
	}

	const response = await fetch(url, {
		headers: { "User-Agent": "kyu.re/1.0" },
	});

	if (!response.ok) {
		throw new Error(`XRPC ${method} failed: ${response.status} ${response.statusText}`);
	}

	return response.json() as Promise<T>;
}

function estimateReadingTime(markdown: string): number {
	const wordCount = markdown
		.replace(/```[\s\S]*?```/g, "") // strip fenced code blocks
		.replace(/`[^`]+`/g, "") // strip inline code
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // strip link syntax, keep label
		.replace(/[#*_~>`|![\]()]+/g, "") // strip remaining markdown punctuation
		.split(/\s+/)
		.filter(Boolean).length;

	return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

function extractSummary(markdown: string, maxLength = 280): string {
	const tokens = new Lexer().lex(markdown);

	for (const token of tokens) {
		if (token.type !== "paragraph") continue;

		const text = (token as Tokens.Paragraph).text
			.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // strip link syntax
			.replace(/[*_~`]/g, "") // strip emphasis markers
			.replace(/\s+/g, " ")
			.trim();

		if (text.length <= maxLength) return text;

		const cut = text.lastIndexOf(" ", maxLength);
		return text.slice(0, cut > 0 ? cut : maxLength) + "…";
	}

	return "";
}

const rkeyFromUri = (uri: string): string => uri.slice(uri.lastIndexOf("/") + 1);

function isBlogPostRecord(value: unknown): value is BlogPostRecord {
	if (typeof value !== "object" || value === null) return false;
	const v = value as Record<string, unknown>;
	return (
		v.$type === BLOG_NSID &&
		typeof v.title === "string" && v.title.trim().length > 0 &&
		typeof v.content === "string" && v.content.trim().length > 0 &&
		typeof v.createdAt === "string" &&
		["public", "unlisted", "draft"].includes(v.visibility as string)
	);
}

async function parseRecord(
	uri: string,
	cid: string,
	raw: unknown,
): Promise<BlogPost | null> {
	if (!isBlogPostRecord(raw)) return null;

	const hit = parsedByCid.get(cid);
	if (hit) return hit;

	const {
		title,
		content,
		summary,
		createdAt,
		updatedAt,
		tags = [],
		lang = "en",
		visibility,
		cover,
	} = raw;

	const rkey = rkeyFromUri(uri);

	return {
		identity: {
			rkey,
			cid,
			uri,
		},
		title,
		content,
		summary: summary?.trim() || extractSummary(content),
		parsed: {
			html: await Promise.resolve(marked.parse(content)),
		},
		createdAt: new Date(createdAt),
		updatedAt: updatedAt ? new Date(updatedAt) : undefined,
		tags,
		lang,
		visibility,
		cover,
		readingTime: estimateReadingTime(content),
	};
}

async function fetchPosts(
	config: BlogServiceConfig,
	visibility: BlogPostVisibility | "all" = "public",
): Promise<BlogPost[]> {
	const posts: BlogPost[] = [];
	let cursor: string | undefined;

	do {
		const params: Record<string, string | number> = {
			collection: BLOG_NSID,
			repo: config.repo,
			limit: 100,
		};
		if (cursor) params.cursor = cursor;

		const { records, cursor: next } = await xrpc<ListRecordsResponse>(
			"com.atproto.repo.listRecords",
			params,
		);

		for (const { uri, cid, value } of records) {
			const post = await parseRecord(uri, cid, value);
			if (post) posts.push(post);
		}

		cursor = next;
	} while (cursor);

	const liveCids = new Set(posts.map((p) => p.identity.cid));
	for (const cid of parsedByCid.keys()) {
		if (!liveCids.has(cid)) parsedByCid.delete(cid);
	}

	return posts
		.filter((p) => (visibility === "all" && p.visibility !== "unlisted") || p.visibility === visibility)
		.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export const getPosts: () => BlogPost[] | undefined = withInterval(
	() => fetchPosts(blogConfig, "all"),
	blogConfig.pollInterval,
);

export function getPost(slug: string): BlogPost | undefined {
	return getPosts()?.find((p) => p.identity.rkey === slug);
}

export function filterPostsByTag(...tags: string[]): BlogPost[] {
	const needle = new Set(tags.map((t) => t.toLowerCase()));
	return getPosts()?.filter((p) => p.tags.some((t) => needle.has(t.toLowerCase()))) ?? [];
}

export function getTags(): string[] {
	const all = getPosts();
	if (!all) return [];

	const seen = new Set<string>();
	for (const post of all) {
		for (const tag of post.tags) seen.add(tag);
	}

	return [...seen].sort((a, b) => a.localeCompare(b));
}
