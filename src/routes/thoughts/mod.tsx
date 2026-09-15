// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Context } from "@july/snarl";
import { routes } from "~/config/site.ts";

export default function LegacyThoughtsIndex(ctx: Context) {
	return ctx.redirect(routes.more, 301);
}
