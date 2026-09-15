// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { spacing, theme } from "~/tokens";

const Styled = css`
	:scope {
		height: 2px;
		border: none;
		margin-bottom: ${spacing[8]};
		background: linear-gradient(to right, transparent, ${theme
			.surfaceBorder} 75%, transparent);
	}
`;

export function Rule() {
	return <Styled.hr aria-hidden="true" />;
}
