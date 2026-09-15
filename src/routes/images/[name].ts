// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Context } from "@july/snarl";
import { cachedImageFile, IMAGE_MAX_AGE_SECONDS } from "~/services/media/proxy.ts";

export default async function ProxiedImage(ctx: Context) {
	const { name } = ctx.params as { name: string };
	const file = await cachedImageFile(name);
	if (!file) return new Response(null, { status: 404 });

	return new Response(await Deno.readFile(file.path), {
		headers: {
			"Content-Type": file.type,
			"Cache-Control": `public, max-age=${IMAGE_MAX_AGE_SECONDS}`,
		},
	});
}
