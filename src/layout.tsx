/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export * from "./tokens.ts";

import { jsx, JsxElement, JsxNode } from "@july/snarl/jsx-runtime";
import { ScopedStyling } from "~/lib/css.ts";
import { NavigationBar } from "~/components/layout/NavigationBar.tsx";
import { tokens } from "~/tokens.ts";

const nav: readonly [string, string][] = [
	["home", "/"],
	["reports", "/reports"],
];

export interface LayoutProps {
	children?: any;
	scope: ScopedStyling;
	class?: string;
	selected?: string;
}

const styles = /* css */ `
	*, *::before, *::after {
		box-sizing: border-box;
		margin: 0;
	}

	.main {
		view-transition-name: main-content;
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
		margin-left: 5px;
		margin-right: 5px;
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

	.highlight-rose {
		color: ${tokens.theme.rose};
	}
`;

interface CollectResult {
	head: Map<string, JsxNode>;
	body: JsxNode[];
}

function getHeadKey(node: JsxNode): string | null {
	if (typeof node !== "object" || node === null || !("tag" in node)) return null;
	const { tag, props } = node as JsxElement;

	if (tag === "title") return "__title__";
	if (tag === "meta") {
		if (props.property) return `meta::property::${props.property}`;
		if (props.name) return `meta::name::${props.name}`;
		if (props.charset) return "meta::charset";
	}
	return null;
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
		const tempBody: JsxNode[] = [];
		collect(props.children, { head: new Map(), body: tempBody });

		for (const child of tempBody) {
			const key = getHeadKey(child);
			if (key) {
				result.head.set(key, child);
			} else {
				result.head.set(`__raw__${Math.random()}`, child);
			}
		}
		return;
	}

	if (typeof tag === "function") {
		const evaluated = tag(props);
		return collect(evaluated, result);
	}

	if (props.children == null) {
		return void result.body.push(node);
	}

	const child: CollectResult = { head: new Map(), body: [] };
	collect(props.children, child);

	for (const [key, value] of child.head) {
		result.head.set(key, value);
	}
	result.body.push(jsx(tag, { ...props, children: child.body as any }));
}

export function Layout({ scope, children, class: className, selected }: LayoutProps) {
	const result: CollectResult = { head: new Map(), body: [] };

	const globalHeadTags = [
		jsx("meta", { property: "og:site_name", content: "kyu.re" }),
		jsx("meta", { property: "og:type", content: "profile" }),
		jsx("meta", { property: "og:description", content: "one of the girls of all time" }),
		jsx("meta", { property: "og:image", content: "https://kyu.re/~.png" }),
		jsx("meta", { property: "og:image:type", content: "image/png" }),
		jsx("meta", { property: "og:title", content: "júlia lívia" }),
		jsx("meta", { name: "theme-color", content: tokens.theme.accentDim }),
	];

	collect(jsx("head", { children: globalHeadTags }), result);
	collect(children, result);

	return "<!DOCTYPE html>" + (
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" type="image/png" href="/favicon.png" />
				<meta name="view-transition" content="same-origin" />
				{[...result.head.values()]}
				<link rel="stylesheet" href="/fonts/iosevka-custom/import.css" />
				<link rel="stylesheet" href="/fonts/bricolage-grotesque/import.css" />
				<style>{styles}</style>
			</head>
			<scope.body class={className}>
				<NavigationBar items={nav} selected={selected ?? ""} />
				{result.body}
			</scope.body>
		</html>
	);
}
