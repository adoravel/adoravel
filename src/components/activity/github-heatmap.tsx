// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { spacing, theme } from "~/tokens";
import Heatmap, { heatColour, type HeatLevel } from "~/components/ui/heatmap.tsx";
import Link from "~/components/ui/link.tsx";
import { GitHubIcon } from "~/components/ui/icon.tsx";
import type { ContributionSummary } from "~/services/github/mod.ts";
import { site } from "~/config/site.ts";

export interface GitHubHeatmapProps {
	contributions: ContributionSummary;
}

const LEGEND_LEVELS: readonly HeatLevel[] = [0, 1, 2, 3, 4];

const Styled = css`
	:scope {
		color: ${theme.textMuted};
	}

	.caption {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: ${spacing[2]} ${spacing[4]};
	}

	.legend {
		display: flex;
		align-items: center;
		gap: 3px;
	}

	.legend-swatch {
		width: 10px;
		height: 10px;
		border-radius: 2px;
		outline: 1px solid ${theme.surfaceBorder};
		outline-offset: -1px;
	}
`;

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
	month: "short",
	day: "numeric",
	year: "numeric",
});

function formatRange(from?: string, to?: string): string {
	if (!from || !to) return "";
	return `${dateFormatter.format(new Date(from))} – ${
		dateFormatter.format(new Date(to))
	}`;
}

export default function GitHubHeatmap({ contributions }: GitHubHeatmapProps) {
	const { days, total, from, to } = contributions;
	const range = formatRange(from, to);
	const countLabel = `${total.toLocaleString("en-US")} contribution${
		total === 1 ? "" : "s"
	}`;

	return (
		<Styled.div>
			<Heatmap
				cells={days}
				unitLabel="contribution"
				cellSize={15}
				summary={`GitHub activity: ${countLabel}${range ? ` between ${range}` : ""}.`}
			>
				<div class="caption">
					<span>
						{countLabel}
						{range && `, ${range}`}. Source:{" "}
						<Link href={site.github.profileUrl}>
							<GitHubIcon class="link-icon" /> GitHub
						</Link>
					</span>
					<span class="legend" aria-hidden="true">
						<span>Less</span>
						{LEGEND_LEVELS.map((level) => (
							<span
								class="legend-swatch"
								key={level}
								style={{ backgroundColor: heatColour(level) }}
							/>
						))}
						<span>More</span>
					</span>
				</div>
			</Heatmap>
		</Styled.div>
	);
}
