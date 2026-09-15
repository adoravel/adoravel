// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { fetchJson } from "~/services/core/http.ts";
import { site } from "~/config/site.ts";
import {
	type ContributionDay,
	type ContributionSummary,
	isContributionsPayload,
} from "./types.ts";

export const SERVICE = "github";

const API_URL = "https://github-contributions-api.jogruber.de/v4";
const WEEKS_SHOWN = 42;

function summarise(days: ContributionDay[]): ContributionSummary {
	return {
		days,
		total: days.reduce((sum, day) => sum + day.count, 0),
		from: days.at(0)?.date,
		to: days.at(-1)?.date,
	};
}

export async function fetchContributions(
	signal?: AbortSignal,
): Promise<ContributionSummary> {
	const payload = await fetchJson({
		service: SERVICE,
		url: `${API_URL}/${encodeURIComponent(site.github.user)}?y=last`,
		guard: isContributionsPayload,
		signal,
	});

	const sorted = [...payload.contributions].sort((a, b) => a.date.localeCompare(b.date));
	return summarise(sorted.slice(-WEEKS_SHOWN * 7));
}
