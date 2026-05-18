/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { boundaries, elevation, fontSize, radius, spacing, theme } from "~/layout.tsx";
import { css, Import } from "../mech/css.ts";
import { FM_USER, tracks } from "../mech/fm.ts";

const fm = css(`
	:scope {
		margin-top: 0.5rem !important;
	}

	.fm-more:hover {
  		opacity: 1;
	}

	.fm-more::before {
		content: "→";
		position: absolute;
		color: transparent;
		font-size: 15rem;
		-webkit-text-stroke: 2px ${theme.surfaceBorder};
		z-index: ${elevation.below};
	}

	.fm-more {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		overflow: hidden;
		width: 100%;
		height: 100%;
		opacity: 75%;

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

	:scope {
    	display: grid;
    	grid-template-columns: repeat(auto-fill, minmax(120px, 160px));
		gap: ${spacing[6]};
		margin-top: ${spacing[2]};
		padding: 0;
		margin: 0;
		list-style: none;
	}
	
	li > a {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: ${spacing[3]};
		max-width: ${boundaries.avatarSize};
	}

	li > a > .cover {
		width: ${boundaries.avatarSize};
		height: ${boundaries.avatarSize};
		border-radius: ${radius.art};
		background: ${theme.lift};
		object-fit: cover;
	}

	li > a > .meta {
		display: flex;
		flex-direction: column;
		font-size: ${fontSize.md};
		color: ${theme.subtext};
	}

	li > a > .meta > .loved {
		color: ${theme.accent};
	}

	li > a > .meta strong {
		font-weight: 600;
		font-size: ${fontSize.base};
		color: ${theme.text};
	}

	li > a > .meta strong,
	li > a > .meta span {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		word-wrap: anywhere;
		text-overflow: ellipsis;
		max-width: 100%;
	}
`);

export function Fm() {
	if (!tracks) return;

	const content = tracks().slice(0, 4);

	return (
		<ul class={fm.scope}>
			<Import styles={[fm]} />
			{content.map((track) => (
				<li class="fm-recent" key={track.artist + track.name}>
					<a href={track.url}>
						<img
							class="cover"
							src={track.cover ||
								"https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"}
							alt=""
						/>
						<div class="meta">
							<strong class="title">{track.name}</strong>
							<span>{track.artist}</span>
							{track.playing
								? (
									<span class="loved" title="Now playing">
										▷
									</span>
								)
								: (
									track.loved && (
										<span class="loved" title="Loved">
											❤
										</span>
									)
								)}
						</div>
					</a>
				</li>
			))}
			<li>
				<a class="fm-more" href={`https://last.fm/user/${FM_USER}`}>
					Check out more on Last.fm
				</a>
			</li>
		</ul>
	);
}
