// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { boundaries, ease, fontFamily, fontSize, radius, spacing, theme } from "~/tokens";
import type { Song } from "~/services/lastfm/mod.ts";
import CoverArt from "~/components/ui/cover-art.tsx";
import ScrollShelf from "~/components/ui/scroll-shelf.tsx";
import { Heart, Play } from "~/components/ui/icon.tsx";

export interface RecentTracksProps {
	tracks: Song[];
	label?: string;
}

const Styled = css`
	:scope {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		width: ${boundaries.coverSize};
		scroll-snap-align: start;
	}

	.track-link {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: ${spacing[3]};
		width: 100%;
		text-align: center;
		border-radius: ${radius.lg};
		color: inherit;
		text-decoration: none;

		&:hover img,
		&:focus-visible img {
			opacity: 1;
		}
	}

	.track-cover-wrap {
		position: relative;
		width: ${boundaries.coverSize};
		height: ${boundaries.coverSize};
	}

	.track-cover {
		width: ${boundaries.coverSize};
		height: ${boundaries.coverSize};
	}

	.track-plays {
		position: absolute;
		right: calc(${spacing[2]} * -1);
		bottom: calc(${spacing[2]} * -1);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: ${spacing[7]};
		height: ${spacing[7]};
		border: 3px solid ${theme.base};
		border-radius: ${radius.full};
		background: ${theme.text};
		color: ${theme.base};
		font-family: ${fontFamily.mono};
		font-size: ${fontSize.xs};
		font-weight: 600;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	.track-meta {
		display: flex;
		flex-direction: column;
		width: 100%;
		font-size: ${fontSize.md};
		color: ${theme.subtext};
	}

	.track-title {
		font-weight: 600;
		font-size: ${fontSize.base};
		color: ${theme.text};
		transition: color ${ease.fast};
	}

	.track-link:hover .track-title,
	.track-link:focus-visible .track-title {
		color: ${theme.accent};
	}

	.track-title,
	.track-artist {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		overflow-wrap: anywhere;
	}

	.track-status {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: ${spacing[1]};
		margin-top: ${spacing[1]};
		color: ${theme.accent};
	}
`;

function TrackStatus({ playing, loved }: Pick<Song, "playing" | "loved">) {
	if (!playing && !loved) return null;

	return (
		<span class="track-status">
			{playing && <Play size={12} label="Now playing" />}
			{loved && <Heart size={12} label="Loved" />}
		</span>
	);
}

function TrackItem({ track }: { track: Song }) {
	return (
		<Styled.li>
			<a class="track-link" href={track.url} target="_blank" rel="noopener noreferrer">
				<span class="track-cover-wrap">
					<CoverArt
						class="track-cover"
						url={track.coverUrl}
						blurhash={track.coverBlurhash}
						seed={track.url}
					/>
					{track.plays > 1 && (
						<span class="track-plays" aria-label={`${track.plays} plays`}>
							×{track.plays}
						</span>
					)}
				</span>
				<span class="track-meta">
					<span class="track-title">{track.title}</span>
					<span class="track-artist">{track.artist}</span>
					<TrackStatus playing={track.playing} loved={track.loved} />
				</span>
				<span class="sr-only">(opens in a new tab)</span>
			</a>
		</Styled.li>
	);
}

export default function RecentTracks(
	{ tracks, label = "Recent tracks" }: RecentTracksProps,
) {
	if (!tracks.length) return null;

	return (
		<ScrollShelf
			label={label}
			controlTop={`calc(${boundaries.coverSize} / 2)`}
		>
			{tracks.map((track) => <TrackItem key={track.url} track={track} />)}
		</ScrollShelf>
	);
}
