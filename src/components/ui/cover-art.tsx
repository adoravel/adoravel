// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { ease, radius, theme } from "~/tokens";
import { blurhashToDataUrl } from "~/services/media/blurhash.ts";

const PLACEHOLDER_GRADIENTS = [
	`linear-gradient(135deg, ${theme.accent} 0%, ${theme.base} 50%, ${theme.textMuted} 100%)`,
	`linear-gradient(45deg, ${theme.base} 0%, ${theme.onAccent} 40%, ${theme.accent} 100%)`,
	`linear-gradient(225deg, ${theme.surfaceBorder} 0%, ${theme.accent} 30%, ${theme.base} 100%)`,
] as const;

function hashString(input: string): number {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = (input.charCodeAt(i) + ((hash << 5) - hash)) | 0;
	}
	return Math.abs(hash);
}

export function placeholderGradient(seed: string | undefined): string {
	if (!seed) return PLACEHOLDER_GRADIENTS[0];
	return PLACEHOLDER_GRADIENTS[hashString(seed) % PLACEHOLDER_GRADIENTS.length];
}

const Styled = css`
	:scope {
		position: relative;
		display: block;
		width: 64px;
		height: 64px;
		flex-shrink: 0;
		background: ${theme.base};
		border: 1px solid ${theme.baseBorder};
		border-radius: ${radius.lg};
		overflow: hidden;
		isolation: isolate;
	}

	.cover-placeholder {
		position: absolute;
		inset: -8px;
		background-size: cover;
		background-position: center;
		filter: blur(6px);
	}

	.cover-image {
		position: relative;
		object-fit: cover;
		opacity: 0.8;
		transition: opacity ${ease.normal};
	}

	:scope:hover .cover-image {
		opacity: 1;
	}
`;

export interface CoverArtProps {
	url: string | undefined;
	blurhash?: string;
	seed?: string;
	alt?: string;
	class?: string;
}

function placeholderStyle(blurhash: string | undefined, seed: string | undefined) {
	const preview = blurhash && blurhashToDataUrl(blurhash);
	return preview
		? { backgroundImage: `url("${preview}")` }
		: { background: placeholderGradient(seed) };
}

export default function CoverArt(
	{ url, blurhash, seed = url, alt = "", class: className }: CoverArtProps,
) {
	return (
		<Styled.span class={className} aria-hidden={alt ? undefined : "true"}>
			<span class="cover-placeholder" style={placeholderStyle(blurhash, seed)} />
			{url && (
				<img class="cover-image" src={url} alt={alt} loading="lazy" decoding="async" />
			)}
		</Styled.span>
	);
}
