/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css } from "~/lib/css.ts";
import { boundaries, fontFamily, fontSize, radius, spacing, theme } from "~/layout.tsx";
import { Song } from "~/content/songs.ts";
import { SongArt } from "~/components/content/SongArt.tsx";

interface Props extends Song {}

const Styled = css(`
	:scope {
		display: flex;
		flex-direction: column;
		width: 100%;
		background: ${theme.base};
		border: 1px solid ${theme.baseBorder};
		border-radius: ${radius.lg};
		font-size: ${fontSize.sm};
		color: ${theme.subtext};
		
		font-family: ${fontFamily.misc};
		letter-spacing: ${spacing.letter.misc};
	}

	.header {
		display: flex;
		align-items: center;
		line-height: 1;
		padding: ${spacing[4]} ${spacing[4]};
		gap: ${spacing[2]};
		border-bottom: 1px solid ${theme.baseBorder};
	}

	.release-date {
		display: flex;
		align-items: center;
		color: ${theme.textMuted};
		letter-spacing: ${spacing.letter.plus};
	}

	.listen-link {
		margin-left: auto;
		gap: ${spacing[1]};
		color: ${theme.textMuted};
		font-size: ${fontSize.xs};
	}

	.listen-link::after {
		background-color: ${theme.textMuted} !important;
		margin-right: 0;
		margin-left: 8px;
	}
	
	.listen-link:hover {
		color: ${theme.accent};
		
		&::after {
			background-color: ${theme.accent} !important; 
		}
	}

	.body {
		display: flex;
		align-items: flex-start;
		padding: ${spacing[4]};
		gap: ${spacing[4]};
		text-decoration: none;
		color: inherit;
		
		@media (max-width: ${boundaries.mobileMaxWidth}) {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}
	}
	
	.info {
		display: flex;
		flex-direction: column;
		line-height: 1.75;
	}

	.info-title {
		color: ${theme.text};
		font-weight: 500;
		font-size: ${fontSize.md};
	}

	.info-tag {
		margin-left: 1ch;
		color: ${theme.textMuted};
	}

	.info-artist {
		color: ${theme.textMuted};
		font-size: ${fontSize.sm};
	}

	.info-artist > span {
		color: ${theme.textMuted};
	}
`);

export default function FeaturedSong({
	title,
	artist,
	album,
	releaseDate,
	coverUrl,
	url,
	tag,
}: Props) {
	return (
		<Styled.div>
			<div class="header">
				<div class="release-date">
					{releaseDate}
				</div>
				<a class="listen-link link" href={url} target="_blank" rel="noopener noreferrer">
					listen
				</a>
			</div>
			<a class="body" href={url} target="_blank" rel="noopener noreferrer">
				<SongArt url={coverUrl} />
				<div class="info">
					<div class="info-title">
						{title}
						{tag && <span class="info-tag">{tag}</span>}
					</div>
					<div class="info-artist">
						{album && <span>{album}</span>}
						<br />
						{artist}
					</div>
				</div>
			</a>
		</Styled.div>
	);
}
