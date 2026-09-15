// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Context } from "@july/snarl";
import { getBlueskyMetadata } from "~/services/auth/mod.ts";

export default function ClientMetadata(ctx: Context) {
	return ctx.json(getBlueskyMetadata());
}
