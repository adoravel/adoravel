// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { ease, media, spacing, theme } from "~/tokens";
import { ArrowRight, ArrowUp, ArrowUpRight } from "~/components/ui/icon.tsx";

export interface LinkProps {
	href: string;
	class?: string;
	external?: boolean;
	arrow?: boolean | "up";
	children?: unknown;
	[key: string]: unknown;
}

const EXTERNAL_RE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

export function isExternalHref(href: string): boolean {
	return EXTERNAL_RE.test(href);
}

const Styled = css`
	:scope {
		position: relative;
		display: inline-flex;
		align-items: baseline;
		gap: ${spacing[1]};
		color: inherit;
		text-decoration: none;
		cursor: pointer;
		padding-bottom: 2px;
		transition: color ${ease.hover};
		white-space: nowrap;
	}

	:scope:hover,
	:scope:focus-visible {
		color: ${theme.accent};
	}

	:scope::after {
		content: "";
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 1px;
		background-color: currentColor;
		transform: scaleX(0);
		transform-origin: bottom left;
		transition: transform ${ease.hover};
	}

	:scope:hover::after,
	:scope:focus-visible::after {
		transform: scaleX(1);
	}

	.link-arrow {
		align-self: center;
		width: 12px;
		height: 12px;
		flex-shrink: 0;
		stroke-width: 2.25;
		transform: translate3d(0, 0, 0);
		transition: transform ${ease.hover}, color ${ease.hover};
		will-change: transform;
	}

	:scope:hover .link-arrow,
	:scope:focus-visible .link-arrow {
		transform: translate3d(2px, -2px, 0);
	}

	:scope:hover .link-arrow-inline,
	:scope:focus-visible .link-arrow-inline {
		transform: translate3d(3px, 0, 0);
	}

	:scope:hover .link-arrow-up,
	:scope:focus-visible .link-arrow-up {
		transform: translate3d(0, -3px, 0);
	}

	.link-icon {
		align-self: center;
		width: 1em;
		height: 1em;
		flex-shrink: 0;
	}

	${media.reducedMotion} {
		.link-arrow,
		:scope::after {
			transition: none;
		}

		:scope:hover .link-arrow,
		:scope:focus-visible .link-arrow {
			transform: none;
		}
	}
`;

export default function Link({
	href,
	class: className,
	external = isExternalHref(href),
	arrow = true,
	children,
	...rest
}: LinkProps) {
	const Arrow = arrow === "up" ? ArrowUp : external ? ArrowUpRight : ArrowRight;
	const arrowClass = arrow === "up"
		? "link-arrow link-arrow-up"
		: external
		? "link-arrow"
		: "link-arrow link-arrow-inline";

	return (
		<Styled.a
			href={href}
			class={className}
			target={external ? "_blank" : undefined}
			rel={external ? "noopener noreferrer" : undefined}
			{...rest}
		>
			{children}
			{external && <span class="sr-only">(opens in a new tab)</span>}
			{arrow && <Arrow class={arrowClass} />}
		</Styled.a>
	);
}
