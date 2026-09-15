// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { fontFamily, fontSize, radius, spacing, theme } from "~/tokens";

export interface ProseProps {
	as?: "div" | "section" | "article";
	class?: string;
	children?: unknown;
}

const Styled = css`
	:scope {
		font-size: ${fontSize.body};
		color: ${theme.subtext};
		line-height: 1.75;
	}

	:scope :is(h2, h3, h4) {
		font-weight: 650;
		letter-spacing: ${spacing.letter.tight};
		color: ${theme.text};
		line-height: 1.25;
		margin-top: 2.2em;
		margin-bottom: 0.6em;
		scroll-margin-top: ${spacing[16]};
	}

	:scope h2 {
		font-size: ${fontSize.xl};
	}
	:scope h3 {
		font-size: ${fontSize.lg};
	}
	:scope h4 {
		font-size: ${fontSize.base};
	}

	:scope p {
		margin-bottom: 1.3em;
	}

	:scope > :last-child {
		margin-bottom: 0;
	}

	:scope strong {
		color: ${theme.text};
		font-weight: 600;
	}

	:scope a {
		color: ${theme.accent};
		text-underline-offset: 3px;
		text-decoration: underline;
		text-decoration-color: ${theme.accentBorder};
		transition: text-decoration-color 0.15s ease;
	}

	:scope a:hover,
	:scope a:focus-visible {
		text-decoration-color: ${theme.accent};
	}

	:scope blockquote {
		border-left: 2px solid ${theme.accent};
		padding: ${spacing[2]} ${spacing[4]};
		margin: ${spacing[6]} 0;
		color: ${theme.textMuted};
		background: ${theme.surface};
		border-radius: 0 ${radius.md} ${radius.md} 0;
	}

	:scope blockquote p:last-of-type {
		margin-bottom: 0;
	}

	:scope hr {
		border: none;
		border-top: 1px solid ${theme.baseBorder};
		margin: ${spacing[8]} 0;
	}

	:scope pre {
		background: ${theme.surface};
		border: 1px solid ${theme.surfaceBorder};
		border-radius: ${radius.lg};
		padding: ${spacing[4]} ${spacing[5]};
		overflow-x: auto;
		margin: ${spacing[5]} 0;
		font-family: ${fontFamily.mono};
		font-size: ${fontSize.sm};
		line-height: 1.7;
	}

	:scope code:not(pre code) {
		background: ${theme.surface};
		border: 1px solid ${theme.surfaceBorder};
		border-radius: ${radius.sm};
		padding: 1px 6px;
		font-family: ${fontFamily.mono};
		font-size: 0.88em;
		color: ${theme.accentBright};
	}

	:scope img {
		border-radius: ${radius.lg};
		max-width: 100%;
		border: 1px solid ${theme.surfaceBorder};
	}

	:scope :is(ul, ol) {
		padding-left: ${spacing[6]};
		margin-bottom: 1.3em;
	}

	:scope li {
		margin-bottom: 0.4em;
	}

	:scope table {
		width: 100%;
		border-collapse: collapse;
		margin: ${spacing[6]} 0;
		font-size: ${fontSize.sm};
	}

	:scope :is(th, td) {
		border: 1px solid ${theme.surfaceBorder};
		padding: ${spacing[2]} ${spacing[3]};
		text-align: left;
	}

	:scope th {
		color: ${theme.text};
		background: ${theme.surface};
		font-weight: 600;
	}

	:scope ruby {
		ruby-align: center;
	}

	:scope rt {
		font-size: 0.62em;
		line-height: 1;
		color: ${theme.textMuted};
		letter-spacing: 0.02em;
	}

	:scope :is(sup, sub) {
		font-size: 0.72em;
		line-height: 0;
	}

	:scope .footnote-ref a {
		padding: 0 0.15em;
		text-decoration: none;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	:scope .footnote-ref a::before {
		content: "[";
	}

	:scope .footnote-ref a::after {
		content: "]";
	}

	:scope .footnotes {
		margin-top: ${spacing[10]};
		padding-top: ${spacing[6]};
		border-top: 1px solid ${theme.baseBorder};
		font-size: ${fontSize.sm};
		color: ${theme.textMuted};
	}

	:scope hr:has(+ .footnotes) {
		display: none;
	}

	:scope .footnotes ol {
		padding-left: ${spacing[5]};
		margin-bottom: 0;
	}

	:scope .footnote {
		padding-left: ${spacing[1]};
		transition: color 0.3s ease;
	}

	:scope .footnote::marker {
		font-variant-numeric: tabular-nums;
	}

	:scope .footnote:target,
	:scope .footnote-ref a:target {
		color: ${theme.text};
	}

	:scope .footnote p {
		margin-bottom: 0.6em;
	}

	:scope .footnote > p:last-of-type {
		display: inline;
		margin-bottom: 0;
	}

	:scope .footnote-back {
		margin-left: ${spacing[1]};
		text-decoration: none;
		opacity: 0.55;
		transition: opacity 0.15s ease, color 0.15s ease;
	}

	:scope .footnote-back:hover,
	:scope .footnote-back:focus-visible {
		opacity: 1;
	}
`;

export default function Prose({ as = "div", class: className, children }: ProseProps) {
	const Tag = Styled[as];
	return <Tag class={className}>{children}</Tag>;
}
