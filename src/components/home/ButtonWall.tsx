/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css } from "~/lib/css.ts";
import { spacing, theme } from "~/layout.tsx";
import { friends } from "~/content/friends.ts";

const Styled = css(`
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
	}
`);

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
