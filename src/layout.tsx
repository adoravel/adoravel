/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export * from "./tokens.ts";

import { css, Head, ScopedStyleSheet } from "@404/imouto";
import { NavigationBar } from "~/components/layout/NavigationBar.tsx";
import { tokens } from "~/tokens.ts";

const nav: readonly [string, string][] = [
	["home", "/"],
	["reports", "/reports"],
];

export interface LayoutProps {
	children?: any;
	scope: ScopedStyleSheet;
	class?: string;
	selected?: string;
}

const styles = css`
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
		content: "";
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

export function Layout({ scope, children, class: className, selected }: LayoutProps) {
	children;
	return (
		<styles.html lang="en">
			<Head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" type="image/png" href="/favicon.png" />
				<meta name="view-transition" content="same-origin" />
				<title>kylia</title>
				<meta property="og:title" content="kylia" />
				<meta property="og:type" content="profile" />
				<meta property="og:site_name" content="kyu.re" />
				<meta property="og:description" content="one of the girls of all time" />
				<meta property="og:image" content="/~.png" />
				<meta property="og:image:type" content="image/png" />
				<meta name="theme-color" content={tokens.theme.accentDim} />
				<link rel="stylesheet" href="/fonts/iosevka-custom/import.css" />
				<link rel="stylesheet" href="/fonts/bricolage-grotesque/import.css" />
			</Head>
			<scope.body class={className}>
				<NavigationBar items={nav} selected={selected ?? ""} />
				{children}
			</scope.body>
		</styles.html>
	);
}
