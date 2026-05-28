/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Router } from "@july/snarl";
import { Context, httpMethods, type Method } from "@july/snarl";
import { dirname, fromFileUrl, join, relative } from "@std/path";

type RouteModule =
	& { default?: RouteHandler }
	& {
		[K in Method]?: RouteHandler;
	};

type RouteHandler = (ctx: Context) => any;

/**
 * @example
 * ```
 * routes/mod.tsx             /
 * routes/about.tsx           /about
 * routes/blog/[id].tsx       /blog/:id
 * routes/blog/[...slug].tsx  /blog/:slug*
 * routes/api/v1/users.tsx    /api/v1/users
 * ```
 */
function makeRoutePath(input: string): string {
	const path = input
		.replace(/\.tsx?$/, "")
		.replace(/(^|\/)mod$/, "")
		.replace(/\[\.\.\.(\w+)\]/g, ":$1*")
		.replace(/\[(\w+)\]/g, ":$1");

	return path === "" ? "/" : `/${path}`;
}

function wrap(handler: RouteHandler): RouteHandler {
	return async (ctx: Context) => {
		const result = await handler(ctx);
		return result instanceof Response ? result : ctx.html(result);
	};
}

export async function scanRoutes(router: Router, dir = "../routes"): Promise<void> {
	const routes: Array<{ path: string; module: RouteModule }> = [];
	const base = join(dirname(fromFileUrl(import.meta.url)), dir);

	await scan(base, base, routes);

	for (const { path, module } of routes) {
		for (const method of httpMethods) {
			const handler = module[method];
			if (handler) (router as any)[method.toLowerCase()](path, wrap(handler));
		}
		if (module.default && !module.GET) router.get(path, wrap(module.default));
	}
}

async function scan(base: string, dir: string, routes: Array<{ path: string; module: RouteModule }>) {
	for await (const entry of Deno.readDir(dir)) {
		const file = join(dir, entry.name);

		if (entry.isDirectory) {
			await scan(base, file, routes);
		} else if (entry.name.match(/\.tsx?$/)) {
			const module = await import(import.meta.resolve(file));
			const path = makeRoutePath(relative(base, file));
			routes.push({ path, module });
		}
	}
}
