// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { fontSize, spacing } from "~/tokens";

export interface SectionProps {
	as?: "section" | "article" | "aside" | "div";
	title?: string;
	action?: unknown;
	label?: string;
	class?: string;
	needsJs?: boolean;
	children?: unknown;
}

const Styled = css`
	:scope {
		position: relative;
	}

	.section-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		column-gap: ${spacing[4]};
		row-gap: ${spacing[2]};
		margin-bottom: ${spacing[7]};
	}

	.section-title {
		margin: 0;
		font-size: ${fontSize.xl};
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.section-action {
		font-size: ${fontSize.sm};
		font-weight: 600;
	}
`;

function slugify(input: string): string {
	return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function Section({
	as = "section",
	title,
	action,
	label,
	class: className,
	needsJs = false,
	children,
}: SectionProps) {
	const Tag = Styled[as];
	const headingId = title ? `${slugify(title)}-heading` : undefined;

	return (
		<Tag
			class={className}
			aria-labelledby={headingId}
			aria-label={label}
			data-needs-js={needsJs ? "" : undefined}
		>
			{title && (
				<header class="section-header">
					<h2 class="section-title" id={headingId}>{title}</h2>
					{action && <div class="section-action">{action}</div>}
				</header>
			)}
			{children}
		</Tag>
	);
}
