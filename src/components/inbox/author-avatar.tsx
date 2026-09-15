// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { ease, media, radius, theme } from "~/tokens";
import { BlueskyIcon, DiscordIcon, LastFmIcon } from "~/components/ui/icon.tsx";
import { PROVIDER_LABELS } from "~/components/inbox/identity.ts";
import type { Author, AuthorProvider } from "~/services/messages/types.ts";

export interface AuthorAvatarProps {
	author: Author;
	size?: number;
	flip?: boolean;
}

export const PROVIDER_COLOURS: Record<AuthorProvider, string> = {
	discord: "#5865f2",
	bluesky: "#1083fe",
	lastfm: "#d51007",
};

export const PROVIDER_ICONS = {
	discord: DiscordIcon,
	bluesky: BlueskyIcon,
	lastfm: LastFmIcon,
} as const;

const Styled = css`
	:scope {
		position: relative;
		display: inline-block;
		flex-shrink: 0;
		width: var(--avatar-size);
		height: var(--avatar-size);
		perspective: 200px;
	}

	.avatar-card {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		transition: transform ${ease.slow};
		will-change: transform;
	}

	:scope[data-flip]:hover .avatar-card,
	:scope[data-flip]:focus-visible .avatar-card {
		transform: rotateY(180deg);
	}

	.avatar-face {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: ${radius.full};
		backface-visibility: hidden;
		overflow: hidden;
	}

	.avatar-front {
		background: ${theme.lift};
		color: ${theme.subtext};
		font-weight: 600;
		font-size: calc(var(--avatar-size) * 0.42);
		text-transform: uppercase;
		user-select: none;
	}

	.avatar-front img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.avatar-back {
		background: var(--provider-colour);
		color: #fff;
		transform: rotateY(180deg);
	}

	.avatar-back svg {
		width: 52%;
		height: 52%;
	}

	.avatar-badge {
		position: absolute;
		right: -3px;
		bottom: -3px;
		display: grid;
		place-items: center;
		width: max(14px, calc(var(--avatar-size) * 0.5));
		height: max(14px, calc(var(--avatar-size) * 0.5));
		box-sizing: content-box;
		border: 2px solid ${theme.surface};
		border-radius: ${radius.full};
		background: var(--provider-colour);
		color: #fff;
		line-height: 0;
	}

	.avatar-badge svg {
		width: 62%;
		height: 62%;
		display: block;
	}

	${media.reducedMotion} {
		.avatar-card {
			transition: none;
		}
	}
`;

export default function AuthorAvatar(
	{ author, size = 32, flip = false }: AuthorAvatarProps,
) {
	const Mark = PROVIDER_ICONS[author.provider];
	const label = `${author.displayName ?? author.handle} via ${
		PROVIDER_LABELS[author.provider]
	}`;

	return (
		<Styled.span
			style={{
				"--avatar-size": `${size}px`,
				"--provider-colour": PROVIDER_COLOURS[author.provider],
			}}
			data-flip={flip ? "" : undefined}
			tabindex={flip ? "0" : undefined}
			role="img"
			aria-label={label}
		>
			<span class="avatar-card">
				<span class="avatar-face avatar-front">
					{author.avatarUrl
						? <img src={author.avatarUrl} alt="" loading="lazy" decoding="async" />
						: (author.displayName ?? author.handle).charAt(0)}
				</span>
				{flip && (
					<span class="avatar-face avatar-back">
						<Mark />
					</span>
				)}
			</span>
			{!flip && (
				<span class="avatar-badge">
					<Mark />
				</span>
			)}
		</Styled.span>
	);
}
