// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Context } from "@july/snarl";
import { completeAuth, isProvider } from "~/services/auth/mod.ts";

export default async function AuthCallback(ctx: Context) {
	const { provider } = ctx.params as { provider: string };
	if (!isProvider(provider)) return new Response(null, { status: 404 });

	const outcome = await completeAuth(ctx, provider);
	const target = new URL(outcome.returnTo, "http://placeholder");
	if (!outcome.ok) {
		target.searchParams.set("auth", outcome.reason);
		target.searchParams.set("provider", provider);
	}
	return ctx.redirect(target.pathname + target.search, 303);
}
