// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Context } from "@july/snarl";
import { isProduction } from "~/services/core/env.ts";
import { hasShape, isOneOf, isString, optional } from "~/services/core/validate.ts";
import type { Author } from "~/services/messages/types.ts";
import { SESSION_SECRET } from "./config.ts";

export const SESSION_COOKIE = "session";
export const FLOW_COOKIE = "auth-flow";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const FLOW_MAX_AGE = 60 * 10;

const isAuthor = hasShape({
	provider: isOneOf(["discord", "bluesky", "lastfm"] as const),
	id: optional(isString),
	handle: isString,
	displayName: optional(isString),
	avatarUrl: optional(isString),
});

const cookieOptions = {
	path: "/",
	httpOnly: true,
	sameSite: "Lax" as const,
	secure: isProduction,
};

export async function readSession(ctx: Context): Promise<Author | null> {
	const raw = await ctx.cookies.getSigned(SESSION_COOKIE, SESSION_SECRET);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		return isAuthor(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

export async function writeSession(ctx: Context, author: Author): Promise<void> {
	await ctx.cookies.setSigned(SESSION_COOKIE, JSON.stringify(author), SESSION_SECRET, {
		...cookieOptions,
		maxAge: SESSION_MAX_AGE,
	});
}

export function clearSession(ctx: Context): void {
	ctx.cookies.delete(SESSION_COOKIE, { path: "/" });
}

export interface AuthFlow {
	provider: Author["provider"];
	state: string;
	returnTo: string;
	origin: string;
}

const isFlow = hasShape({
	provider: isOneOf(["discord", "bluesky", "lastfm"] as const),
	state: isString,
	returnTo: isString,
	origin: isString,
});

export async function writeFlow(ctx: Context, flow: AuthFlow): Promise<void> {
	await ctx.cookies.setSigned(FLOW_COOKIE, JSON.stringify(flow), SESSION_SECRET, {
		...cookieOptions,
		maxAge: FLOW_MAX_AGE,
	});
}

export async function readFlow(ctx: Context): Promise<AuthFlow | null> {
	const raw = await ctx.cookies.getSigned(FLOW_COOKIE, SESSION_SECRET);
	ctx.cookies.delete(FLOW_COOKIE, { path: "/" });
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		return isFlow(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

export function randomState(): string {
	return crypto.getRandomValues(new Uint8Array(24)).toHex();
}
