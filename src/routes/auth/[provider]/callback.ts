// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Context } from "@july/snarl";
import { completeAuth, isProvider } from "~/services/auth/mod.ts";
import { getCanonicalOrigin } from "~/services/auth/config.ts";

export default async function AuthCallback(ctx: Context) {
	const { provider } = ctx.params as { provider: string };
	if (!isProvider(provider)) return new Response(null, { status: 404 });

	const outcome = await completeAuth(ctx, provider);

	const baseOrigin = getCanonicalOrigin(ctx.url.origin);
	const target = new URL(outcome.returnTo, baseOrigin);

	if (!outcome.ok) {
		target.searchParams.set("auth", outcome.reason);
		target.searchParams.set("provider", provider);
	}

	return ctx.redirect(target.toString(), 303);
}
