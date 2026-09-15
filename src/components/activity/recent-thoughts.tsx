// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { ease, fontSize, media, radius, spacing, theme } from "~/tokens";
import { ArrowUpRight } from "~/components/ui/icon.tsx";
import DraftBadge from "~/components/ui/draft-badge.tsx";
import type { ThoughtSummary } from "~/markdown/mod.ts";
import { routes } from "~/config/site.ts";

export interface RecentThoughtsProps {
	thoughts: ThoughtSummary[];
}

const Styled = css`
	:scope {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
		border-radius: ${radius.lg};
		border: 1px solid ${theme.surfaceBorder};
		overflow: hidden;
	}

	.thought + .thought {
		border-top: 1px solid ${theme.surfaceBorder};
	}

	.thought-link {
		position: relative;
		display: block;
		padding: ${spacing[5]} ${spacing[6]};
		color: inherit;
		text-decoration: none;
		transition: background-color ${ease.fast};
	}

	.thought-link:hover,
	.thought-link:focus-visible {
		background-color: ${theme.surfaceHover};
	}

	.thought-link:focus-visible {
		outline-offset: -2px;
		border-radius: ${radius.lg};
	}

	.thought-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: ${spacing[4]};
	}

	.thought-title {
		font-size: ${fontSize.md};
		font-weight: 500;
		color: ${theme.text};
		transition: color ${ease.fast};
	}

	.thought-link:hover .thought-title,
	.thought-link:focus-visible .thought-title {
		color: ${theme.accent};
	}

	.thought-draft {
		margin-left: ${spacing[2]};
	}

	.thought-meta {
		display: inline-flex;
		align-items: center;
		gap: ${spacing[2]};
		flex-shrink: 0;
		font-size: ${fontSize.xs};
		color: ${theme.textMuted};
		white-space: nowrap;
	}

	.thought-arrow {
		width: 13px;
		height: 13px;
		flex-shrink: 0;
		color: ${theme.textMuted};
		transform: translate3d(0, 0, 0);
		transition: transform ${ease.hover}, color ${ease.hover};
		will-change: transform;
	}

	.thought-link:hover .thought-arrow,
	.thought-link:focus-visible .thought-arrow {
		color: ${theme.accent};
		transform: translate3d(2px, -2px, 0);
	}

	.thought-details {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows ${ease.reveal};
	}

	.thought:first-of-type .thought-details {
		grid-template-rows: 1fr;
	}
	.thought-link:hover .thought-details,
	.thought-link:focus-visible .thought-details {
		grid-template-rows: 1fr;
	}

	:scope:has(.thought:not(:first-of-type) .thought-link:hover) .thought:first-of-type .thought-details,
	:scope:has(.thought:not(:first-of-type) .thought-link:focus-visible) .thought:first-of-type .thought-details {
		grid-template-rows: 0fr;
	}

	.thought-link:hover .thought-details,
	.thought-link:focus-visible .thought-details {
		grid-template-rows: 1fr;
	}

	.thought-details-inner {
		overflow: hidden;
	}

	.thought-excerpt,
	.thought-tags {
		display: block;
		padding-top: ${spacing[2]};
		max-width: 52ch;
		font-size: ${fontSize.sm};
		color: ${theme.subtext};
		line-height: 1.6;
	}

	.thought-tags {
		color: ${theme.textMuted};
	}

	@media (max-width: 480px) {
		.thought-head {
			flex-direction: column;
			gap: ${spacing[1]};
		}
	}

	${media.reducedMotion} {
		.thought-arrow {
			transition: color ${ease.fast};
			transform: none !important;
		}

		.thought-details {
			transition: none;
		}
	}
`;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
});

function ThoughtRow({ thought }: { thought: ThoughtSummary }) {
	const date = new Date(thought.createdAt);

	return (
		<li class="thought">
			<a class="thought-link" href={routes.writing(thought.slug)}>
				<span class="thought-head">
					<span class="thought-title">
						{thought.title}
						{thought.draft && <DraftBadge class="thought-draft" />}
					</span>
					<span class="thought-meta">
						<time datetime={thought.createdAt}>{dateFormatter.format(date)}</time>
						<span aria-hidden="true">•</span>
						<span>{thought.readingTime} min read</span>
						<ArrowUpRight class="thought-arrow" size={13} strokeWidth={3} />
					</span>
				</span>
				<span class="thought-details">
					<span class="thought-details-inner">
						{thought.excerpt && <span class="thought-excerpt">{thought.excerpt}</span>}
						{thought.tags.length > 0 && (
							<span class="thought-tags">
								{thought.tags.map((tag) => `#${tag}`).join(" ")}
							</span>
						)}
					</span>
				</span>
			</a>
		</li>
	);
}

export default function RecentThoughts({ thoughts }: RecentThoughtsProps) {
	if (!thoughts.length) return null;

	return (
		<Styled.ul>
			{thoughts.map((thought) => <ThoughtRow key={thought.slug} thought={thought} />)}
		</Styled.ul>
	);
}
