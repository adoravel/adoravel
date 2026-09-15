// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css, onMount, signal } from "@404/aether";
import { ease, fontSize, media, radius, spacing, theme } from "~/tokens";
import {
	cycleTheme,
	getStoredTheme,
	nextTheme,
	onThemeChanged,
	THEME_LABELS,
	type ThemePref,
} from "~/storage/theme.ts";
import { play } from "~/sound/mod.ts";

const Styled = css`
	:scope {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: ${spacing[8]};
		height: ${spacing[8]};
		border-radius: ${radius.sm};
		color: ${theme.textMuted};
		transition: color ${ease.fast}, background-color ${ease.fast};
	}

	:scope:hover,
	:scope:focus-visible {
		color: ${theme.text};
		background-color: ${theme.surfaceHover};
	}

	.theme-icon {
		width: ${fontSize.base};
		height: ${fontSize.base};
		stroke-width: 2px;
		overflow: visible;
	}

	.theme-layer {
		transform-origin: center;
		opacity: 0;
		transform: scale(0.5) rotate(-45deg);
		transition: transform ${ease.popSpring}, opacity ${ease.fast};
	}

	:scope[data-theme-pref="system"] .theme-layer-system,
	:scope[data-theme-pref="dark"] .theme-layer-dark,
	:scope[data-theme-pref="light"] .theme-layer-light {
		opacity: 1;
		transform: scale(1) rotate(0deg);
	}

	${media.reducedMotion} {
		.theme-layer {
			transition: opacity ${ease.fast};
			transform: none;
		}
	}
`;

function SystemLayer() {
	return (
		<g class="theme-layer theme-layer-system">
			<path d="M12 2v2" />
			<path d="M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715" />
			<path d="M16 12a4 4 0 0 0-4-4" />
			<path d="m19 5-1.256 1.256" />
			<path d="M20 12h2" />
		</g>
	);
}

function DarkLayer() {
	return (
		<g class="theme-layer theme-layer-dark">
			<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
		</g>
	);
}

function LightLayer() {
	return (
		<g class="theme-layer theme-layer-light">
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2" />
			<path d="M12 20v2" />
			<path d="m4.93 4.93 1.41 1.41" />
			<path d="m17.66 17.66 1.41 1.41" />
			<path d="M2 12h2" />
			<path d="M20 12h2" />
			<path d="m6.34 17.66-1.41 1.41" />
			<path d="m19.07 4.93-1.41 1.41" />
		</g>
	);
}

function describe(pref: ThemePref): string {
	return `Theme: ${THEME_LABELS[pref]}. Switch to ${THEME_LABELS[nextTheme(pref)]}`;
}

export default function ThemeSwitcher() {
	const pref = signal<ThemePref>("system");

	onMount(() => {
		pref(getStoredTheme());
		return onThemeChanged((detail) => pref(detail.pref));
	});

	return (
		<Styled.button
			type="button"
			data-theme-pref={pref}
			aria-label={pref.map(describe)}
			title={pref.map(describe)}
			data-silent=""
			data-needs-js=""
			on:click={() => {
				pref(cycleTheme());
				play("switch");
			}}
		>
			<svg
				class="theme-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				focusable="false"
			>
				<SystemLayer />
				<DarkLayer />
				<LightLayer />
			</svg>
		</Styled.button>
	);
}
