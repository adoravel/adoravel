// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { fontSize, radius, spacing, theme } from "~/tokens";
import type { MarkdocComponentMap } from "./markdoc.ts";

const CalloutStyles = css`
	:scope {
		display: flex;
		gap: ${spacing[3]};
		padding: ${spacing[4]};
		margin: ${spacing[5]} 0;
		border-radius: ${radius.lg};
		border: 1px solid ${theme.accentBorder};
		background: ${theme.accentBackground};
		font-size: ${fontSize.sm};
		color: ${theme.subtext};
	}

	:scope[data-type="warning"] {
		border-color: ${theme.accentBorder};
		background: ${theme.accentBackground};
	}

	.icon {
		flex-shrink: 0;
		font-family: monospace;
	}
`;

function Callout(
	{ type = "note", children }: { type?: "note" | "warning"; children?: unknown },
) {
	return (
		<CalloutStyles.div data-type={type}>
			<span class="icon" aria-hidden="true">{type === "warning" ? "!" : "→"}</span>
			<div>{children}</div>
		</CalloutStyles.div>
	);
}

function FootnoteRef({ id, n }: { id: string; n: number }) {
	return (
		<sup class="footnote-ref">
			<a href={`#fn-${id}`} id={`fnref-${id}`} aria-describedby="footnotes-label">{n}</a>
		</sup>
	);
}

function Footnote({ id, n, children }: { id: string; n: number; children?: unknown }) {
	return (
		<li class="footnote" id={`fn-${id}`} role="doc-footnote">
			{children}
			<a
				class="footnote-back"
				href={`#fnref-${id}`}
				aria-label={`Back to reference ${n}`}
				data-silent
			>
				↩
			</a>
		</li>
	);
}

function Footnotes({ children }: { children?: unknown }) {
	return (
		<section class="footnotes" role="doc-endnotes" aria-labelledby="footnotes-label">
			<h2 id="footnotes-label" class="sr-only">Footnotes</h2>
			<ol>{children}</ol>
		</section>
	);
}

export const markdocComponents: MarkdocComponentMap = {
	Callout,
	FootnoteRef,
	Footnote,
	Footnotes,
};
