// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { jsonParser, type Middleware, rateLimit } from "@july/snarl";

const writes = rateLimit({ windowMs: 10 * 60 * 1000, max: 3 });

const limitWrites: Middleware = (ctx, next) =>
	ctx.request.method === "GET" ? next() : writes(ctx, next);

export default [limitWrites, jsonParser()];
