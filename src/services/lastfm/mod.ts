// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { readNumberEnv } from "~/services/core/env.ts";
import { createPoller, type PolledResource } from "~/services/core/poller.ts";
import { fetchRecentTracks, SERVICE } from "./client.ts";
import type { Song } from "./types.ts";

const RECENT_TRACKS_LIMIT = 50;

export const recentTracks: PolledResource<Song[]> = createPoller({
	name: SERVICE,
	intervalSeconds: readNumberEnv("LASTFM_POLL_INTERVAL", 60),
	load: (signal) => fetchRecentTracks(RECENT_TRACKS_LIMIT, signal),
});

export type { Song } from "./types.ts";
