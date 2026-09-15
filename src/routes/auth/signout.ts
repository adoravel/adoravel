// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Context } from "@july/snarl";
import { clearSession } from "~/services/auth/mod.ts";
import { routes } from "~/config/site.ts";

export function POST(ctx: Context) {
	clearSession(ctx);
	return ctx.redirect(routes.more, 303);
}
