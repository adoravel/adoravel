// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Context } from "@july/snarl";
import { isRecord } from "~/services/core/validate.ts";
import { readSession } from "~/services/auth/mod.ts";
import { submitMessage } from "~/services/messages/mod.ts";

const STATUS: Record<string, number> = {
	invalid: 400,
	too_long: 413,
	unauthenticated: 401,
	bad_image: 415,
};

function clientOf(ctx: Context): string {
	const forwarded = ctx.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
	return forwarded || ctx.sender.remoteAddr.hostname;
}

export async function POST(ctx: Context) {
	const payload = await ctx.body.json().catch(() => undefined);
	if (!isRecord(payload)) {
		return ctx.json({ ok: false, reason: "invalid" }, { status: 400 });
	}

	const author = await readSession(ctx);
	const result = await submitMessage(
		{
			body: String(payload.body ?? ""),
			image: typeof payload.image === "string" ? payload.image : undefined,
			website: typeof payload.website === "string" ? payload.website : undefined,
		},
		author,
		clientOf(ctx),
	);

	if (!result.ok) return ctx.json(result, { status: STATUS[result.reason] ?? 400 });
	return ctx.json(result, { status: 201 });
}
