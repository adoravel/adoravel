/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css } from "@404/imouto";
import { ease, fontSize, spacing, theme } from "~/layout.tsx";

interface Props<T extends readonly [string, string][]> {
	items: T;
	selected: T[number][0];
}

const Styled = css`
	:scope {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		margin-bottom: ${spacing.section};
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		width: fit-content;
		padding: ${spacing[1]};
		gap: ${spacing[1]};
		background-color: ${theme.surface};
		border: 1px solid ${theme.surfaceBorder};
		border-radius: 1000px;
		list-style: none;
		font-weight: 500;
		font-size: ${fontSize.md};
	}

	.item {
		display: block;
		padding: ${spacing[2]} ${spacing[4]};
		color: ${theme.subtext};
		line-height: 1;
		text-decoration: none;
		border-radius: 1000px;
		transition: color 0.15s ease, background-color 0.15s ease;

		transform: translateY(0px);
		transition: color ${ease.fast}, background-color ${ease.fast}, transform ${ease.spring};
	}

	.item:hover {
		color: ${theme.text};
		transform: translateY(-2px);
	}

	.selected > .item {
		color: ${theme.background};
		background-color: ${theme.accent};
		font-weight: 600;
		box-shadow: 0 4px 14px rgba(166, 181, 247, 0.25);
	}

	.selected > .item:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 18px rgba(166, 181, 247, 0.35);
	}
`;

export function NavigationBar<P extends readonly [string, string][]>({ items, selected }: Props<P>) {
	if (!items || items.length === 0) return null;

	return (
		<Styled.nav>
			<ul>
				{items.map(([name, href]) => {
					const isActive = name === selected;

					return (
						<li key={name} class={isActive ? "selected" : undefined}>
							<a
								href={href}
								class="item"
								aria-current={isActive ? "page" : undefined}
								data-current={isActive ? "true" : undefined}
							>
								{name}
							</a>
						</li>
					);
				})}
			</ul>
		</Styled.nav>
	);
}
