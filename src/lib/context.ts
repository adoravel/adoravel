/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Middleware } from "@july/snarl";
import { Context } from "@july/snarl";

import { AsyncLocalStorage } from "node:async_hooks";

const contextStorage = new AsyncLocalStorage<Context>();

export function runWithContext<T>(ctx: Context, fn: () => T): T {
	return contextStorage.run(ctx, fn);
}

export function retrieveContext(): Context | undefined {
	return contextStorage.getStore();
}

export function contextMiddleware(): Middleware {
	return async (ctx, next) => {
		return await runWithContext(ctx, () => next());
	};
}
