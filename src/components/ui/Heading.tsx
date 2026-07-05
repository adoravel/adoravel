/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css } from "@404/imouto";

const Styled = css`
	:scope {
		font-size: var(--font-size-md);
		font-weight: bold;
		position: relative;
		display: flex;
		align-items: center;
		color: var(--theme-foreground);
	}
`;

export default function Heading({ children, class: className }: { children: any; class?: string }) {
	return (
		<Styled.h2 class={className ? ` ${className}` : ""}>
			{children}
		</Styled.h2>
	);
}
