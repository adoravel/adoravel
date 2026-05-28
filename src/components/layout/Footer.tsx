/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css } from "~/lib/css.ts";
import { Fluxer, GitHub, Mail, Tangled } from "~/components/ui/Icon.tsx";
import { ease, fontSize, spacing, theme } from "~/layout.tsx";

const Styled = css(`
	:scope {
		display: block;
		color: ${theme.textMuted};
		font-size: ${fontSize.md};
	}

	hr {
		border: none;
		border-top: 1px solid ${theme.surfaceBorder}; 
		margin: ${spacing.section} 0;
	}

	.footer-highlight {
		color: ${theme.text};
		font-weight: 500;

		&::after {
			background-color: ${theme.text};
		}
	}
	
	ul {
		display: flex;
		flex-wrap: wrap;
		gap: ${spacing[2]};
		margin-top: ${spacing[4]};
		padding-left: 0;
		list-style: none;
	}

	ul > li > :is(a, button) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: ${spacing[1]} ${spacing[4]};
		gap: 1ch;
		color: ${theme.subtext};
		background-color: ${theme.surface};
		font-size: ${fontSize.sm};
		text-decoration: none;
		border: none;
		outline: none;
		border-radius: 1000px;
		cursor: pointer;

		transform: translateY(0px);
		box-shadow: 0 0px 0px rgba(0, 0, 0, 0);
		transition:
			filter ${ease.fast},
			transform ${ease.spring},
			box-shadow ${ease.spring};
 
		&:hover {
			filter: brightness(0.85);
			transform: translateY(-3px);
			box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
		}
	}
`);

export default function Footer() {
	return (
		<Styled.footer>
			<hr />
			<p>
				© {new Date().getFullYear()} <span class="footer-highlight">kyu.re</span>
				{" · "}
				Made with <span class="highlight-rose">❤</span> · Source code available at{" "}
				<a class="footer-highlight" href="https://kyu.re/~web">https://kyu.re/~web</a> under the{" "}
				<a class="footer-highlight" href="https://spdx.org/licenses/AGPL-3.0-or-later.html">
					GNU Affero General Public License v3.0
				</a>
				, with all site content licensed under{" "}
				<a class="footer-highlight" href="https://creativecommons.org/licenses/by-sa/4.0/">
					CC BY-SA 4.0
				</a>
				.
			</p>
			<ul>
				<li>
					<a href="https://github.com/adoravel">
						<GitHub />
						adoravel
					</a>
				</li>
				<li>
					<a href="https://tangled.org/kyu.re">
						<Tangled />
						kyu.re
					</a>
				</li>
				<li>
					<button onclick="let t=this.lastChild,n=t.nodeValue;if(!this.dataset.t){navigator.clipboard.writeText(n.trim());this.dataset.t=n;t.nodeValue=' copied!';setTimeout(()=>{t.nodeValue=this.dataset.t;delete this.dataset.t},2000)}">
						<Fluxer />
						queen#0001
					</button>
				</li>
				<li>
					<button
						data-mail="bWFpbHRvOmtAa3l1LnJl"
						onclick="window.open(atob(this.dataset.mail),'_blank','noopener')"
					>
						<Mail /> Email address
					</button>
				</li>
			</ul>
		</Styled.footer>
	);
}
