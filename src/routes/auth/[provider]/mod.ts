// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Context } from "@july/snarl";
import { log } from "@july/snarl/verbosity";
import { beginAuth, isProvider } from "~/services/auth/mod.ts";
import { describeError } from "~/services/core/errors.ts";
import { routes } from "~/config/site.ts";
import { getCanonicalOrigin } from "~/services/auth/config.ts";

function safeReturnTo(value: string | null): string {
	return value && value.startsWith("/") && !value.startsWith("//") ? value : routes.more;
}

export default async function BeginAuth(ctx: Context) {
	const { provider } = ctx.params as { provider: string };
	if (!isProvider(provider)) return new Response(null, { status: 404 });

	const returnTo = safeReturnTo(ctx.query.get("return"));
	const origin = getCanonicalOrigin(ctx.url.origin);
	if (origin !== ctx.url.origin) {
		return ctx.redirect(`${origin}${ctx.url.pathname}${ctx.url.search}`, 307);
	}

	try {
		const url = await beginAuth(ctx, provider, {
			handle: ctx.query.get("handle") ?? undefined,
			returnTo,
		});
		return ctx.redirect(url, 303);
	} catch (error) {
		log.warn("auth", `could not start ${provider} sign-in: ${describeError(error)}`);
		return ctx.redirect(`${returnTo}?auth=unavailable&provider=${provider}`, 303);
	}
}
