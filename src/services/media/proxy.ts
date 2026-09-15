// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { join } from "@std/path";
import { encodeHex } from "@std/encoding/hex";
import { log } from "@july/snarl/verbosity";
import { readEnv, readNumberEnv } from "~/services/core/env.ts";
import { describeError } from "~/services/core/errors.ts";
import { toWebp } from "./image.ts";

export const SERVICE = "media/proxy";

export const IMAGES_DIR = readEnv("IMAGES_DIR", "./data/images");
export const IMAGE_MAX_AGE_SECONDS = readNumberEnv("IMAGE_MAX_AGE_DAYS", 7) * 24 * 60 *
	60;

const MAX_AGE_MS = IMAGE_MAX_AGE_SECONDS * 1000;
const RETRY_AFTER_MS = 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 10_000;
const MAX_SOURCE_BYTES = 8 * 1024 * 1024;
const NAME_RE = /^[a-f0-9]{24}\.(?:webp|bin)$/;
const FILE_RE = /^([a-f0-9]{24})\.(?:webp|bin|type)$/;

export interface ProxyOptions {
	size?: number;
	fit?: "cover" | "inside";
}

export interface CachedImage {
	route: string;
	file: string;
	type: string;
}

interface Known {
	image: CachedImage | null;
	expiresAt: number;
}

const known = new Map<string, Known>();
const pending = new Map<string, Promise<CachedImage | undefined>>();

async function getKeyFor(url: string, options: ProxyOptions): Promise<string> {
	const input = `${url}|${options.size ?? ""}|${options.fit ?? ""}`;
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
	return encodeHex(digest).slice(0, 24);
}

export function getImagePathname(name: string): string {
	return `/images/${name}`;
}

interface Existing extends CachedImage {
	modifiedAt: number;
}

async function existing(key: string): Promise<Existing | undefined> {
	for (const extension of ["webp", "bin"] as const) {
		const file = join(IMAGES_DIR, `${key}.${extension}`);
		try {
			const info = await Deno.stat(file);
			const type = extension === "webp"
				? "image/webp"
				: await Deno.readTextFile(join(IMAGES_DIR, `${key}.type`)).catch(() =>
					"application/octet-stream"
				);
			return {
				route: getImagePathname(`${key}.${extension}`),
				file,
				type,
				modifiedAt: info.mtime?.getTime() ?? Date.now(),
			};
		} catch {
			continue;
		}
	}
	return undefined;
}

function isFresh(modifiedAt: number, now = Date.now()): boolean {
	return now - modifiedAt < MAX_AGE_MS;
}

async function touch(file: string): Promise<void> {
	const now = new Date();
	await Deno.utime(file, now, now).catch(() => undefined);
}

async function download(
	url: string,
	signal?: AbortSignal,
): Promise<{ bytes: Uint8Array; type: string }> {
	const timeout = AbortSignal.timeout(FETCH_TIMEOUT_MS);
	const response = await fetch(url, {
		signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
		headers: { Accept: "image/*" },
	});
	if (!response.ok) {
		await response.body?.cancel();
		throw new Error(`upstream responded ${response.status}`);
	}
	const type = response.headers.get("content-type")?.split(";")[0].trim() ?? "";
	if (!type.startsWith("image/")) {
		await response.body?.cancel();
		throw new Error(`upstream is not an image (${type || "unknown"})`);
	}
	const bytes = new Uint8Array(await response.arrayBuffer());
	if (bytes.length > MAX_SOURCE_BYTES) throw new Error("upstream image too large");
	return { bytes, type };
}

async function store(
	key: string,
	url: string,
	options: ProxyOptions,
	signal?: AbortSignal,
): Promise<CachedImage> {
	const { bytes, type } = await download(url, signal);
	const webp = options.size
		? await toWebp(bytes, options.size, options.fit ?? "inside")
		: null;
	await Deno.mkdir(IMAGES_DIR, { recursive: true });

	if (webp) {
		const file = join(IMAGES_DIR, `${key}.webp`);
		await Deno.writeFile(file, webp);
		return { route: getImagePathname(`${key}.webp`), file, type: "image/webp" };
	}

	const file = join(IMAGES_DIR, `${key}.bin`);
	await Deno.writeFile(file, bytes);
	await Deno.writeTextFile(join(IMAGES_DIR, `${key}.type`), type);
	return { route: getImagePathname(`${key}.bin`), file, type };
}

export function isExternalUrl(url: string | undefined): url is string {
	return typeof url === "string" && /^https?:\/\//i.test(url);
}

function remember(memo: string, image: CachedImage | null, ttl: number): void {
	known.set(memo, { image, expiresAt: Date.now() + ttl });
}

export function cacheImage(
	url: string,
	options: ProxyOptions = {},
	signal?: AbortSignal,
): Promise<CachedImage | undefined> {
	const memo = `${url}|${options.size ?? ""}|${options.fit ?? ""}`;
	const cached = known.get(memo);
	if (cached && cached.expiresAt > Date.now()) {
		return Promise.resolve(cached.image ?? undefined);
	}

	const inFlight = pending.get(memo);
	if (inFlight) return inFlight;

	const task = (async () => {
		const key = await getKeyFor(url, options);
		const found = await existing(key);
		if (found && isFresh(found.modifiedAt)) {
			remember(memo, found, found.modifiedAt + MAX_AGE_MS - Date.now());
			return found;
		}
		try {
			const stored = await store(key, url, options, signal);
			remember(memo, stored, MAX_AGE_MS);
			return stored;
		} catch (error) {
			if (signal?.aborted) return found;
			log.warn(
				SERVICE,
				`could not ${found ? "refresh" : "cache"} ${url}: ${describeError(error)}`,
			);
			if (found) await touch(found.file);
			remember(memo, found ?? null, RETRY_AFTER_MS);
			return found;
		}
	})().finally(() => pending.delete(memo));

	pending.set(memo, task);
	return task;
}

function isReferenced(key: string): boolean {
	for (const { image } of known.values()) {
		if (image && image.file.includes(key)) return true;
	}
	return false;
}

export interface SweepResult {
	removed: number;
	kept: number;
}

export async function sweepStaleImages(now = Date.now()): Promise<SweepResult> {
	const result: SweepResult = { removed: 0, kept: 0 };

	let entries: Deno.DirEntry[];
	try {
		entries = await Array.fromAsync(Deno.readDir(IMAGES_DIR));
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) return result;
		throw error;
	}

	for (const entry of entries) {
		const match = entry.isFile ? FILE_RE.exec(entry.name) : null;
		if (!match) continue;
		const path = join(IMAGES_DIR, entry.name);
		const info = await Deno.stat(path).catch(() => undefined);
		if (!info) continue;
		const modifiedAt = info.mtime?.getTime() ?? now;

		if (!isFresh(modifiedAt, now) && !isReferenced(match[1])) {
			await Deno.remove(path).catch((error) => {
				if (!(error instanceof Deno.errors.NotFound)) throw error;
			});
			result.removed++;
		} else {
			result.kept++;
		}
	}

	if (result.removed > 0) {
		log.info(
			SERVICE,
			`removed ${result.removed} cached image file(s) older than the limit`,
		);
	}
	return result;
}

export async function proxied(
	url: string | undefined,
	options: ProxyOptions = {},
	signal?: AbortSignal,
): Promise<string | undefined> {
	if (!isExternalUrl(url)) return url;
	const cached = await cacheImage(url, options, signal);
	return cached?.route ?? url;
}

export async function cachedImageFile(
	name: string,
): Promise<{ path: string; type: string } | undefined> {
	if (!NAME_RE.test(name)) return undefined;
	const key = name.slice(0, 24);
	const found = await existing(key);
	if (!found || !found.file.endsWith(name)) return undefined;
	return { path: found.file, type: found.type };
}
