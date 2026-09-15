// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { readNumberEnv } from "~/services/core/env.ts";
import { createPoller, type PolledResource } from "~/services/core/poller.ts";
import { fetchContributions, SERVICE } from "./client.ts";
import { fetchRepositories, type Repository } from "./repositories.ts";
import type { ContributionSummary } from "./types.ts";

export const contributions: PolledResource<ContributionSummary> = createPoller({
	name: SERVICE,
	intervalSeconds: readNumberEnv("GITHUB_POLL_INTERVAL", 3600),
	load: fetchContributions,
});

export const repositories: PolledResource<Repository[]> = createPoller({
	name: SERVICE,
	intervalSeconds: readNumberEnv("GITHUB_POLL_INTERVAL", 3600),
	load: fetchRepositories,
});

export type { ContributionDay, ContributionLevel, ContributionSummary } from "./types.ts";
export type { Repository } from "./repositories.ts";
