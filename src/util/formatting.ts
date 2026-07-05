/**
 * Copyright (c) 2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Post } from "~/content/post.ts";

export function flattenThread(post: Post, isRoot: boolean = true): Array<Post & { isRoot: boolean }> {
	const flat = [{ ...post, isRoot }];
	if (post.replies && post.replies.length > 0) {
		for (const reply of post.replies) {
			flat.push(...flattenThread(reply, false));
		}
	}
	return flat;
}

export function formatPostDate(date: Date): string {
	const now = Date.now();
	const diff = now - date.getTime();

	if (diff < 60_000) return "just now";
	if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
	if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
	if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d ago`;

	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
	});
}
