// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

export const RESUME_PAGE = {
	width: 595.28,
	height: 841.89,
	marginX: 48,
	marginY: 44,
} as const;

export const RESUME_SIZE = {
	name: 24,
	headline: 10.5,
	heading: 10.5,
	body: 9.5,
	small: 8.5,
	chip: 8.5,
} as const;

export const RESUME_LEADING = 1.38;

export const RESUME_GAP = {
	paragraph: 5,
	entry: 8,
	section: 13,
	heading: 7,
	bullet: 12,
	chip: 6,
} as const;

export const RESUME_COLOUR = {
	paper: "#ffffff",
	text: "#17171b",
	subtext: "#45454b",
	muted: "#7a7a82",
	rule: "#d9d9de",
	chip: "#f1f1f3",
	chipText: "#2a2a30",
} as const;

export type ResumeColour = keyof typeof RESUME_COLOUR;
