// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
	hasShape,
	isArrayOf,
	isOneOf,
	isRecord,
	isString,
	optional,
} from "~/services/core/validate.ts";

export const IMAGE_SIZES = ["small", "medium", "large", "extralarge"] as const;
export type ImageSize = typeof IMAGE_SIZES[number];

export interface LastFmImage {
	"#text": string;
	size: ImageSize;
}

export interface LastFmTrack {
	name: string;
	url: string;
	artist: { name: string };
	album: { "#text": string };
	image?: LastFmImage[];
	"@attr"?: { nowplaying?: string };
	date?: { uts: string };
	loved?: string;
}

export interface RecentTracksPayload {
	recenttracks: {
		track: LastFmTrack | LastFmTrack[];
	};
}

export interface LastFmErrorPayload {
	error: number;
	message: string;
}

const isImage = hasShape({
	"#text": isString,
	size: isOneOf(IMAGE_SIZES),
});

const isTrack = hasShape({
	name: isString,
	url: isString,
	artist: hasShape({ name: isString }),
	album: hasShape({ "#text": isString }),
	image: optional(isArrayOf(isImage)),
	"@attr": optional(hasShape({ nowplaying: optional(isString) })),
	date: optional(hasShape({ uts: isString })),
	loved: optional(isString),
});

export function isRecentTracksPayload(value: unknown): value is RecentTracksPayload {
	if (!isRecord(value) || !isRecord(value.recenttracks)) return false;
	const { track } = value.recenttracks;
	return Array.isArray(track) ? track.every(isTrack) : isTrack(track);
}

export const isErrorPayload: (value: unknown) => value is LastFmErrorPayload = hasShape({
	error: (value): value is number => typeof value === "number",
	message: isString,
});

export interface Song {
	title: string;
	artist: string;
	album: string;
	url: string;
	coverUrl?: string;
	coverBlurhash?: string;
	loved: boolean;
	playing: boolean;
	plays: number;
	scrobbledAt?: string;
}
