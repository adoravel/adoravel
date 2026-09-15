// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { log } from "@july/snarl/verbosity";
import { isProduction, readEnv, readOptionalEnv } from "~/services/core/env.ts";

export const SERVICE = "auth";

export const PUBLIC_URL: string = readEnv("PUBLIC_URL", "http://127.0.0.1:5173").replace(
	/\/$/,
	"",
);

function secret(): string {
	const configured = readOptionalEnv("SESSION_SECRET");
	if (configured) return configured;
	if (isProduction) throw new Error("SESSION_SECRET must be set in production");
	log.warn(
		SERVICE,
		"SESSION_SECRET not set, using a random secret (sessions reset on restart)",
	);
	return crypto.randomUUID() + crypto.randomUUID();
}

export const SESSION_SECRET: string = secret();

export const providerConfig = {
	discord: {
		clientId: readOptionalEnv("DISCORD_CLIENT_ID"),
		clientSecret: readOptionalEnv("DISCORD_CLIENT_SECRET"),
	},
	lastfm: {
		apiKey: readOptionalEnv("LASTFM_API_KEY"),
		apiSecret: readOptionalEnv("LASTFM_API_SECRET"),
	},
	bluesky: {
		handleResolver: readEnv("BLUESKY_HANDLE_RESOLVER", "https://bsky.social"),
	},
} as const;

export function getCallbackUrl(origin: string, provider: string): string {
	return `${origin}/auth/${provider}/callback`;
}

export function isLoopbackOrigin(origin: string): boolean {
	const { hostname } = new URL(origin);
	return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

export function getCanonicalOrigin(origin: string): string {
	const url = new URL(origin);
	if (url.hostname === "localhost") url.hostname = "127.0.0.1";
	if (!isLoopbackOrigin(url.origin) && PUBLIC_URL.startsWith("https://")) {
		return PUBLIC_URL;
	}
	return url.origin;
}
