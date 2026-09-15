// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { ease, fontSize, spacing, theme } from "~/tokens";

export type HeatLevel = 0 | 1 | 2 | 3 | 4;

export interface HeatmapCell {
	date: string;
	count: number;
	level: HeatLevel;
}

export interface HeatmapProps {
	cells: HeatmapCell[];
	unitLabel: string;
	summary: string;
	cellSize?: number;
	cellGap?: number;
	children?: unknown;
}

const DAYS_PER_WEEK = 7;

export function heatColour(level: HeatLevel): string {
	return theme[`heat${level}`];
}

function groupIntoWeeks(cells: HeatmapCell[]): (HeatmapCell | null)[][] {
	if (!cells.length) return [];

	const leadingBlanks = new Date(`${cells[0].date}T00:00:00Z`).getUTCDay();
	const padded: (HeatmapCell | null)[] = [
		...Array.from({ length: leadingBlanks }, () => null),
		...cells,
	];

	const weeks: (HeatmapCell | null)[][] = [];
	for (let i = 0; i < padded.length; i += DAYS_PER_WEEK) {
		weeks.push(padded.slice(i, i + DAYS_PER_WEEK));
	}
	return weeks;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
	month: "short",
	day: "numeric",
	year: "numeric",
});

function describeCell(cell: HeatmapCell, unitLabel: string): string {
	const date = dateFormatter.format(new Date(`${cell.date}T00:00:00Z`));
	if (cell.count === 0) return `No ${unitLabel}s on ${date}`;
	return `${cell.count} ${unitLabel}${cell.count === 1 ? "" : "s"} on ${date}`;
}

const Styled = css`
	:scope {
		display: flex;
		flex-direction: column;
		gap: ${spacing[2]};
		margin: 0;
	}

	.heatmap-grid {
		display: flex;
		gap: var(--cell-gap);
		overflow-x: auto;
		padding: 4px var(--cell-gap) 6px;
		margin: -4px calc(var(--cell-gap) * -1) -6px;
		scrollbar-width: thin;
	}

	.heatmap-week {
		display: grid;
		grid-template-rows: repeat(${DAYS_PER_WEEK}, var(--cell-size));
		gap: var(--cell-gap);
	}

	.heatmap-cell {
		width: var(--cell-size);
		height: var(--cell-size);
		border-radius: 2px;
		outline: 1px solid ${theme.surfaceBorder};
		outline-offset: -1px;
		transition: transform ${ease.snap};
	}

	.heatmap-cell:hover {
		transform: scale(1.25);
	}

	.heatmap-caption {
		font-size: ${fontSize.sm};
		color: ${theme.textMuted};
	}
`;

export default function Heatmap({
	cells,
	unitLabel,
	summary,
	cellSize = 11,
	cellGap = 3,
	children,
}: HeatmapProps) {
	const weeks = groupIntoWeeks(cells);

	return (
		<Styled.figure
			style={{ "--cell-size": `${cellSize}px`, "--cell-gap": `${cellGap}px` }}
		>
			<p class="sr-only">{summary}</p>
			<div class="heatmap-grid" aria-hidden="true">
				{weeks.map((week, index) => (
					<div class="heatmap-week" key={index}>
						{week.map((cell) => (
							<div
								class="heatmap-cell"
								title={cell ? describeCell(cell, unitLabel) : undefined}
								style={{ backgroundColor: cell ? heatColour(cell.level) : theme.base }}
							/>
						))}
					</div>
				))}
			</div>
			{children && <figcaption class="heatmap-caption">{children}</figcaption>}
		</Styled.figure>
	);
}
