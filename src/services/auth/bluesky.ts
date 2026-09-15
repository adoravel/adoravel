// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { dirname } from "@std/path";
import {
	MemoryStore,
	OAuthClient,
	type PublicClientMetadata,
	type SessionStore,
	type StateStore,
	type Store,
	type StoredState,
} from "@atcute/oauth-node-client";
import {
	CompositeDidDocumentResolver,
	CompositeHandleResolver,
	DohJsonHandleResolver,
	LocalActorResolver,
	PlcDidDocumentResolver,
	WebDidDocumentResolver,
	WellKnownHandleResolver,
} from "@atcute/identity-resolver";
import type { ActorIdentifier } from "@atcute/lexicons";
import { readEnv } from "~/services/core/env.ts";
import { ServiceError } from "~/services/core/errors.ts";
import { fetchJson } from "~/services/core/http.ts";
import { hasShape, isString, optional } from "~/services/core/validate.ts";
import { site } from "~/config/site.ts";
import type { Author } from "~/services/messages/types.ts";
import { getCallbackUrl, isLoopbackOrigin, PUBLIC_URL, SERVICE } from "./config.ts";
import { cleanDisplayName } from "./names.ts";

const PROFILE_URL = "https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile";
const SCOPE = "atproto";
const STATE_FILE = readEnv("ATPROTO_STATE_FILE", "./data/atproto-state.json");
const DOH_URL = readEnv("DOH_URL", "https://cloudflare-dns.com/dns-query");

const isProfile = hasShape({
	did: isString,
	handle: isString,
	displayName: optional(isString),
	avatar: optional(isString),
});

function fileStore<V>(path: string): Store<string, V> {
	let cache: Record<string, V> | undefined;

	async function load(): Promise<Record<string, V>> {
		if (cache) return cache;
		try {
			cache = JSON.parse(await Deno.readTextFile(path)) as Record<string, V>;
		} catch {
			cache = {};
		}
		return cache;
	}

	async function save(): Promise<void> {
		await Deno.mkdir(dirname(path), { recursive: true });
		await Deno.writeTextFile(path, JSON.stringify(cache ?? {}));
	}

	return {
		get: async (key) => (await load())[key],
		set: async (key, value) => {
			(await load())[key] = value;
			await save();
		},
		delete: async (key) => {
			delete (await load())[key];
			await save();
		},
		clear: async () => {
			cache = {};
			await save();
		},
	};
}

function getMetadataFor(origin: string): PublicClientMetadata {
	if (isLoopbackOrigin(origin)) {
		return { redirect_uris: [getCallbackUrl(origin, "bluesky")], scope: SCOPE };
	}
	return {
		client_id: `${PUBLIC_URL}/oauth/client-metadata.json`,
		client_name: site.name,
		client_uri: PUBLIC_URL,
		redirect_uris: [getCallbackUrl(PUBLIC_URL, "bluesky")],
		scope: SCOPE,
		application_type: "web",
	};
}

const clients = new Map<string, OAuthClient>();
const states = fileStore<StoredState>(STATE_FILE);

function createOAuthClient(origin: string): OAuthClient {
	const key = isLoopbackOrigin(origin) ? origin : PUBLIC_URL;
	let client = clients.get(key);
	if (!client) {
		client = new OAuthClient({
			metadata: getMetadataFor(origin),
			stores: {
				sessions: new MemoryStore() as SessionStore,
				states: states as StateStore,
			},
			actorResolver: new LocalActorResolver({
				handleResolver: new CompositeHandleResolver({
					methods: {
						dns: new DohJsonHandleResolver({ dohUrl: DOH_URL }),
						http: new WellKnownHandleResolver(),
					},
				}),
				didDocumentResolver: new CompositeDidDocumentResolver({
					methods: {
						plc: new PlcDidDocumentResolver(),
						web: new WebDidDocumentResolver(),
					},
				}),
			}),
		});
		clients.set(key, client);
	}
	return client;
}

export function getBlueskyMetadata(): PublicClientMetadata {
	return createOAuthClient(PUBLIC_URL).metadata as PublicClientMetadata;
}

export async function createBlueskyAuthorisationUrl(
	origin: string,
	handle: string,
	state: string,
): Promise<string> {
	const identifier = handle.trim().replace(/^@/, "");
	if (!identifier) {
		throw new ServiceError(SERVICE, "config", "a bluesky handle is required");
	}

	const { url } = await createOAuthClient(origin).authorize({
		target: { type: "account", identifier: identifier as ActorIdentifier },
		scope: SCOPE,
		state,
	});
	return url.href;
}

export async function completeBluesky(
	origin: string,
	params: URLSearchParams,
): Promise<{ author: Author; state: string | null }> {
	const { session, state } = await createOAuthClient(origin).callback(params);
	const did = session.did;

	const profile = await fetchJson({
		service: SERVICE,
		url: `${PROFILE_URL}?actor=${encodeURIComponent(did)}`,
		guard: isProfile,
	});

	await session.signOut().catch(() => undefined);

	return {
		state: typeof state === "string" ? state : null,
		author: {
			provider: "bluesky",
			id: profile.did,
			handle: profile.handle,
			displayName: cleanDisplayName(profile.displayName, profile.handle),
			avatarUrl: profile.avatar,
		},
	};
}
