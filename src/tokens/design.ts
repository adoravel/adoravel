// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { em, px, rem } from "./units.ts";

export const currentScheme: "blue" | "rose" | "orangeish" = "rose";

type DeepResolveTokens<T> = {
	[K in keyof T]: T[K] extends object ? {
			[P in keyof T[K] as P | (P extends `${infer N extends number}` ? N : never)]:
				T[K][P] extends object ? DeepResolveTokens<T[K][P]>
					: T[K][P] extends number ? string
					: T[K][P];
		}
		: T[K] extends number ? string
		: T[K];
};

export function createTheme<T extends object>(tokens: T): DeepResolveTokens<T> {
	const resolve = (input: any): any => {
		if (typeof input !== "object" || input === null) {
			return typeof input === "number" ? `${input}` : input;
		}

		return Object.fromEntries(
			Object.entries(input).map(([key, value]) => [key, resolve(value)]),
		);
	};

	return resolve(tokens);
}

export const palette = createTheme({
	theme: {
		white: "#fafafa",
		gray50: "#f5f5f5",
		gray100: "#ebebeb",
		gray200: "#d6d6d6",
		gray300: "#b3b3b3",
		gray400: "#8a8a8a",
		gray500: "#6b6b6b",
		gray600: "#525252",
		gray700: "#3d3d3d",
		gray800: "#262626",
		gray850: "#1c1c1c",
		gray900: "#141414",
		gray950: "#0c0c0c",
		black: "#050505",

		base: "#09090b",
		baseBorder: "#1a1a1e",
		background: "#0c0c0e",
		surface: "#131316",
		surfaceBorder: "#222226",
		surfaceHover: "rgba(255, 255, 255, 0.03)",
		surfaceBorderHover: "rgba(255, 255, 255, 0.12)",
		lift: "#2a2a2e",
		liftBorder: "#38383c",

		text: "#f0f0f2",
		subtext: "#a8a8b0",
		textMuted: "#6e6e76",
		textMutedHover: "#d0d0d6",
		textInverted: "#09090b",

		rose: "#f2b8c8",
		roseDim: "#c48a9c",
		roseBackground: "rgba(242, 184, 200, 0.08)",
		roseBorder: "rgba(242, 184, 200, 0.2)",

		buttonBg: "#f0f0f2",
		buttonBgHover: "#ffffff",
		buttonText: "#09090b",
		buttonOutlineBorder: "#2a2a2e",
		buttonOutlineBorderHover: "#444448",
		buttonGhostHover: "rgba(255, 255, 255, 0.05)",
		buttonDestructive: "#f87171",

		glass: "rgba(12, 12, 14, 0.7)",
		glassBorder: "rgba(255, 255, 255, 0.06)",
	},
});

export const design = createTheme({
	spacing: {
		letter: {
			tight: em(-.04),
			normal: em(-.01),
			wide: em(.06),
		},
		pill: `${rem(0.375)} ${rem(0.875)}`,
		"0.5": rem(0.125),
		"1": rem(0.25),
		"1.5": rem(0.375),
		"2": rem(0.5),
		"2.5": rem(0.625),
		"3": rem(0.75),
		"3.5": rem(0.875),
		"4": rem(1),
		"5": rem(1.25),
		"6": rem(1.5),
		"7": rem(1.75),
		"8": rem(2),
		"9": rem(2.25),
		"10": rem(2.5),
		"12": rem(3),
		"16": rem(4),
		"20": rem(5),
		"24": rem(6),
		"section": rem(6.4),
	},
	fontSize: {
		"2xs": rem(0.625),
		xs: rem(0.6875),
		sm: rem(0.8125),
		md: rem(0.875),
		body: rem(0.9375),
		base: rem(1),
		root: px(16),
		lg: rem(1.125),
		xl: rem(1.375),
		"2xl": rem(1.875),
		"3xl": rem(2.5),
		"4xl": rem(3.25),
		display: rem(4.5),
	},
	radius: {
		sm: px(6),
		md: px(8),
		lg: px(12),
		xl: px(16),
		"2xl": px(20),
		full: px(9999),
	},
	ease: {
		fast: "0.15s cubic-bezier(0.4, 0, 0.2, 1)",
		normal: "0.25s cubic-bezier(0.4, 0, 0.2, 1)",
		spring: "0.4s cubic-bezier(0.22, 1.6, 0.36, 1)",
		reveal: "0.6s cubic-bezier(0.16, 1, 0.3, 1)",
		slow: "0.8s cubic-bezier(0.16, 1, 0.3, 1)",
		popSpring: "0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
		snap: "0.18s cubic-bezier(0.16, 1, 0.3, 1)",
		hover: "0.32s cubic-bezier(0.16, 1, 0.3, 1)",
		shake: "0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
	},
	stagger: {
		fast: "40ms",
		normal: "70ms",
		slow: "110ms",
	},
	elevation: {
		below: "-1",
		base: "0",
		raised: "10",
		overlay: "20",
		modal: "30",
		toast: "40",
	},
	boundaries: {
		mobileMaxWidth: px(799),
		tabletMaxWidth: px(1024),
		maxWidth: rem(48),
		contentWidth: rem(48),
		avatarSize: rem(4.5),
		coverSize: px(160),
		lineHeight: 1.65,
	},
});

const toKebabCase = (str: string) => str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

function toCSSVariableRecord(varsMap: Record<string, string>): string {
	return Object.entries(varsMap)
		.map(([key, val]) => `--colour-${toKebabCase(key)}: ${val};`)
		.join("\n\t\t");
}

const sharedLightMap = {
	base: palette.theme.white,
	baseBorder: palette.theme.gray200,
	background: palette.theme.gray50,
	surface: palette.theme.gray100,
	surfaceBorder: palette.theme.gray200,
	surfaceHover: "rgba(0, 0, 0, 0.03)",
	surfaceBorderHover: "rgba(0, 0, 0, 0.08)",
	lift: palette.theme.gray200,
	liftBorder: palette.theme.gray300,

	text: palette.theme.gray900,
	subtext: palette.theme.gray600,
	textMuted: palette.theme.gray400,
	textMutedHover: palette.theme.gray700,
	textInverted: palette.theme.white,

	buttonBg: palette.theme.gray900,
	buttonBgHover: palette.theme.black,
	buttonText: palette.theme.white,
	buttonOutlineBorder: palette.theme.gray300,
	buttonOutlineBorderHover: palette.theme.gray400,
	buttonGhostHover: "rgba(0, 0, 0, 0.04)",
	danger: "#dc2626",

	glass: "rgba(250, 250, 250, 0.75)",
	glassBorder: "rgba(0, 0, 0, 0.05)",
};

const sharedDarkMap = {
	base: palette.theme.base,
	baseBorder: palette.theme.baseBorder,
	background: palette.theme.background,
	surface: palette.theme.surface,
	surfaceBorder: palette.theme.surfaceBorder,
	surfaceHover: palette.theme.surfaceHover,
	surfaceBorderHover: palette.theme.surfaceBorderHover,
	lift: palette.theme.lift,
	liftBorder: palette.theme.liftBorder,

	text: palette.theme.text,
	subtext: palette.theme.subtext,
	textMuted: palette.theme.textMuted,
	textMutedHover: palette.theme.textMutedHover,
	textInverted: palette.theme.textInverted,

	buttonBg: palette.theme.buttonBg,
	buttonBgHover: palette.theme.buttonBgHover,
	buttonText: palette.theme.buttonText,
	buttonOutlineBorder: palette.theme.buttonOutlineBorder,
	buttonOutlineBorderHover: palette.theme.buttonOutlineBorderHover,
	buttonGhostHover: palette.theme.buttonGhostHover,
	danger: palette.theme.buttonDestructive,

	glass: palette.theme.glass,
	glassBorder: palette.theme.glassBorder,
};

const schemeTokens = {
	blue: {
		light: {
			accent: "#4f46e5",
			accentDim: "#6366f1",
			accentBright: "#3730a3",
			accentBackground: "rgba(79, 70, 229, 0.06)",
			accentBorder: "rgba(79, 70, 229, 0.15)",
			onAccent: palette.theme.white,
			ring: "rgba(79, 70, 229, 0.4)",
			heat0: "#f5f5f5",
			heat1: "#e0e7ff",
			heat2: "#c7d2fe",
			heat3: "#818cf8",
			heat4: "#4f46e5",
			heat5: "#312e81",
		},
		dark: {
			accent: "#b4befe",
			accentDim: "#8b96d4",
			accentBright: "#cdd5ff",
			accentBackground: "rgba(180, 190, 254, 0.08)",
			accentBorder: "rgba(180, 190, 254, 0.2)",
			onAccent: "#0c0c1a",
			ring: "rgba(180, 190, 254, 0.4)",
			heat0: "#161618",
			heat1: "#1e2030",
			heat2: "#2d3252",
			heat3: "#4a5280",
			heat4: "#7882c0",
			heat5: "#b4befe",
		},
	},
	rose: {
		light: {
			accent: "#db2777",
			accentDim: "#f472b6",
			accentBright: "#9d174d",
			accentBackground: "rgba(219, 39, 119, 0.06)",
			accentBorder: "rgba(219, 39, 119, 0.15)",
			onAccent: palette.theme.white,
			ring: "rgba(219, 39, 119, 0.4)",
			heat0: "#f5f5f5",
			heat1: "#fce7f3",
			heat2: "#fbcfe8",
			heat3: "#f472b6",
			heat4: "#db2777",
			heat5: "#831843",
		},
		dark: {
			accent: "#f2b8c8",
			accentDim: "#c48a9c",
			accentBright: "#fcd3de",
			accentBackground: "rgba(242, 184, 200, 0.08)",
			accentBorder: "rgba(242, 184, 200, 0.2)",
			onAccent: "#1a0c10",
			ring: "rgba(242, 184, 200, 0.4)",
			heat0: "#161618",
			heat1: "#241a1d",
			heat2: "#45242d",
			heat3: "#733343",
			heat4: "#b3546d",
			heat5: "#f2b8c8",
		},
	},
	orangeish: {
		light: {
			accent: "#ea580c",
			accentDim: "#fb923c",
			accentBright: "#9a3412",
			accentBackground: "rgba(234, 88, 12, 0.06)",
			accentBorder: "rgba(234, 88, 12, 0.15)",
			onAccent: palette.theme.white,
			ring: "rgba(234, 88, 12, 0.4)",
			heat0: "#f5f5f5",
			heat1: "#ffedd5",
			heat2: "#fed7aa",
			heat3: "#fb923c",
			heat4: "#ea580c",
			heat5: "#7c2d12",
		},
		dark: {
			accent: "#ffba85",
			accentDim: "#e08c4d",
			accentBright: "#ffe2cc",
			accentBackground: "rgba(255, 186, 133, 0.08)",
			accentBorder: "rgba(255, 186, 133, 0.2)",
			onAccent: "#1c1007",
			ring: "rgba(255, 186, 133, 0.4)",
			heat0: "#161618",
			heat1: "#241c16",
			heat2: "#452b1a",
			heat3: "#734324",
			heat4: "#b36b35",
			heat5: "#ffba85",
		},
	},
} as const;

const activeScheme = schemeTokens[currentScheme];

export const themeStyles = css`
	:root,
	html[data-theme="light"] {
		${toCSSVariableRecord(sharedLightMap)} ${toCSSVariableRecord(activeScheme.light)};
	}

	@media (prefers-color-scheme: dark) {
		html[data-theme="system"],
		html:not([data-theme]) {
			${toCSSVariableRecord(sharedDarkMap)} ${toCSSVariableRecord(activeScheme.dark)};
		}
	}

	html[data-theme="dark"] {
		${toCSSVariableRecord(sharedDarkMap)} ${toCSSVariableRecord(activeScheme.dark)};
	}
`;

type ThemeKey = keyof typeof sharedDarkMap | keyof typeof activeScheme.dark;

const allTokenKeys = Array.from(
	new Set([
		...Object.keys(sharedDarkMap),
		...Object.keys(activeScheme.dark),
	]),
) as ThemeKey[];

export const theme = Object.fromEntries(
	allTokenKeys.map((key) => [key, `var(--colour-${toKebabCase(key)})`]),
) as Record<ThemeKey, string>;
