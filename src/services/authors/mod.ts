// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { dirname, join } from "@std/path";
import { log } from "@july/snarl/verbosity";
import { readEnv } from "~/services/core/env.ts";
import { describeError } from "~/services/core/errors.ts";
import { hasShape, isOneOf, isString, optional } from "~/services/core/validate.ts";
import { toWebp } from "~/services/media/image.ts";
import { isExternalUrl, proxied } from "~/services/media/proxy.ts";
import type { Author } from "~/services/messages/types.ts";

export const SERVICE = "authors";

export const AUTHORS_DIR = readEnv("AUTHORS_DIR", "./data/authors");
export const AVATARS_DIR = readEnv("AVATARS_DIR", "./data/avatars");
const AVATAR_SIZE = 128;
const FETCH_TIMEOUT_MS = 8_000;
const FALLBACK_AVATARS = readEnv(
	"FALLBACK_AVATAR_URL",
	"https://api.dicebear.com/9.x/thumbs/svg",
);

export function fallbackAvatarUrl(seed: string): string {
	return `${FALLBACK_AVATARS}?seed=${encodeURIComponent(seed)}&radius=50`;
}

const isCachedAuthor = hasShape({
	provider: isOneOf(["discord", "bluesky", "lastfm"] as const),
	id: optional(isString),
	handle: isString,
	displayName: optional(isString),
	avatarUrl: optional(isString),
	sourceAvatarUrl: optional(isString),
	updatedAt: isString,
});

type CachedAuthor = Author & { sourceAvatarUrl?: string; updatedAt: string };

const memory = new Map<string, CachedAuthor>();

function safe(value: string): string {
	return value.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(
		0,
		64,
	);
}

export function authorKey(author: Pick<Author, "provider" | "id" | "handle">): string {
	return `${author.provider}-${safe(author.id ?? author.handle)}`;
}

async function readCached(key: string): Promise<CachedAuthor | undefined> {
	const cached = memory.get(key);
	if (cached) return cached;
	try {
		const parsed = JSON.parse(await Deno.readTextFile(join(AUTHORS_DIR, `${key}.json`)));
		if (isCachedAuthor(parsed)) {
			memory.set(key, parsed);
			return parsed;
		}
	} catch {
		return undefined;
	}
	return undefined;
}

async function writeCached(key: string, author: CachedAuthor): Promise<void> {
	const path = join(AUTHORS_DIR, `${key}.json`);
	await Deno.mkdir(dirname(path), { recursive: true });
	await Deno.writeTextFile(path, JSON.stringify(author, null, "\t"));
	memory.set(key, author);
}

async function cacheAvatar(key: string, url: string): Promise<boolean> {
	const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
	if (!response.ok) {
		await response.body?.cancel();
		return false;
	}
	const bytes = new Uint8Array(await response.arrayBuffer());
	const webp = await toWebp(bytes, AVATAR_SIZE);
	const path = join(AVATARS_DIR, `${key}.${webp ? "webp" : "bin"}`);
	await Deno.mkdir(AVATARS_DIR, { recursive: true });
	await Deno.writeFile(path, webp ?? bytes);
	if (!webp) {
		await Deno.writeTextFile(
			join(AVATARS_DIR, `${key}.type`),
			response.headers.get("content-type") ?? "application/octet-stream",
		);
	}
	return true;
}

export async function cachedAvatarFile(
	key: string,
): Promise<{ path: string; type: string } | undefined> {
	const webp = join(AVATARS_DIR, `${key}.webp`);
	try {
		await Deno.stat(webp);
		return { path: webp, type: "image/webp" };
	} catch {
		try {
			const raw = join(AVATARS_DIR, `${key}.bin`);
			await Deno.stat(raw);
			const type = await Deno.readTextFile(join(AVATARS_DIR, `${key}.type`)).catch(() =>
				"application/octet-stream"
			);
			return { path: raw, type };
		} catch {
			return undefined;
		}
	}
}

export function avatarRoute(key: string): string {
	return `/avatars/${key}`;
}

export async function rememberAuthor(author: Author): Promise<Author> {
	const key = authorKey(author);
	const previous = await readCached(key);
	let hasAvatar = (await cachedAvatarFile(key)) !== undefined;

	const changed = author.avatarUrl !== undefined &&
		author.avatarUrl !== previous?.sourceAvatarUrl;
	if (author.avatarUrl && (changed || !hasAvatar)) {
		try {
			hasAvatar = await cacheAvatar(key, author.avatarUrl);
		} catch (error) {
			log.warn(SERVICE, `avatar for ${key} not refreshed: ${describeError(error)}`);
		}
	}

	if (!hasAvatar) {
		try {
			hasAvatar = await cacheAvatar(key, fallbackAvatarUrl(key));
		} catch (error) {
			log.warn(
				SERVICE,
				`fallback avatar for ${key} unavailable: ${describeError(error)}`,
			);
		}
	}

	const resolved: Author = {
		provider: author.provider,
		id: author.id ?? previous?.id,
		handle: author.handle,
		displayName: author.displayName,
		avatarUrl: hasAvatar
			? avatarRoute(key)
			: await proxied(fallbackAvatarUrl(key), { size: AVATAR_SIZE }),
	};

	await writeCached(key, {
		...resolved,
		sourceAvatarUrl: author.avatarUrl ?? previous?.sourceAvatarUrl,
		updatedAt: new Date().toISOString(),
	});

	return resolved;
}

export async function touchAuthor(author: Author): Promise<void> {
	const key = authorKey(author);
	const now = new Date();
	const files = [
		join(AUTHORS_DIR, `${key}.json`),
		join(AVATARS_DIR, `${key}.webp`),
		join(AVATARS_DIR, `${key}.bin`),
		join(AVATARS_DIR, `${key}.type`),
	];
	await Promise.all(
		files.map((file) => Deno.utime(file, now, now).catch(() => undefined)),
	);
}

export function isAuthorFile(name: string): { key: string } | undefined {
	const match = /^([a-z0-9._-]+)\.(?:json|webp|bin|type)$/.exec(name);
	return match ? { key: match[1] } : undefined;
}

export async function latestAuthor(author: Author): Promise<Author> {
	const cached = await readCached(authorKey(author));
	const merged: Author = cached
		? {
			provider: cached.provider,
			id: cached.id ?? author.id,
			handle: cached.handle,
			displayName: cached.displayName ?? author.displayName,
			avatarUrl: cached.avatarUrl ?? author.avatarUrl,
		}
		: author;
	const avatarUrl = await proxied(merged.avatarUrl, { size: AVATAR_SIZE });
	const usable = avatarUrl !== undefined && !isExternalUrl(avatarUrl);
	return {
		...merged,
		avatarUrl: usable
			? avatarUrl
			: await proxied(fallbackAvatarUrl(authorKey(merged)), { size: AVATAR_SIZE }),
	};
}
