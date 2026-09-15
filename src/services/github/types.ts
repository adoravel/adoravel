// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
	hasShape,
	isArrayOf,
	isNumber,
	isOneOf,
	isString,
} from "~/services/core/validate.ts";

export const CONTRIBUTION_LEVELS = [0, 1, 2, 3, 4] as const;
export type ContributionLevel = typeof CONTRIBUTION_LEVELS[number];

export interface ContributionDay {
	date: string;
	count: number;
	level: ContributionLevel;
}

export interface ContributionsPayload {
	contributions: ContributionDay[];
}

export const isContributionDay: (value: unknown) => value is ContributionDay = hasShape({
	date: isString,
	count: isNumber,
	level: isOneOf(CONTRIBUTION_LEVELS),
});

export const isContributionsPayload: (value: unknown) => value is ContributionsPayload =
	hasShape({
		contributions: isArrayOf(isContributionDay),
	});

export interface ContributionSummary {
	days: ContributionDay[];
	total: number;
	from?: string;
	to?: string;
}
