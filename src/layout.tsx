/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { jsx, JsxElement, JsxNode } from "@july/snarl/jsx-runtime";
import { ScopedStyling } from "~/lib/css.ts";

export interface LayoutProps {
	children?: any;
	scope: ScopedStyling;
	class?: string;
}

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
		textMuted: "#968e9a",
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
		lineHeight: rem(1.6),
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

const styles = /* css */ `
	*, *::before, *::after {
		box-sizing: border-box;
		margin: 0;
	}
	
	html, body {
		background-color: ${tokens.theme.background};
		color: ${tokens.theme.text};
	}

	html {
    	overflow-x: clip;
		font-family: ${tokens.fontFamily.default};
		font-weight: 400;
		line-height: ${tokens.boundaries.lineHeight};
		font-size: ${tokens.fontSize.root};
		text-rendering: optimizeLegibility;
	}

	body {
		margin: 0 auto;
		padding: ${tokens.spacing[8]} ${tokens.spacing[3]};
		max-width: ${tokens.boundaries.maxWidth};
	}
	
	pre,
	code,
	button,
	input,
	textarea {
		font-family: inherit;
		font-size: ${tokens.fontSize.root};
		text-rendering: optimizeLegibility;
	}

	a {
		color: ${tokens.theme.accent};
	    text-decoration: none;
	}

	section p, section i {
		margin-bottom: ${tokens.spacing[4]};
		font-size: ${tokens.fontSize.body};
		color: ${tokens.theme.subtext};
	}
	
	@view-transition {
		navigation: auto;
	}
	
	body *, body *::before, body *::after {
	    transition:
			color ${tokens.ease.fast},
			background-color ${tokens.ease.fast},
			border-color ${tokens.ease.fast},
			opacity ${tokens.ease.fast},
			filter ${tokens.ease.fast};
	}

	section > a::after,
	.link::after,
	p a::after {
		content: '';
		display: inline-block;
		width: 8px;
		height: 8px;
		margin-left: 4px;
		margin-right: 4px;
		background-color: ${tokens.theme.accent};
		mask: no-repeat center / contain ${tokens.misc.arrow};
	}

	::-webkit-scrollbar {
		width: 3px;
	}
 
	::-webkit-scrollbar-thumb {
		background: ${tokens.theme.lift};
	}

	::selection {
		background: ${tokens.theme.accent};
		color: ${tokens.theme.background};
	}
`;

interface CollectResult {
	head: JsxNode[];
	body: JsxNode[];
}

function collect(node: JsxNode, result: CollectResult): void {
	if (node == null || node === false || node === true) return;

	if (Array.isArray(node)) {
		return node.forEach((child) => collect(child, result));
	}

	if (typeof node !== "object") {
		return void result.body.push(node);
	}

	const { tag, props } = node as JsxElement;

	if (tag === "head") {
		return void result.head.push(props.children);
	}

	if (typeof tag === "function") {
		const evaluated = tag(props);
		return collect(evaluated, result);
	}

	if (props.children == null) {
		return void result.body.push(node);
	}

	const child: CollectResult = { head: [], body: [] };
	collect(props.children, child);

	if (child.head.length) {
		result.head.push(...child.head);
	}
	result.body.push(jsx(tag, { ...props, children: child.body as any }));
}

export function Layout({ scope, children, class: className }: LayoutProps) {
	const result: CollectResult = { head: [], body: [] };
	collect(children, result);

	return "<!DOCTYPE html>" + (
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" type="image/png" href="/favicon.png" />
				<meta property="og:site_name" content="kyu.re" />
				<meta property="og:type" content="profile" />
				<meta property="og:description" content="one of the girls of all time" />
				<meta property="og:image" content="https://kyu.re/~.png" />
				<meta property="og:image:type" content="image/png" />
				<meta property="og:title" content="júlia lívia" />
				<meta name="theme-color" content={tokens.theme.accentDim} />
				<link rel="stylesheet" href="/fonts/iosevka-custom/import.css" />
				<link rel="stylesheet" href="/fonts/bricolage-grotesque/import.css" />
				<style>{styles}</style>
				{result.head}
			</head>
			<scope.body class={className}>
				{result.body}
			</scope.body>
		</html>
	);
}

export const { theme, spacing, fontSize, radius, ease, boundaries, misc, elevation, fontFamily } = tokens;
