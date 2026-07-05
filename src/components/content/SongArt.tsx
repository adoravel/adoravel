/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css } from "@404/imouto";
import { radius, theme } from "~/layout.tsx";

const ART_PATTERN = [
	[0, 1, 2, 0],
	[1, 4, 1, 3],
	[2, 1, 3, 1],
	[0, 3, 1, 2],
] as const;

const randomisePattern = (): number[][] => {
	const pool = ART_PATTERN.flat();

	const size = ART_PATTERN.length;
	const grid: number[][] = Array.from({ length: size }, () => []);

	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			const leftNeighbor = c > 0 ? grid[r][c - 1] : null;
			const topNeighbor = r > 0 ? grid[r - 1][c] : null;

			const validIndices: number[] = [];
			for (let i = 0; i < pool.length; i++) {
				if (pool[i] !== leftNeighbor && pool[i] !== topNeighbor) {
					validIndices.push(i);
				}
			}

			const targetIndex = validIndices.length > 0
				? validIndices[Math.floor(Math.random() * validIndices.length)]
				: Math.floor(Math.random() * pool.length);

			const [chosenValue] = pool.splice(targetIndex, 1);
			grid[r].push(chosenValue);
		}
	}

	return grid;
};

const Styled = css`
	:scope {
		position: relative;
		width: 64px;
		height: 64px;
		flex-shrink: 0;
		background: ${theme.base};
		border: 1px solid ${theme.baseBorder};
		border-radius: ${radius.art};
		overflow: hidden;
	}

	.art-cover {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.pattern {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(4, 1fr);
	}

	.art-px {
		display: block;
	}
	.art-px-0 {
		background-color: ${theme.base};
	}
	.art-px-1 {
		background-color: ${theme.accent};
		opacity: 0.85;
	}
	.art-px-2 {
		background-color: ${theme.onAccent};
		opacity: 0.9;
	}
	.art-px-3 {
		background-color: ${theme.textMuted};
		opacity: 0.25;
	}
	.art-px-4 {
		background-color: ${theme.surfaceBorder};
	}

	.art-cover[data-loaded="true"] + .pattern {
		display: none;
	}
`;

export function SongArt({ url, class: className }: { class?: string; url: string | undefined }) {
	return (
		<Styled.div class={className ?? ""} data-loaded={!url ? "false" : undefined}>
			{url && (
				<img
					class="art-cover"
					alt=""
					src={url}
					onload="this.setAttribute('data-loaded', 'true')"
					onerror="this.remove()"
				/>
			)}
			<div class="pattern">
				{randomisePattern().flat().map((n, idx) => <span key={idx} class={`art-px art-px-${n}`} />)}
			</div>
		</Styled.div>
	);
}
