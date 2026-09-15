// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

export type Visibility = "public" | "unlisted" | "draft";

export interface Frontmatter {
	title: string;
	summary?: string;
	description?: string;
	createdAt: Date;
	updatedAt?: Date;
	tags?: string[];
	cover?: string;
	visibility?: Visibility;
}

export interface MarkdownDocument {
	slug: string;
	frontmatter: Frontmatter;
	readingTime: number;
	render(): unknown;
}

export interface ThoughtSummary {
	slug: string;
	title: string;
	excerpt?: string;
	createdAt: string;
	readingTime: number;
	tags: string[];
	draft: boolean;
}
