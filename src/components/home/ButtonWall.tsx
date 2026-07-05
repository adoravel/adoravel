/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css } from "@404/imouto";
import { ease, spacing, theme } from "~/layout.tsx";
import { friends } from "~/content/friends.ts";

const Styled = css`
	:scope {
		display: flex;
		flex-wrap: wrap;
		gap: ${spacing[1]};
	}

	a, iframe {
		display: inline-block;
		text-align: center;
		width: 88px;
		height: 31px;
		image-rendering: pixelated;
		background-color: ${theme.lift};
		color: ${theme.text};
		clip-path: polygon(
			0px calc(100% - 2px),
			2px calc(100% - 2px),
			2px 100%,
			calc(100% - 2px) 100%,
			calc(100% - 2px) calc(100% - 2px),
			100% calc(100% - 2px),
			100% 2px,
			calc(100% - 2px) 2px,
			calc(100% - 2px) 0px,
			2px 0px,
			2px 2px,
			0px 2px
		);

		transform: translateY(0px);
		transition: transform ${ease.spring}, box-shadow ${ease.spring};

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.2);
		}
	}
`;

export default function ButtonWall({ buttons }: { buttons: typeof friends }) {
	return (
		<Styled.div>
			<iframe width="88" height="31" style="border:none" src="/button.min.html"></iframe>
			<a href={buttons["88x31"][0].href} rel="noopener nofollow">
				<img src={buttons["88x31"][0].src} alt={buttons["88x31"][0].alt} width="88" height="31" />
			</a>
			{buttons.iframe.map((script: string, idx: number) => (
				<iframe
					key={"iframe-" + idx}
					width="88"
					height="31"
					style="border:none"
					sandbox="allow-scripts allow-popups"
					srcdoc={script}
				/>
			))}
			{buttons["88x31"].slice(1).map(({ href, src, alt }: any, idx: number) => (
				<a key={idx} href={href} rel="noopener nofollow">
					<img src={src} alt={alt} width="88" height="31" onerror="this.parentElement.remove()" />
				</a>
			))}
		</Styled.div>
	);
}
