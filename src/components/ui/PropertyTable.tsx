/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css } from "~/lib/css.ts";
import { ease, fontFamily, fontSize, radius, spacing, theme } from "~/layout.tsx";

interface Props {
	data: Record<string, [string, string | undefined]>;
}

const Styled = css(`
	:scope {
		display: block;
		border: 1px solid ${theme.surfaceBorder};
		border-radius: ${radius.lg};
		
		font-family: ${fontFamily.misc};
		letter-spacing: ${spacing.letter.misc};
	}
	
	.kv-row {
		display: grid;
		grid-template-columns: minmax(80px, 140px) 1fr;
		border-bottom: 1px solid ${theme.surfaceBorder};
		transition: background-color ${ease.fast};
	}
	
	.kv-row:last-child {
		border-bottom: none;
	}
	
	.kv-row:hover {
		background-color: ${theme.surface};
	}
	
	.kv-key, .kv-val {
		display: flex;
		align-items: center;
		padding: ${spacing[3]} ${spacing[4]};
		line-height: 1.4;
		font-family: inherit;
	}

	.kv-key {
		color: ${theme.textMuted};
		font-weight: bold;
		font-size: ${fontSize.xs};
		text-transform: uppercase;
		letter-spacing: ${spacing.letter.plus};
		border-right: 1px solid ${theme.surfaceBorder};
	}
	
	.kv-val {
		color: ${theme.accent};
		font-size: ${fontSize.sm};
		text-decoration: none;
	}

	a.kv-val:hover {
		text-decoration: underline;
	}

	.kv-val.link::after {
		margin-left: 8px;
	}
`);

export default function PropertyTable({ data }: Props) {
	if (!data || Object.keys(data).length === 0) return null;

	return (
		<Styled.div>
			{Object.entries(data).map(([key, [name, url]]) => (
				<div key={key} class="kv-row">
					<span class="kv-key">{key}</span>
					{url
						? (
							<a class="kv-val link" href={url} target="_blank" rel="noopener noreferrer">
								{name}
							</a>
						)
						: <span class="kv-val">{name}</span>}
				</div>
			))}
		</Styled.div>
	);
}
