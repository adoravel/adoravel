/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export const BLOG_NSID = "re.kyu.blog.post" as const;

export type BlogPostVisibility = "public" | "unlisted" | "draft";

/** blob reference as ATProto stores it */
export interface BlobRef {
	$type: "blob";
	ref: { $link: string };
	mimeType: string;
	size: number;
}

/** raw record as it lives in the PDS */
export interface BlogPostRecord {
	$type: typeof BLOG_NSID;
	title: string;
	content: string;
	summary?: string;
	createdAt: string;
	updatedAt?: string;
	tags?: string[];
	lang?: string;
	visibility: BlogPostVisibility;
	cover?: BlobRef;
}

// :3
export interface BlogPost {
	identity: {
		rkey: string;
		cid: string;
		uri: string;
	};
	title: string;
	summary: string;
	content: string;
	parsed: {
		html: string;
	};
	createdAt: Date;
	updatedAt?: Date;
	tags: string[];
	lang: string;
	visibility: BlogPostVisibility;
	readingTime: number;
	cover?: BlobRef;
}

export type BlogPostSummary = Omit<BlogPost, "content" | "parsed">;
