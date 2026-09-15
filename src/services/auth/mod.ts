// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Context } from "@july/snarl";
import { log } from "@july/snarl/verbosity";
import { describeError } from "~/services/core/errors.ts";
import { rememberAuthor } from "~/services/authors/mod.ts";
import type { Author, AuthorProvider } from "~/services/messages/types.ts";
import { completeDiscord, createDiscordAuthorisationUrl } from "./discord.ts";
import { completeLastFmAuthentication, createLastFmAuthorisationUrl } from "./lastfm.ts";
import { completeBluesky, createBlueskyAuthorisationUrl } from "./bluesky.ts";
import { randomState, readFlow, writeFlow, writeSession } from "./session.ts";
import { SERVICE } from "./config.ts";

export const PROVIDERS: readonly AuthorProvider[] = ["discord", "bluesky", "lastfm"];

export function isProvider(value: unknown): value is AuthorProvider {
	return typeof value === "string" && (PROVIDERS as readonly string[]).includes(value);
}

export type AuthOutcome =
	| { ok: true; author: Author }
	| { ok: false; reason: "state" | "denied" | "failed" };

export async function beginAuth(
	ctx: Context,
	provider: AuthorProvider,
	options: { handle?: string; returnTo: string },
): Promise<string> {
	const origin = ctx.url.origin;
	const state = randomState();
	const url = provider === "discord"
		? createDiscordAuthorisationUrl(origin, state)
		: provider === "lastfm"
		? createLastFmAuthorisationUrl(origin)
		: await createBlueskyAuthorisationUrl(origin, options.handle ?? "", state);

	await writeFlow(ctx, { provider, state, returnTo: options.returnTo, origin });
	return url;
}

export async function completeAuth(
	ctx: Context,
	provider: AuthorProvider,
): Promise<AuthOutcome & { returnTo: string }> {
	const flow = await readFlow(ctx);
	const returnTo = flow?.returnTo ?? "/";
	if (!flow || flow.provider !== provider) {
		return { ok: false, reason: "state", returnTo };
	}

	const query = ctx.query;
	if (query.get("error")) return { ok: false, reason: "denied", returnTo };

	if (provider === "discord" && query.get("state") !== flow.state) {
		return { ok: false, reason: "state", returnTo };
	}

	try {
		let author: Author;
		if (provider === "discord") {
			author = await completeDiscord(flow.origin, query.get("code") ?? "");
		} else if (provider === "lastfm") {
			author = await completeLastFmAuthentication(query.get("token") ?? "");
		} else {
			const result = await completeBluesky(flow.origin, query);
			if (result.state !== flow.state) return { ok: false, reason: "state", returnTo };
			author = result.author;
		}

		const remembered = await rememberAuthor(author);
		await writeSession(ctx, remembered);
		return { ok: true, author: remembered, returnTo };
	} catch (error) {
		log.warn(SERVICE, `${provider} sign-in failed: ${describeError(error)}`);
		return { ok: false, reason: "failed", returnTo };
	}
}

export { clearSession, readSession } from "./session.ts";
export { getBlueskyMetadata } from "./bluesky.ts";
