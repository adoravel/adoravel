// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { ease, fontFamily, fontSize, media, radius, spacing, theme } from "~/tokens";
import { ArrowUpRight } from "~/components/ui/icon.tsx";
import type { Repository } from "~/services/github/mod.ts";

export interface ProjectsProps {
	repositories: Repository[];
}

const LANGUAGE_COLOURS: Record<string, string> = {
	TypeScript: "#3178c6",
	JavaScript: "#f1e05a",
	Rust: "#dea584",
	Go: "#00add8",
	C: "#8a8a8a",
	"C++": "#f34b7d",
	Java: "#b07219",
	Kotlin: "#a97bff",
	Python: "#3572a5",
	CSS: "#663399",
	HTML: "#e34c26",
	Shell: "#89e051",
	Nix: "#7e7eff",
	Lua: "#5b7fd6",
	"Emacs Lisp": "#c065db",
};

const Styled = css`
	:scope {
		display: flex;
		flex-direction: column;
		gap: ${spacing[5]};
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.project-link {
		position: relative;
		isolation: isolate;
		display: flex;
		align-items: flex-start;
		gap: ${spacing[3.5]};
		color: inherit;
		text-decoration: none;
		transform: translate3d(0, 0, 0);
		transition: transform ${ease.hover};
	}

	.project-link::before {
		content: "";
		position: absolute;
		inset: calc(${spacing[2]} * -1) calc(${spacing[3]} * -1);
		z-index: -1;
		border-radius: ${radius.lg};
		background: ${theme.surface};
		opacity: 0;
		transform: scale(0.94);
		transition: opacity ${ease.hover}, transform ${ease.hover};
	}

	.project-link:hover::before,
	.project-link:focus-visible::before {
		opacity: 1;
		transform: none;
	}

	.project-link:focus-visible {
		outline: none;
	}

	.project-link:focus-visible::before {
		outline: 2px solid ${theme.accent};
		outline-offset: 2px;
	}

	.project-mark {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: ${spacing[7]};
		height: ${spacing[7]};
		margin-top: 1px;
		border-radius: ${radius.sm};
		background: color-mix(in srgb, var(--mark-colour, ${theme
			.textMuted}) 16%, transparent);
		color: var(--mark-colour, ${theme.textMuted});
		font-family: ${fontFamily.mono};
		font-size: ${fontSize.sm};
		font-weight: 600;
		text-transform: uppercase;
		user-select: none;
	}

	.project-text {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.project-name {
		display: inline-flex;
		align-items: center;
		gap: ${spacing[1]};
		margin: 0;
		font-size: ${fontSize.base};
		font-weight: 500;
		line-height: 1.4;
		color: ${theme.text};
	}

	.project-arrow {
		width: 12px;
		height: 12px;
		flex-shrink: 0;
		opacity: 0.5;
		transform: translate3d(0, 0, 0);
		transition: transform ${ease.hover}, opacity ${ease.hover};
		will-change: transform;
	}

	.project-link:hover .project-arrow,
	.project-link:focus-visible .project-arrow {
		opacity: 1;
		transform: translate3d(1px, -1px, 0);
	}

	.project-description {
		margin: 0;
		font-size: ${fontSize.md};
		line-height: 1.5;
		color: ${theme.subtext};
	}

	${media.reducedMotion} {
		.project-link::before,
		.project-arrow {
			transition: opacity ${ease.fast};
			transform: none !important;
		}
	}
`;

function ProjectRow({ repository }: { repository: Repository }) {
	const { name, url, description, language } = repository;
	const colour = language ? LANGUAGE_COLOURS[language] : undefined;

	return (
		<li>
			<a class="project-link" href={url} target="_blank" rel="noopener noreferrer">
				<span
					class="project-mark"
					style={colour ? { "--mark-colour": colour } : undefined}
					aria-hidden="true"
				>
					{name.charAt(0)}
				</span>
				<span class="project-text">
					<h3 class="project-name">
						{name}
						<ArrowUpRight class="project-arrow" size={12} strokeWidth={2.5} />
					</h3>
					{description && <p class="project-description">{description}</p>}
				</span>
				<span class="sr-only">(opens in a new tab)</span>
			</a>
		</li>
	);
}

export default function Projects({ repositories }: ProjectsProps) {
	if (!repositories.length) return null;

	return (
		<Styled.ul>
			{repositories.map((repository) => (
				<ProjectRow
					key={`${repository.owner}/${repository.name}`}
					repository={repository}
				/>
			))}
		</Styled.ul>
	);
}
