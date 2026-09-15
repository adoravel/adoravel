// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { boundaries, ease, fontSize, radius, spacing, theme } from "~/tokens";
import Avatar from "~/components/layout/avatar.tsx";
import ThemeSwitcher from "~/components/layout/theme-switcher.tsx";
import { routes } from "~/config/site.ts";

export type Page = "about" | "more";

export interface SiteHeaderProps {
	current?: Page;
}

const NAV_ITEMS: ReadonlyArray<{ page: Page; href: string; label: string }> = [
	{ page: "about", href: routes.home, label: "about" },
	{ page: "more", href: routes.more, label: "more" },
	// { page: "resume", href: routes.resume, label: "résumé" },
];

const Styled = css`
	:scope {
		display: flex;
		flex-direction: column;
		gap: ${spacing[5]};
	}

	.header-bar {
		display: flex;
		align-items: center;
		gap: ${spacing[2]};
	}

	.header-nav {
		display: flex;
		align-items: center;
		gap: ${spacing[1]};
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.header-link {
		display: inline-block;
		padding: ${spacing[1]} ${spacing[2]};
		border-radius: ${radius.sm};
		font-size: ${fontSize.body};
		color: ${theme.text};
		opacity: 0.5;
		text-decoration: none;
		transition: opacity ${ease.fast}, background-color ${ease.fast};
	}

	.header-link:hover,
	.header-link:focus-visible,
	.header-link[aria-current="page"] {
		opacity: 1;
	}

	.header-link:hover {
		background-color: ${theme.surfaceHover};
	}

	.header-spacer {
		flex: 1;
	}

	@media (max-width: ${boundaries.mobileMaxWidth}) {
		.header-bar {
			flex-wrap: wrap;
			justify-content: center;
		}
	}
`;

export default function SiteHeader({ current = "about" }: SiteHeaderProps) {
	return (
		<Styled.header>
			<Avatar />
			<div class="header-bar">
				<ThemeSwitcher />
				<nav aria-label="Primary">
					<ul class="header-nav">
						{NAV_ITEMS.map((item) => (
							<li key={item.page}>
								<a
									class="header-link"
									href={item.href}
									aria-current={item.page === current ? "page" : undefined}
								>
									{item.label}
								</a>
							</li>
						))}
					</ul>
				</nav>
				<div class="header-spacer" />
			</div>
		</Styled.header>
	);
}
