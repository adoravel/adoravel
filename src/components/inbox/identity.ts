// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Author, AuthorProvider } from "~/services/messages/types.ts";

export const PROVIDERS: readonly AuthorProvider[] = ["discord", "bluesky", "lastfm"];

export const PROVIDER_LABELS: Record<AuthorProvider, string> = {
	discord: "Discord",
	bluesky: "Bluesky",
	lastfm: "Last.fm",
};

export function profileUrl(author: Author): string | undefined {
	switch (author.provider) {
		case "discord":
			return author.id ? `https://discord.com/users/${author.id}` : undefined;
		case "bluesky":
			return `https://bsky.app/profile/${author.handle}`;
		case "lastfm":
			return `https://www.last.fm/user/${author.handle}`;
	}
}

export function signInUrl(
	provider: AuthorProvider,
	returnTo: string,
	handle?: string,
): string {
	const params = new URLSearchParams({ return: returnTo });
	if (handle) params.set("handle", handle.trim().replace(/^@/, ""));
	return `/auth/${provider}?${params}`;
}
