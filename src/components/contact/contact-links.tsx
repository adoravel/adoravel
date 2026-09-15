// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { fontSize, spacing, theme } from "~/tokens";
import Link from "~/components/ui/link.tsx";
import { Coffee, GitHubIcon, Heart, Mail } from "~/components/ui/icon.tsx";
import { site } from "~/config/site.ts";

const Styled = css`
	:scope {
		display: flex;
		flex-direction: column;
		gap: ${spacing[4]};
		font-size: ${fontSize.sm};
		color: ${theme.subtext};
	}

	.contact-list {
		display: flex;
		flex-wrap: wrap;
		gap: ${spacing[2]} ${spacing[5]};
		margin: 0;
		padding: 0;
		list-style: none;
	}
`;

export default function ContactLinks() {
	return (
		<Styled.div>
			<p class="contact-lead">
				Say hi, or if you're a fan of throwing money away, feel free to fund my life so I
				don't starve.
			</p>
			<ul class="contact-list">
				<li>
					<Link href={`mailto:${site.email}`} external={false} arrow={false}>
						<Mail class="link-icon" /> {site.email}
					</Link>
				</li>
				<li>
					<Link href={site.github.profileUrl}>
						<GitHubIcon class="link-icon" /> GitHub
					</Link>
				</li>
				<li>
					<Link href={site.support.kofi}>
						<Coffee class="link-icon" /> Ko-fi
					</Link>
				</li>
				<li>
					<Link href={site.support.githubSponsors}>
						<Heart class="link-icon" /> GitHub Sponsors
					</Link>
				</li>
			</ul>
		</Styled.div>
	);
}
