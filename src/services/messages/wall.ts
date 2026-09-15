// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { hasShape, isOneOf, isString, optional } from "~/services/core/validate.ts";
import { readApproved } from "./store.ts";
import { latestAuthor } from "~/services/authors/mod.ts";
import type { Print } from "./types.ts";

export const WALL_LIMIT = 12;

const isPrint = hasShape({
	id: isString,
	number: isString,
	body: isString,
	printedAt: isString,
	image: optional(isString),
	author: hasShape({
		provider: isOneOf(["discord", "bluesky", "lastfm"] as const),
		id: optional(isString),
		handle: isString,
		displayName: optional(isString),
		avatarUrl: optional(isString),
	}),
});

export async function getRecentPrints(limit = WALL_LIMIT): Promise<Print[]> {
	const approved = await readApproved((value): value is Print => isPrint(value));
	const recent = approved
		.sort((a, b) => b.printedAt.localeCompare(a.printedAt))
		.slice(0, limit);

	return Promise.all(
		recent.map(async (print) =>
			print.author ? { ...print, author: await latestAuthor(print.author) } : print
		),
	);
}
