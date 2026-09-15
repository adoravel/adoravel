// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css, onMount } from "@404/aether";
import { ease, fontSize, media, radius, spacing, theme } from "~/tokens";
import { soundEnabled, toggleSound } from "~/sound/mod.ts";
import { onSoundChanged } from "~/storage/sound.ts";

const Styled = css`
	:scope {
		display: inline-flex;
		align-items: center;
		gap: ${spacing[2]};
		padding: ${spacing[1]} ${spacing[2]};
		margin: 0 calc(${spacing[2]} * -1);
		border-radius: ${radius.sm};
		font-size: ${fontSize.sm};
		color: ${theme.textMuted};
		transition: color ${ease.fast}, background-color ${ease.fast};
	}

	:scope:hover,
	:scope:focus-visible {
		color: ${theme.text};
		background-color: ${theme.surfaceHover};
	}

	.toggle-track {
		position: relative;
		width: 26px;
		height: 14px;
		border-radius: ${radius.full};
		background: ${theme.lift};
		transition: background-color ${ease.hover};
	}

	.toggle-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 10px;
		height: 10px;
		border-radius: ${radius.full};
		background: ${theme.base};
		transform: translate3d(0, 0, 0);
		transition: transform ${ease.hover};
	}

	:scope[aria-checked="true"] .toggle-track {
		background: ${theme.accent};
	}

	:scope[aria-checked="true"] .toggle-thumb {
		transform: translate3d(12px, 0, 0);
	}

	${media.reducedMotion} {
		.toggle-track,
		.toggle-thumb {
			transition: none;
		}
	}
`;

export default function SoundToggle() {
	const enabled = soundEnabled();

	onMount(() => {
		enabled(soundEnabled().peek());
		return onSoundChanged((next) => enabled(next));
	});

	return (
		<Styled.button
			type="button"
			role="switch"
			aria-checked={enabled.map(String)}
			data-silent=""
			data-needs-js=""
			on:click={() => toggleSound()}
		>
			<span class="toggle-track" aria-hidden="true">
				<span class="toggle-thumb" />
			</span>
			<span>sound</span>
		</Styled.button>
	);
}
