// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { crypto } from "@std/crypto";
import { encodeHex } from "@std/encoding/hex";
import { ServiceError } from "~/services/core/errors.ts";
import { buildUrl, fetchJson } from "~/services/core/http.ts";
import { hasShape, isArrayOf, isString, optional } from "~/services/core/validate.ts";
import type { Author } from "~/services/messages/types.ts";
import { getCallbackUrl, providerConfig, SERVICE } from "./config.ts";
import { cleanDisplayName } from "./names.ts";

const AUTH_URL = "https://www.last.fm/api/auth/";
const API_URL = "https://ws.audioscrobbler.com/2.0/";

const isSession = hasShape({ session: hasShape({ name: isString, key: isString }) });

const isUserInfo = hasShape({
	user: hasShape({
		name: isString,
		realname: optional(isString),
		url: optional(isString),
		image: optional(isArrayOf(hasShape({ size: isString, "#text": isString }))),
	}),
});

function credentials(): { apiKey: string; apiSecret: string } {
	const { apiKey, apiSecret } = providerConfig.lastfm;
	if (!apiKey || !apiSecret) {
		throw new ServiceError(SERVICE, "config", "last.fm auth is not configured");
	}
	return { apiKey, apiSecret };
}

async function sign(params: Record<string, string>, secret: string): Promise<string> {
	const base = Object.keys(params)
		.sort()
		.map((key) => `${key}${params[key]}`)
		.join("") + secret;
	const digest = await crypto.subtle.digest("MD5", new TextEncoder().encode(base));
	return encodeHex(digest);
}

export function createLastFmAuthorisationUrl(origin: string): string {
	const { apiKey } = credentials();
	const url = new URL(AUTH_URL);
	url.searchParams.set("api_key", apiKey);
	url.searchParams.set("cb", getCallbackUrl(origin, "lastfm"));
	return url.href;
}

export async function completeLastFmAuthentication(token: string): Promise<Author> {
	const { apiKey, apiSecret } = credentials();

	const sessionParams = { api_key: apiKey, method: "auth.getSession", token };
	const session = await fetchJson({
		service: SERVICE,
		url: buildUrl(API_URL, {
			...sessionParams,
			api_sig: await sign(sessionParams, apiSecret),
			format: "json",
		}),
		guard: isSession,
	});

	const info = await fetchJson({
		service: SERVICE,
		url: buildUrl(API_URL, {
			method: "user.getInfo",
			user: session.session.name,
			api_key: apiKey,
			format: "json",
		}),
		guard: isUserInfo,
	});

	const { user } = info;
	const image = user.image?.find((entry) => entry.size === "extralarge")?.["#text"] ||
		user.image?.at(-1)?.["#text"];

	return {
		provider: "lastfm",
		handle: user.name,
		displayName: cleanDisplayName(user.realname, user.name),
		avatarUrl: image || undefined,
	};
}
