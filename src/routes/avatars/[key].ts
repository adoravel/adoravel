// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Context } from "@july/snarl";
import { cachedAvatarFile } from "~/services/authors/mod.ts";

const KEY_RE = /^[a-z0-9._-]{1,80}$/;

export default async function Avatar(ctx: Context) {
	const { key } = ctx.params as { key: string };
	if (!KEY_RE.test(key)) return new Response(null, { status: 404 });

	const file = await cachedAvatarFile(key);
	if (!file) return new Response(null, { status: 404 });

	const bytes = await Deno.readFile(file.path);
	return new Response(bytes, {
		headers: {
			"Content-Type": file.type,
			"Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
		},
	});
}
