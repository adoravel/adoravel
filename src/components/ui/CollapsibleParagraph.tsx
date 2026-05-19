/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css } from "~/lib/css.ts";
import { theme } from "~/layout.tsx";

const Styled = css(`
	:scope {
		display: inline;
	}

	.read-more-checkbox {
		display: none;

		& ~ .read-more-content { display: none !important; }
		& ~ .read-more-label-collapse { display: none; }

		&:checked {
			& ~ .read-more-content { display: block !important; }
			& ~ .read-more-label-expand { display: none; }
			& ~ .read-more-label-collapse { display: inline-block; }
		}
	}

	.read-more-btn {
		margin-left: 1ch;
		cursor: pointer;
		user-select: none;
		color: ${theme.accent};
	}

	.read-more-content {
		margin-top: 2ch;
		padding: 0 2ch;
		border-left: 2px solid ${theme.lift};
	}
`);

export default function CollapsibleParagraph({ id, children }: { id: string; children: any }) {
	return (
		<Styled.span>
			<input type="checkbox" id={id} class="read-more-checkbox" autocomplete="off" />
			<label for={id} class="read-more-btn link read-more-label-expand">
				Read more
			</label>
			<label for={id} class="read-more-btn link read-more-label-collapse">
				Show less
			</label>
			<div class="read-more-content">{children}</div>
		</Styled.span>
	);
}
