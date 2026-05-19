/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Project, ProjectLanguage } from "~/content/projects.ts";
import { css } from "~/lib/css.ts";
import { boundaries, ease, elevation, fontFamily, fontSize, radius, spacing, theme } from "~/layout.tsx";
import { ExternalLink, License } from "~/components/ui/Icon.tsx";

interface Props {
	projects: Project[];
}

const Styled = css(`
	:scope {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: ${spacing[2]};
		margin-top: ${spacing[2]};
		padding-left: 0;
		list-style: none;

		font-family: ${fontFamily.misc};
		letter-spacing: ${spacing.letter.misc};
		
		@media (max-width: ${boundaries.mobileMaxWidth}) {
			grid-template-columns: 1fr;
		}
	}

	.project-card {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: ${spacing[3]} ${spacing[4]};
		color: ${theme.text};
		background-color: ${theme.base};
		border: 1px solid ${theme.baseBorder};
		border-radius: ${radius.lg};
		line-height: ${boundaries.lineHeight + 0.25};
		text-decoration: none;
		overflow: hidden;
	}

	.project-card:hover {
		background-color: ${theme.surfaceHover};
		border-color: ${theme.surfaceBorderHover};
		
		&::before {
			transform: scale(1.125);
			opacity: 1;
		}
	}

	.project-card::before {
		position: absolute;
		top: -7rem;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		content: "</;^//";
		color: transparent;
		font-size: 32rem;
		letter-spacing: -0.075em;
		line-height: 0.95;
		text-align: center;
		opacity: 0.32;
		-webkit-text-stroke: 2px ${theme.baseBorder};
		transition: transform ${ease.fast};
	}

	.external-icon {
		position: absolute;
		top: ${spacing[3]};
		right: ${spacing[3]};
		color: ${theme.subtext};
		opacity: 0.33;
	}

	.author {
		font-size: ${fontSize.md};
		margin-bottom: ${spacing[1]};
	}

	.description {
		font-size: ${fontSize.sm};
		color: ${theme.subtext};
		margin-bottom: ${spacing[3]};
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.author, .description, .info {
		position: relative;
		z-index: ${elevation.base};
	}

	.info {
		display: flex;
		align-items: center;
		gap: ${spacing[2]};
		margin-top: auto;
		color: ${theme.subtext};
		font-size: ${fontSize.xs};
	}

	.language {
		display: inline-block;
		width: 10px;
		height: 10px;
		background-color: var(--lang-colour, #ccc);
		border-radius: ${radius.circle};
	}

	.license {
		display: inline-flex;
		align-items: center;
		color: ${theme.subtext};
		font-size: ${fontSize.sm};
		opacity: 0.5;
	}

	.license > svg {
		margin-right: 0.5ch;
	}
`);

export default function Projects({ projects }: Props) {
	if (!projects?.length) return;

	return (
		<Styled.ul>
			{projects.map((project) => {
				const langColour = project.lang.toString(16).padStart(6, "0");

				return (
					<li key={project.url}>
						<a class="project-card" href={project.url} target="_blank" rel="noopener noreferrer">
							<span class="external-icon" aria-label="Open externally">
								<ExternalLink size={18} />
							</span>
							<div class="author">
								<strong>{project.author}</strong>/{project.name}
							</div>
							<p class="description">{project.description}</p>
							<div class="info">
								<span class="language" style={{ "--lang-colour": `#${langColour}` }}></span>
								{ProjectLanguage[project.lang]}
								<div class="license" aria-label="License">
									<License size={12} />
									<span>{project.license}</span>
								</div>
							</div>
						</a>
					</li>
				);
			})}
		</Styled.ul>
	);
}
