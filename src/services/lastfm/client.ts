// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { readEnv } from "~/services/core/env.ts";
import { ServiceError } from "~/services/core/errors.ts";
import { buildUrl, fetchJson } from "~/services/core/http.ts";
import { asList, type Guard } from "~/services/core/validate.ts";
import { site } from "~/config/site.ts";
import { blurhashFor } from "~/services/media/blurhash.ts";
import { proxied } from "~/services/media/proxy.ts";
import {
	IMAGE_SIZES,
	isErrorPayload,
	isRecentTracksPayload,
	type LastFmImage,
	type LastFmTrack,
	type Song,
} from "./types.ts";

export const SERVICE = "last.fm";

const API_URL = "https://ws.audioscrobbler.com/2.0/";
const API_KEY = readEnv("LASTFM_API_KEY", "6ed42890522918c59b5459a65ece5818");

type Method = "user.getRecentTracks";

function isApiResponse<T>(guard: Guard<T>): Guard<T> {
	return (value): value is T => {
		if (isErrorPayload(value)) {
			throw new ServiceError(
				SERVICE,
				"http",
				`api error ${value.error}: ${value.message}`,
			);
		}
		return guard(value);
	};
}

async function call<T>(
	method: Method,
	params: Record<string, string | number>,
	guard: Guard<T>,
	signal?: AbortSignal,
): Promise<T> {
	if (!API_KEY) {
		throw new ServiceError(SERVICE, "config", "LASTFM_API_KEY is not set");
	}

	return await fetchJson({
		service: SERVICE,
		url: buildUrl(API_URL, { ...params, method, api_key: API_KEY, format: "json" }),
		guard: isApiResponse(guard),
		signal,
	});
}

function largestImage(images: LastFmImage[] | undefined): string | undefined {
	if (!images?.length) return undefined;

	const ranked = [...images].sort(
		(a, b) => IMAGE_SIZES.indexOf(b.size) - IMAGE_SIZES.indexOf(a.size),
	);
	return ranked.find((image) => image["#text"])?.["#text"];
}

function scrobbleTime(uts: string | undefined): string | undefined {
	if (!uts) return undefined;
	const seconds = Number(uts);
	return Number.isFinite(seconds) ? new Date(seconds * 1000).toISOString() : undefined;
}

export function toSong(track: LastFmTrack): Song {
	return {
		title: track.name,
		artist: track.artist.name,
		album: track.album["#text"],
		url: track.url,
		coverUrl: largestImage(track.image),
		loved: track.loved === "1",
		playing: track["@attr"]?.nowplaying === "true",
		plays: 1,
		scrobbledAt: scrobbleTime(track.date?.uts),
	};
}

export async function fetchRecentTracks(
	limit: number,
	signal?: AbortSignal,
): Promise<Song[]> {
	const payload = await call(
		"user.getRecentTracks",
		{ user: site.lastfm.user, limit, extended: 1 },
		isRecentTracksPayload,
		signal,
	);

	const songs = collapseRepeats(asList(payload.recenttracks.track).map(toSong));
	return await withCovers(songs, signal);
}

function songKey(song: Song): string {
	return song.url || `${song.artist}\u0000${song.title}`.toLowerCase();
}

export function collapseRepeats(songs: Song[]): Song[] {
	const seen = new Map<string, Song>();
	for (const song of songs) {
		const key = songKey(song);
		const existing = seen.get(key);
		if (existing) {
			existing.plays += 1;
			existing.loved ||= song.loved;
		} else {
			seen.set(key, { ...song });
		}
	}
	return [...seen.values()];
}

const COVER_SIZE = 320;

async function withCovers(songs: Song[], signal?: AbortSignal): Promise<Song[]> {
	const covers = [
		...new Set(songs.flatMap((song) => song.coverUrl ? [song.coverUrl] : [])),
	];
	const resolved = new Map(
		await Promise.all(
			covers.map(async (url) =>
				[url, {
					blurhash: await blurhashFor(url, signal),
					local: await proxied(url, { size: COVER_SIZE, fit: "cover" }, signal),
				}] as const
			),
		),
	);

	return songs.map((song) => {
		if (!song.coverUrl) return song;
		const cover = resolved.get(song.coverUrl);
		return {
			...song,
			coverUrl: cover?.local ?? song.coverUrl,
			coverBlurhash: cover?.blurhash,
		};
	});
}
