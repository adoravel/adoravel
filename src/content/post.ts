/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export const POST_NSID = "app.bsky.feed.post" as const;
export const POST_COLLECTION = "app.bsky.feed.post" as const;

export interface PostFacet {
	index: { byteStart: number; byteEnd: number };
	features: Array<
		| { $type: "app.bsky.richtext.facet#link"; uri: string }
		| { $type: "app.bsky.richtext.facet#mention"; did: string }
		| { $type: "app.bsky.richtext.facet#tag"; tag: string }
	>;
}

export type PostEmbed =
	| { $type: "app.bsky.embed.images"; images: PostImage[] }
	| { $type: "app.bsky.embed.external"; external: PostExternal }
	| { $type: "app.bsky.embed.recordWithMedia"; record: unknown; media: PostEmbed };

export interface PostImage {
	url: string;
	alt?: string;
	aspectRatio?: { width: number; height: number };
}

export interface PostExternal {
	uri: string;
	title: string;
	description?: string;
	thumbUrl?: string;
	thumb?: {
		ref: { $link: string };
	};
	[key: string]: unknown;
}

export interface PostEmbedData {
	images?: PostImage[];
	external?: PostExternal;
	quoteUri?: string;
	[key: string]: unknown;
}

export interface PostRecord {
	$type: typeof POST_NSID;
	text: string;
	createdAt: string;
	facets?: PostFacet[];
	reply?: {
		root: { uri: string; cid: string };
		parent: { uri: string; cid: string };
	};
	embed?: PostEmbed;
	langs?: string[];
}

export interface Post {
	uri: string;
	url: string;
	cid: string;
	rkey: string;
	text: string;
	createdAt: Date;
	facets?: PostFacet[];
	langs?: string[];
	isReply: boolean;
	embed?: PostEmbed;
	segments: TextSegment[];
	replies?: Post[];
}

export type TextSegment =
	| { type: "text"; text: string }
	| { type: "link"; text: string; uri: string }
	| { type: "mention"; text: string; did: string; handle?: string }
	| { type: "tag"; text: string; tag: string };
