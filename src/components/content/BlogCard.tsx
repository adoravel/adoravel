/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css } from "~/lib/css.ts";
import { ease, fontFamily, fontSize, radius, spacing, theme } from "~/layout.tsx";
import type { BlogPostSummary } from "~/content/blog.ts";

const Styled = css(`
	:scope {
		display: block;
		position: relative;
		padding: ${spacing[5]} ${spacing[6]};
		background: ${theme.base};
		border: 1px solid ${theme.baseBorder};
		border-radius: ${radius.lg};
		text-decoration: none;
		color: ${theme.text};
		overflow: hidden;
		transform: translateY(0px);
		transition:
			transform ${ease.spring},
			box-shadow ${ease.spring},
			border-color ${ease.fast},
			background-color ${ease.fast};
	}

	:scope:hover {
		transform: translateY(-5px);
		border-color: ${theme.surfaceBorderHover};
		background-color: ${theme.surfaceHover};
		box-shadow:
			0 14px 36px rgba(0, 0, 0, 0.45),
			0 2px 14px rgba(0, 0, 0, 0, 0.1);
	}

	.date {
		font-family: ${fontFamily.misc};
		font-size: ${fontSize.xs};
		letter-spacing: ${spacing.letter.plus};
		color: ${theme.textMuted};
		margin-bottom: ${spacing[2]};
	}

	.title {
		font-size: ${fontSize.xl};
		font-weight: 700;
		letter-spacing: ${spacing.letter.tight};
		line-height: 1.15;
		color: ${theme.text};
		margin-bottom: ${spacing[2]};
		transition: color ${ease.fast};
	}

	:scope:hover .title { color: ${theme.onAccent}; }

	.description {
		font-size: ${fontSize.md};
		color: ${theme.subtext};
		line-height: 1.6;
		margin-bottom: ${spacing[4]};
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: ${spacing[2]};
		flex-wrap: wrap;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: ${spacing[1]};
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.tag {
		padding: 1px ${spacing[2]};
		font-size: ${fontSize.xs};
		font-family: ${fontFamily.misc};
		letter-spacing: ${spacing.letter.misc};
		background: ${theme.surface};
		color: ${theme.text};
		border-radius: ${radius.circle};
		line-height: 1.75;
	}

	.reading-time {
		font-size: ${fontSize.xs};
		font-family: ${fontFamily.misc};
		color: ${theme.textMuted};
		white-space: nowrap;
		flex-shrink: 0;
	}

	.corner-arrow {
		position: absolute;
		top: ${spacing[5]};
		right: ${spacing[5]};
		color: ${theme.accent};
		opacity: 0;
		transform: translate(-4px, 4px) scale(0.8);
		transition: opacity ${ease.fast}, transform ${ease.spring};
	}

	:scope:hover .corner-arrow {
		opacity: 1;
		transform: translate(0, 0) scale(1);
	}
`);

function formatDate(iso: Date) {
	return iso.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function BlogCard({ identity, title, summary, createdAt, tags, readingTime }: BlogPostSummary) {
	return (
		<Styled.a href={`/reports/${identity.rkey}`}>
			<div class="glow" aria-hidden="true" />
			<div class="date">{formatDate(createdAt)}</div>
			<div class="title">{title}</div>
			<p class="description">{summary}</p>
			<div class="footer">
				<ul class="tags">
					{tags.map((tag) => <li key={tag} class="tag">{tag}</li>)}
				</ul>
				<span class="reading-time">{readingTime} min read</span>
			</div>
			<svg
				class="corner-arrow"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M7 17L17 7" />
				<path d="M7 7h10v10" />
			</svg>
		</Styled.a>
	);
}
