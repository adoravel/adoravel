// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { fontSize, radius, spacing, theme } from "~/tokens";

const Styled = css`
	:scope {
		display: inline-block;
		padding: 1px ${spacing[2]};
		border-radius: ${radius.full};
		border: 1px dashed ${theme.textMuted};
		font-size: ${fontSize.xs};
		font-weight: 600;
		line-height: 1.5;
		color: ${theme.textMuted};
		white-space: nowrap;
		vertical-align: middle;
	}
`;

export default function DraftBadge({ class: className }: { class?: string }) {
	return (
		<Styled.span class={className} title="This write-up is a draft">
			draft
		</Styled.span>
	);
}
