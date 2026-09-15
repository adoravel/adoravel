// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { design } from "./design.ts";

export const fontFamily = {
	default: '"Public Sans", "Geist", "Inter", -apple-system, sans-serif',
	mono: '"Iosevka", "Iosevka Custom Web", "Iosevka Custom", ui-monospace, monospace',
	heading: '"Public Sans", "Geist", "Inter", -apple-system, sans-serif',
} as const;

export const {
	spacing,
	fontSize,
	radius,
	ease,
	boundaries,
	elevation,
	stagger,
} = design;

export const media = {
	mobile: `@media (max-width: ${boundaries.mobileMaxWidth})`,
	reducedMotion: "@media (prefers-reduced-motion: reduce)",
	hover: "@media (hover: hover) and (pointer: fine)",
} as const;

export { palette, theme, themeStyles } from "./design.ts";
