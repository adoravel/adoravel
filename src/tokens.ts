/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export const rem = (val: number | string) => `${val}rem`;
export const em = (val: number | string) => `${val}em`;
export const px = (val: number | string) => `${val}px`;
export const url = (val: string) => `url("${val}")`;

type DeepResolveTokens<T> = {
	[K in keyof T]: T[K] extends object ? {
			[P in keyof T[K] as P | (P extends `${infer N extends number}` ? N : never)]: T[K][P] extends object
				? DeepResolveTokens<T[K][P]>
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

export const tokens = createTheme({
	theme: {
		base: "#0d0e12",
		baseBorder: "#1f1e24",
		background: "#121317",
		surface: "#1e1f24",
		surfaceBorder: "#29292e",
		lift: "#38393d",
		text: "#e7e0e7",
		subtext: "#c3c7d1",
		textMuted: "#8e939a",
		textMutedHover: "#d5dce7",
		accent: "#a6b5f7",
		accentDim: "#7c8fdb",
		accentBackground: "#2d3d7f",
		onAccent: "#d8e0ff",
		rose: "#f0b3c8",
		roseBackground: "#5c1d36",
		onRose: "#ffd9e4",
		surfaceHover: "rgba(255, 255, 255, 0.025)",
		surfaceBorderHover: "rgba(255, 255, 255, 0.125)",
	},
	spacing: {
		letter: {
			tight: em(-.05),
			misc: em(-.025),
			plus: em(.03),
		},
		pill: `${rem(.375)} ${rem(0.75)}`,
		"1": rem(.25),
		"2": rem(.5),
		"3": rem(.75),
		"4": rem(1),
		"5": rem(1.25),
		"6": rem(1.5),
		"8": rem(2),
		"10": rem(2.5),
		"12": rem(3),
		"16": rem(4),
		"18": rem(5),
		"section": rem(2),
	},
	fontSize: {
		xs: rem(.6875),
		sm: rem(.75),
		md: rem(.875),
		body: rem(.9),
		base: rem(1),
		root: px(17),
		lg: rem(1.1),
		xl: rem(1.5),
		"2xl": rem(2.4),
		"3xl": rem(3),
	},
	radius: {
		sm: px(2),
		md: px(3),
		lg: px(10),
		circle: px(1000),
		art: "15%",
	},
	ease: {
		fast: "0.16s ease-in-out",
		spring: "0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
		reveal: "0.4s cubic-bezier(0.16, 1, 0.3, 1)",
	},
	elevation: {
		below: "-1",
		base: "0",
		raised: "10",
		overlay: "20",
		modal: "30",
	},
	boundaries: {
		mobileMaxWidth: px(600),
		desktopMinWidth: px(1550),
		maxWidth: em(55),
		avatarSize: px(160),
		lineHeight: 1.6,
	},
	misc: {
		arrow: url(
			`data:image/svg+xml;base64,${btoa(Deno.readTextFileSync("./assets/ui/arrow.svg"))}`,
		),
	},
	fontFamily: {
		default:
			'"Bricolage Grotesque", "Iosevka Custom Web", "Iosevka Custom", Iosevka, "Space Grotesk", sans-serif, monospace',
		misc:
			'"Iosevka Custom Web", "Iosevka Custom", Iosevka, "Bricolage Grotesque", "Space Grotesk", sans-serif, monospace',
		heading: "'Space Grotesk', sans-serif, monospace",
	},
});

export const { theme, spacing, fontSize, radius, ease, boundaries, misc, elevation, fontFamily } = tokens;
