// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { boundaries, fontSize, media, spacing, theme } from "~/tokens";
import Link from "~/components/ui/link.tsx";
import { GitHubIcon, Icon, IconProps, LastFmIcon } from "~/components/ui/icon.tsx";
import SoundToggle from "~/components/layout/sound-toggle.tsx";
import LocalTime from "~/components/layout/local-time.tsx";
import { site } from "~/config/site.ts";
import type { FooterOptions } from "~/components/layout/footer-state.ts";
import { Rule } from "~/components/layout/rule.tsx";
import ButtonWall from "~/components/layout/button-wall.tsx";
import type { WebButton } from "~/content/buttons.ts";

const Styled = css`
	:scope {
		max-width: ${boundaries.maxWidth};
		margin: 0 auto;
		padding: 0 ${spacing[4]} ${spacing[12]};
	}

	.footer-buttons {
		margin-bottom: ${spacing[6]};
	}

	.footer-grid {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: space-between;
		gap: ${spacing[6]} ${spacing[8]};
	}

	.footer-identity {
		display: flex;
		flex-direction: column;
		gap: ${spacing[1]};
		font-size: ${fontSize.sm};
		color: ${theme.textMuted};
	}

	.footer-name {
		display: flex;
		align-items: center;
		gap: ${spacing[1]};
		flex-wrap: wrap;
		font-size: ${fontSize.base};
		font-weight: 600;
		color: ${theme.text};
	}

	.footer-links {
		display: flex;
		flex-wrap: wrap;
		gap: ${spacing[2]} ${spacing[5]};
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: ${fontSize.sm};
	}

	.footer-sound {
		display: flex;
		justify-content: center;
		margin-top: ${spacing[3]};
	}

	.footer-aside {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: ${spacing[2]};
		font-size: ${fontSize.sm};
		color: ${theme.textMuted};
	}

	.footer-lead {
		color: ${theme.textMuted};
		display: flex;
		justify-content: flex-end;
		margin-top: -${spacing[16]};
		margin-bottom: ${spacing[6]};
		font-size: ${fontSize.sm};
		font-weight: 600;
	}

	${media.mobile} {
		:scope {
			text-align: center;
		}

		.footer-lead {
			justify-content: center;
		}

		.footer-grid {
			flex-direction: column;
			align-items: center;
			gap: ${spacing[5]};
		}

		.footer-identity {
			align-items: center;
		}

		.footer-name {
			justify-content: center;
		}

		.footer-links {
			justify-content: center;
		}

		.footer-aside {
			align-items: center;
		}
	}
`;

export function RainbowHeart(props: IconProps) {
	return (
		<Icon
			fill="url(#rainbow)"
			strokeWidth={0}
			{...props}
		>
			<defs>
				<linearGradient
					id="rainbow"
					x1="2"
					y1="2"
					x2="22"
					y2="22"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" style="stop-color: #ff334b;" />
					<stop offset="40%" style="stop-color: #ffd200;" />
					<stop offset="75%" style="stop-color: #0077ff;" />
					<stop offset="100%" style="stop-color: #b026ff;" />
				</linearGradient>
			</defs>

			<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
		</Icon>
	);
}

export interface SiteFooterProps extends FooterOptions {
	webButtons?: readonly WebButton[];
}

export default function SiteFooter({ lead, buttons, webButtons = [] }: SiteFooterProps) {
	return (
		<Styled.footer>
			{lead && (
				<p class="footer-lead">
					<Link href={lead.href} arrow={lead.arrow ?? true}>{lead.label}</Link>
				</p>
			)}
			<Rule />
			{buttons && <ButtonWall class="footer-buttons" buttons={webButtons} />}
			<div class="footer-grid">
				<div class="footer-identity">
					<span class="footer-name">
						made with <RainbowHeart />
					</span>
				</div>

				<nav>
					<ul class="footer-links">
						<li>
							<Link href={site.github.profileUrl}>
								<GitHubIcon class="link-icon" /> GitHub
							</Link>
						</li>
						<li>
							<Link href={site.lastfm.profileUrl}>
								<LastFmIcon class="link-icon" /> Last.fm
							</Link>
						</li>
					</ul>
					<div class="footer-sound">
						<SoundToggle />
					</div>
				</nav>

				<div class="footer-aside">
					<LocalTime timezone={site.timezone} locale={site.locale} label="over here" />
				</div>
			</div>
		</Styled.footer>
	);
}
