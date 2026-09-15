// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { ease, fontSize, radius, spacing, theme } from "~/tokens";

export type ButtonVariant = "default" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

interface BaseProps {
	variant?: ButtonVariant;
	size?: ButtonSize;
	class?: string;
	children?: unknown;
	[key: string]: unknown;
}

export type ButtonProps =
	| (BaseProps & { as?: "button"; type?: "button" | "submit" | "reset" })
	| (BaseProps & { as: "a"; href: string });

const Styled = css`
	:scope {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: ${spacing[2]};
		font-family: inherit;
		font-weight: 500;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		user-select: none;
		border-radius: ${radius.md};
		border: 1px solid transparent;
		text-decoration: none;
		transform: scale(1);
		transition:
			background-color ${ease.fast},
			border-color ${ease.fast},
			color ${ease.fast},
			transform ${ease.snap};

		&:active {
			transform: scale(0.97);
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}
	}

	.size-sm {
		height: 2rem;
		padding: 0 ${spacing[3]};
		font-size: ${fontSize.sm};
	}
	.size-md {
		height: 2.375rem;
		padding: 0 ${spacing[4]};
		font-size: ${fontSize.sm};
	}
	.size-lg {
		height: 2.75rem;
		padding: 0 ${spacing[6]};
		font-size: ${fontSize.md};
	}
	.size-icon {
		height: 2.375rem;
		width: 2.375rem;
		padding: 0;
	}

	.variant-default {
		background-color: ${theme.buttonBg};
		color: ${theme.buttonText};

		&:hover {
			background-color: ${theme.buttonBgHover};
		}
	}

	.variant-outline {
		background-color: transparent;
		border-color: ${theme.buttonOutlineBorder};
		color: ${theme.text};

		&:hover {
			border-color: ${theme.buttonOutlineBorderHover};
			background-color: ${theme.surfaceHover};
		}
	}

	.variant-ghost {
		background-color: transparent;
		color: ${theme.subtext};

		&:hover {
			background-color: ${theme.buttonGhostHover};
			color: ${theme.text};
		}
	}
`;

export default function Button(props: ButtonProps) {
	const { variant = "default", size = "md", class: className, children, ...rest } = props;
	const classes = [`variant-${variant}`, `size-${size}`, className].filter(Boolean).join(
		" ",
	);

	if (rest.as === "a") {
		const { as: _as, ...anchor } = rest;
		return <Styled.a class={classes} {...anchor}>{children}</Styled.a>;
	}

	const { as: _as, type = "button", ...button } = rest;
	return <Styled.button class={classes} type={type} {...button}>{children}
	</Styled.button>;
}
