// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { computed, css, onMount, signal } from "@404/aether";
import { ease, elevation, media, radius, spacing, theme } from "~/tokens";
import { ChevronLeft, ChevronRight } from "~/components/ui/icon.tsx";

export interface ScrollShelfProps {
	label: string;
	controlTop?: string;
	children?: unknown;
}

const EDGE_THRESHOLD = 8;

const Styled = css`
	@property --shelf-fade-start {
		syntax: "<length>";
		inherits: false;
		initial-value: 0px;
	}

	@property --shelf-fade-end {
		syntax: "<length>";
		inherits: false;
		initial-value: 0px;
	}

	:scope {
		position: relative;
		display: block;
		width: 100%;
		border-radius: ${radius.md};
	}

	:scope:has(> .shelf-viewport:focus-visible) {
		outline: 2px solid ${theme.accent};
		outline-offset: 6px;
	}

	.shelf-viewport {
		--shelf-fade-start: ${spacing[10]};
		--shelf-fade-end: ${spacing[10]};

		display: flex;
		gap: ${spacing[4]};
		width: 100%;
		margin: 0;
		padding: 0;
		list-style: none;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scroll-behavior: smooth;
		scroll-snap-type: x proximity;
		scrollbar-width: none;

		mask-image: linear-gradient(
			to right,
			transparent,
			black var(--shelf-fade-start),
			black calc(100% - var(--shelf-fade-end)),
			transparent
		);
		transition:
			--shelf-fade-start ${ease.normal},
			--shelf-fade-end ${ease.normal};

		&::-webkit-scrollbar {
			display: none;
		}

		&:focus-visible {
			outline: none;
		}
	}

	.shelf-viewport.at-start {
		--shelf-fade-start: 0px;
	}

	.shelf-viewport.at-end {
		--shelf-fade-end: 0px;
	}

	.shelf-control {
		position: absolute;
		top: var(--shelf-control-top, 50%);
		z-index: ${elevation.raised};
		display: flex;
		align-items: center;
		justify-content: center;
		width: ${spacing[8]};
		height: ${spacing[8]};
		border-radius: ${radius.full};
		border: 4px solid ${theme.base};
		background: ${theme.text};
		color: ${theme.base};
		opacity: 0.8;
		transform: translateY(-50%) scale(1);
		transition:
			opacity ${ease.normal},
			transform ${ease.popSpring},
			visibility 0s linear 0s;
	}

	.shelf-control:hover,
	.shelf-control:focus-visible {
		opacity: 1;
		transform: translateY(-50%) scale(1.06);
	}

	.shelf-control:disabled {
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transform: translateY(-50%) scale(0.8);
		transition:
			opacity ${ease.normal},
			transform ${ease.normal},
			visibility 0s linear 0.25s;
	}

	.shelf-control-start {
		left: calc(${spacing[4]} * -1);
	}

	.shelf-control-end {
		right: calc(${spacing[4]} * -1);
	}

	${media.reducedMotion} {
		.shelf-viewport {
			scroll-behavior: auto;
			transition: none;
		}

		.shelf-control,
		.shelf-control:disabled {
			transition: opacity ${ease.fast}, visibility 0s;
			transform: translateY(-50%);
		}
	}
`;

function prefersReducedMotion(): boolean {
	return globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export default function ScrollShelf({ label, controlTop, children }: ScrollShelfProps) {
	const atStart = signal(true);
	const atEnd = signal(false);

	const viewportClass = computed(() =>
		["shelf-viewport", atStart() && "at-start", atEnd() && "at-end"]
			.filter(Boolean)
			.join(" ")
	);

	function measure(viewport: HTMLElement): void {
		const maxScroll = viewport.scrollWidth - viewport.clientWidth;
		atStart(viewport.scrollLeft <= EDGE_THRESHOLD);
		atEnd(viewport.scrollLeft >= maxScroll - EDGE_THRESHOLD);
	}

	function scrollPage(viewport: HTMLElement, direction: -1 | 1): void {
		viewport.scrollBy({
			left: direction * viewport.clientWidth * 0.75,
			behavior: prefersReducedMotion() ? "auto" : "smooth",
		});
	}

	const viewport = (
		<ul
			class={viewportClass}
			tabindex="0"
			aria-label={label}
			on:scroll={(event) => measure(event.currentTarget)}
		>
			{children}
		</ul>
	);

	onMount(() => {
		if (!(viewport instanceof HTMLElement)) return;

		measure(viewport);
		const observer = new ResizeObserver(() => measure(viewport));
		observer.observe(viewport);
		for (const child of viewport.children) observer.observe(child);

		return () => observer.disconnect();
	});

	const control = (direction: -1 | 1) => (
		<button
			type="button"
			class={`shelf-control shelf-control-${direction === -1 ? "start" : "end"}`}
			data-needs-js=""
			disabled={direction === -1 ? atStart : atEnd}
			aria-label={direction === -1 ? "Scroll backwards" : "Scroll forwards"}
			on:click={() => viewport instanceof HTMLElement && scrollPage(viewport, direction)}
		>
			{direction === -1
				? <ChevronLeft size={15} strokeWidth={3} />
				: <ChevronRight size={15} strokeWidth={3} />}
		</button>
	);

	return (
		<Styled.div style={controlTop ? { "--shelf-control-top": controlTop } : undefined}>
			{control(-1)}
			{viewport}
			{control(1)}
		</Styled.div>
	);
}
