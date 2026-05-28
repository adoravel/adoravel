/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Context, Middleware } from "@july/snarl";

export const styleRegistry = new Map<string, string>();
export const contextualisedStyles = new WeakMap<Context<any>, Set<string>>();

export function scopedStyling(): Middleware {
	return (ctx: Context, next: () => Promise<Response>) => {
		if (
			!ctx.url.pathname.startsWith("/css/") ||
			!ctx.url.pathname.endsWith(".css")
		) {
			return next();
		}

		const hash = ctx.url.pathname.slice(5, -4);
		const content = styleRegistry.get(hash);

		if (!content) {
			return ctx.notFound();
		}

		return new Response(content, {
			headers: {
				"Content-Type": "text/css; charset=utf-8",
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
	};
}

export function styleScopeInjection(): Middleware {
	return async (ctx, next) => {
		const res = await next();

		const mem = contextualisedStyles.get(ctx);
		if (!mem || mem.size === 0) return res;

		const html = await res.text();

		const links = [...mem]
			.map((hash) => `<link rel="stylesheet" href="/css/${hash}.css">`)
			.join("");

		const injected = html.replace("</head>", `${links}</head>`);

		return new Response(injected, {
			headers: res.headers,
		});
	};
}
