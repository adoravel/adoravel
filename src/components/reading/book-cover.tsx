// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { ease, media, theme } from "~/tokens";
import { placeholderGradient } from "~/components/ui/cover-art.tsx";
import { blurhashToDataUrl } from "~/services/media/blurhash.ts";

export interface BookCoverProps {
	title: string;
	url?: string;
	blurhash?: string;
	width?: number;
	class?: string;
}

const Styled = css`
	:scope {
		--book-width: 128px;
		--book-depth: 16px;

		position: relative;
		display: block;
		width: var(--book-width);
		aspect-ratio: 2 / 3;
		perspective: 900px;
	}

	.book {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		transform: rotateY(-26deg);
		transition: transform ${ease.slow};
		will-change: transform;
	}

	:scope:hover .book {
		transform: rotateY(-8deg);
	}

	.book-face {
		position: absolute;
		inset: 0;
		border-radius: 2px 0 0 2px;
		background-size: cover;
		background-position: center;
		background-color: ${theme.lift};
		overflow: hidden;
		transform: translateZ(calc(var(--book-depth) / 2));
		backface-visibility: hidden;
		outline: 1px solid transparent;
		box-shadow: 0 1px 0 rgba(255, 255, 255, 0.08) inset;
	}

	.book-face img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.8;
		transition: opacity ${ease.normal};
	}

	:scope:hover .book-face img {
		opacity: 1;
	}

	.book-pages {
		position: absolute;
		top: 1px;
		bottom: 1px;
		left: 100%;
		width: var(--book-depth);
		background:
			linear-gradient(
			to right,
			rgba(0, 0, 0, 0.28),
			rgba(0, 0, 0, 0.04) 22%,
			transparent 55%,
			rgba(0, 0, 0, 0.1) 85%,
			rgba(0, 0, 0, 0.3)
		),
			linear-gradient(to bottom, rgba(0, 0, 0, 0.12), transparent 8%, transparent 92%,
			rgba(0, 0, 0, 0.16)),
			repeating-linear-gradient(to right, rgba(60, 50, 35, 0.16) 0 1px, transparent 1px
			3px),
			repeating-linear-gradient(to right, transparent 0 5px, rgba(255, 255, 255, 0.35) 5px
			6px),
			#ece6d8;
		transform-origin: left center;
		transform: translateZ(calc(var(--book-depth) / -2)) rotateY(-90deg);
		outline: 1px solid transparent;
	}

	.book-back {
		position: absolute;
		inset: 0;
		border-radius: 2px 0 0 2px;
		background: ${theme.lift};
		transform: translateZ(calc(var(--book-depth) / -2)) rotateY(180deg);
		backface-visibility: hidden;
		outline: 1px solid transparent;
	}

	.book-shadow {
		position: absolute;
		left: 6%;
		right: 2%;
		bottom: -12px;
		height: 16px;
		border-radius: 50%;
		background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.5), transparent 70%);
		filter: blur(5px);
		pointer-events: none;
	}

	${media.reducedMotion} {
		.book {
			transition: none;
		}
	}
`;

export default function BookCover(
	{ title, url, blurhash, width = 128, class: className }: BookCoverProps,
) {
	const preview = blurhash && blurhashToDataUrl(blurhash, 8, 12);
	const placeholder = preview ? `url("${preview}")` : placeholderGradient(url ?? title);

	return (
		<Styled.span
			class={className}
			style={{ "--book-width": `${width}px` }}
			role="img"
			aria-label={`Cover of ${title}`}
		>
			<span class="book">
				<span class="book-back" />
				<span class="book-pages" />
				<span class="book-face" style={{ backgroundImage: placeholder }}>
					{url && <img src={url} alt="" loading="lazy" decoding="async" />}
				</span>
			</span>
			<span class="book-shadow" aria-hidden="true" />
		</Styled.span>
	);
}
