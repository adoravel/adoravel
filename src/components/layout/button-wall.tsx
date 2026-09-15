// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { ease, fontSize, media, spacing, theme } from "~/tokens";
import {
	WEB_BUTTON_HEIGHT,
	WEB_BUTTON_WIDTH,
	type WebButton,
} from "~/content/buttons.ts";

export interface ButtonWallProps {
	buttons: readonly WebButton[];
	class?: string;
}

const Styled = css`
	:scope {
		position: relative;
		justify-content: center;
		display: flex;
		flex-wrap: wrap;
		gap: ${spacing[2]};
		margin: 0;
		padding: 0 0 ${spacing[6]};
		list-style: none;
	}

	.button-link {
		display: block;
		line-height: 0;
		opacity: 0.85;
		transform: translate3d(0, 0, 0);
		transition: opacity ${ease.fast}, transform ${ease.hover};
		will-change: transform;
	}

	.button-link:hover,
	.button-link:focus-visible {
		opacity: 1;
		transform: translate3d(0, -1px, 0);
	}

	.button-image {
		display: block;
		width: ${WEB_BUTTON_WIDTH}px;
		height: ${WEB_BUTTON_HEIGHT}px;
		image-rendering: pixelated;
	}

	.button-label {
		position: absolute;
		text-align: center;
		left: 0;
		right: 0;
		bottom: 0;
		font-size: ${fontSize.xs};
		line-height: 1.5;
		color: ${theme.textMuted};
		opacity: 0;
		pointer-events: none;
		transition: opacity ${ease.fast};
	}

	.button:hover .button-label,
	.button:focus-within .button-label {
		opacity: 1;
	}

	${media.reducedMotion} {
		.button-link {
			transition: opacity ${ease.fast};
			transform: none !important;
		}
	}
`;

export default function ButtonWall({ buttons, class: className }: ButtonWallProps) {
	if (!buttons.length) return null;

	return (
		<Styled.ul class={className} aria-label="Web buttons">
			<li class="button" aria-hidden>
				<iframe
					class="button-link"
					width="88"
					height="31"
					style="border:none"
					src="/button.min.html"
				>
				</iframe>
				<span class="button-label" aria-hidden="true">{`>_<`}</span>
			</li>
			{buttons.map((button) => (
				<li class="button" key={button.href}>
					<a
						class="button-link"
						href={button.href}
						target="_blank"
						rel="noopener"
						aria-label={button.label}
						referrerpolicy="strict-origin"
					>
						<img
							class="button-image"
							src={button.src}
							alt={button.alt}
							width={WEB_BUTTON_WIDTH}
							height={WEB_BUTTON_HEIGHT}
							loading="lazy"
							decoding="async"
						/>
					</a>
					<span class="button-label" aria-hidden="true">{button.label}</span>
				</li>
			))}
		</Styled.ul>
	);
}
