// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Context } from "@july/snarl";
import { routes } from "~/config/site.ts";
import { thoughts } from "~/markdown/mod.ts";

export default function LegacyThought(ctx: Context) {
	const { slug } = ctx.params as { slug: string };
	return ctx.redirect(routes.writing(thoughts.canonicalSlug(slug)), 301);
}
