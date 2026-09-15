// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { boundaries, ease, radius, theme } from "~/tokens";
import { site } from "~/config/site.ts";

const Styled = css`
	:scope {
		display: inline-block;
		flex-shrink: 0;
		border-radius: ${radius.md};
	}

	.avatar-image {
		width: ${boundaries.avatarSize};
		height: ${boundaries.avatarSize};
		object-fit: cover;
		border-radius: inherit;
		background: ${theme.surface};
		opacity: 0.9;
		transition: opacity ${ease.normal};
	}

	:scope:hover .avatar-image,
	:scope:focus-visible .avatar-image {
		opacity: 1;
	}
`;

export default function Avatar() {
	const { src, artist, platform, href } = site.avatar;
	const credit = `Profile artwork by ${artist} on ${platform}`;

	return (
		<Styled.a href={href} target="_blank" rel="noopener noreferrer" title={credit}>
			<img
				class="avatar-image"
				src={src}
				alt={credit}
				width="72"
				height="72"
				fetchpriority="high"
				decoding="async"
				draggable="false"
			/>
			<span class="sr-only">(opens in a new tab)</span>
		</Styled.a>
	);
}
