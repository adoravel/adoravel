/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { boundaries, ease, elevation, fontFamily, fontSize, radius, spacing, theme } from "~/layout.tsx";
import { css } from "@404/imouto";
import { tracks } from "~/services/lastfm.ts";
import { SongArt } from "~/components/content/SongArt.tsx";

export interface RecentTracksProps {
	tracks: NonNullable<ReturnType<typeof tracks>>;
	cutoff: number;
	profileUrl: string;
}

const Styled = css`
	:scope {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 160px));
		gap: ${spacing[6]};
		margin: 0;
		margin-top: 0.5rem !important;
		padding: 0;
		list-style: none;

		font-family: ${fontFamily.misc};
		letter-spacing: ${spacing.letter.misc};
	}

	li > a {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: ${spacing[3]};
		max-width: ${boundaries.avatarSize};

		transform: translateY(0px);
		transition: transform ${ease.spring}, filter ${ease.spring};

		&:hover {
			opacity: 1;

			transform: translateY(-4px);
			filter: drop-shadow(0 12px 32px rgba(0, 0, 0, 0.45)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
		}
	}

	.cover {
		width: ${boundaries.avatarSize};
		height: ${boundaries.avatarSize};
		border-radius: ${radius.art};
		background: ${theme.lift};
		object-fit: cover;
	}

	.meta {
		display: flex;
		flex-direction: column;
		font-size: ${fontSize.md};
		color: ${theme.subtext};
	}

	.meta strong {
		font-weight: 600;
		font-size: ${fontSize.base};
		color: ${theme.text};
	}

	.loved {
		color: ${theme.accent};
	}

	.meta strong,
	.meta span {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		word-break: break-word;
		text-overflow: ellipsis;
		max-width: 100%;
	}

	.fm-more {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		width: 100%;
		height: 100%;
		opacity: 0.75;

		background: ${theme.base};
		border: 1px solid ${theme.baseBorder};
		border-radius: ${radius.art};
		font-size: ${fontSize.sm};
		color: ${theme.text};
		padding: ${spacing[3]};
		z-index: ${elevation.base};

		@media (max-width: 930px) {
			display: none;
		}
	}

	.fm-more::before {
		content: "→";
		position: absolute;
		color: transparent;
		font-size: 15rem;
		-webkit-text-stroke: 2px ${theme.surfaceBorder};
		z-index: ${elevation.below};
	}
`;

function TrackItem({ track }: { track: RecentTracksProps["tracks"][number] }) {
	const { url, coverUrl, title, artist, playing, loved } = track;
	const showStatus = playing || loved;

	return (
		<li class="fm-recent">
			<a href={url}>
				<SongArt class="cover" url={coverUrl} />
				<div class="meta">
					<strong class="title">{title}</strong>
					<span>{artist}</span>

					{showStatus && (
						<span class="loved">
							{playing && <span title="Now playing">▷</span>}
							{loved && <span class="loved" title="Loved">❤</span>}
						</span>
					)}
				</div>
			</a>
		</li>
	);
}

export default function RecentTracks({ tracks, cutoff, profileUrl }: RecentTracksProps) {
	const content = cutoff !== undefined ? tracks.slice(0, cutoff) : tracks;

	return (
		<Styled.ul>
			{content.map((track) => <TrackItem key={track.url} track={track} />)}
			<li>
				<a class="fm-more" href={profileUrl}>
					Check out more on Last.fm
				</a>
			</li>
		</Styled.ul>
	);
}
