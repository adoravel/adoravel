/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css } from "@404/imouto";
import { ease, fontFamily, fontSize, spacing, theme } from "~/layout.tsx";

const repeat = (input: string, count: number, delim: string = ",") => Array(count).fill(input).join(delim);

type FlagPalette = Record<string, readonly string[]>;

const flags = {
	brazil: ["#4c664d", "#d9bf77", "#566b99"],
	transgender: ["#98b9db", "#e0aab7", "#e7e0e7", "#e0aab7", "#98b9db"],
	lesbian: ["#c46a4f", "#e09f7a", "#e7e0e7", "#cca1be", "#965275"],
} as const satisfies FlagPalette;

const palette = Object.values(flags)
	.flatMap((colors) => colors.flatMap((color) => [color, color]))
	.join(", ");

const Styled = css`
	:scope {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-top: ${spacing[6]};
		margin-bottom: ${spacing.section};
		user-select: none;
	}

	.typography-stack {
		position: relative;
		display: flex;
		flex-direction: column;
		font-family: ${fontFamily.heading};
		line-height: 0.85;
	}

	.first-name {
		display: block;
		width: fit-content;
		color: ${theme.text};
		font-weight: 800;
		font-size: calc(${fontSize["2xl"]} * 1.75);
		letter-spacing: ${spacing.letter.tight};
	}

	.connecting-arrow {
		position: absolute;
		top: 3rem;
		left: -1rem;
		width: 6.48rem;
		height: 4.05rem;
		color: ${theme.text};
		filter: url(#ds-chalk);
		pointer-events: none;
		animation: boil 2s steps(1) infinite;
		transition: color ${ease.fast}, opacity ${ease.fast};
	}

	.connecting-arrow g {
		opacity: 0;
	}

	.connecting-arrow[data-frame="1"] .f1 {
		opacity: 1;
	}
	.connecting-arrow[data-frame="2"] .f2 {
		opacity: 1;
	}
	.connecting-arrow[data-frame="3"] .f3 {
		opacity: 1;
	}
	.connecting-arrow[data-frame="4"] .f4 {
		opacity: 1;
	}
	.connecting-arrow[data-frame="5"] .f5 {
		opacity: 1;
	}

	.second-name {
		display: block;
		width: fit-content;
		margin-left: ${spacing[18]};
		font-weight: 800;
		font-size: calc(${fontSize["2xl"]} * 1.5);
		letter-spacing: ${spacing.letter.tight};

		background: repeating-linear-gradient(-90deg, ${repeat(theme.text, 32)}, ${palette}, ${repeat(theme.text, 32)});
		background-size: 1000% 100%;
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: identity-animation 90s linear infinite;
	}

	@keyframes boil {
		0% {
			transform: translate(0px, 0px) scale(1) rotate(0deg);
		}
		20% {
			transform: translate(1.5px, -1px) scale(0.98) rotate(1.5deg);
		}
		40% {
			transform: translate(-1px, 1.5px) scale(1.02) rotate(-1deg);
		}
		60% {
			transform: translate(1px, 1px) scale(0.97) rotate(2deg);
		}
		80% {
			transform: translate(-1.5px, -0.5px) scale(1.03) rotate(-2deg);
		}
		100% {
			transform: translate(0px, 0px) scale(1) rotate(0deg);
		}
	}

	@keyframes identity-animation {
		0% {
			background-position: 0% 50%;
		}
		100% {
			background-position: -900% 50%;
		}
	}
`;

function Pointy() {
	return (
		<svg
			class="connecting-arrow"
			data-frame="1"
			viewBox="0 0 100 60"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<filter id="ds-chalk" x="-20%" y="-20%" width="140%" height="140%">
					<feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="4" result="noise" />
					<feDisplacementMap
						in="SourceGraphic"
						in2="noise"
						scale="1.5"
						xChannelSelector="R"
						yChannelSelector="G"
						result="displaced"
					/>
					<feComponentTransfer in="displaced">
						<feFuncA type="discrete" tableValues="0 0 0 0 1 1 1 1" />
					</feComponentTransfer>
				</filter>
			</defs>
			<g class="f1">
				<path d="M 25,8 C 30,18 36,30 52,32 C 62,33 58,16 48,20 C 40,24 45,48 80,48" />
				<path d="M 72,40 L 82,48 L 71,55" />
			</g>
			<g class="f2">
				<path d="M 26,9 C 31,19 35,29 51,31 C 61,32 59,17 49,21 C 41,25 46,47 79,47" />
				<path d="M 71,39 L 81,47 L 70,54" />
			</g>
			<g class="f3">
				<path d="M 24,7 C 29,17 37,31 53,33 C 63,34 57,15 47,19 C 39,23 44,49 81,49" />
				<path d="M 73,41 L 83,49 L 72,56" />
			</g>
			<g class="f4">
				<path d="M 25,8 C 30,18 36,30 52,32 C 62,33 58,16 48,20 C 40,24 45,48 80,48" />
				<path d="M 72,40 L 82,48 L 71,55" />
			</g>
			<g class="f5">
				<path d="M 27,8 C 32,18 35,30 51,33 C 61,34 58,16 49,20 C 41,24 46,48 79,48" />
				<path d="M 71,40 L 81,48 L 70,55" />
			</g>
		</svg>
	);
}

const useBoilDriver = `
	(() => {
		const el = document.currentScript.parentElement.querySelector(".connecting-arrow");
		if (!el) return;

		el.addEventListener("animationiteration", (e) => {
			if (e.animationName !== "boil") return;
			const frame = parseInt(el.getAttribute("data-frame") || "1", 10);
			el.setAttribute("data-frame", (frame % 5) + 1);
		});
	})();
`;

export default function Heading() {
	return (
		<Styled.header>
			<h1 class="typography-stack">
				<span class="first-name">Júlia</span>
				<Pointy />
				<script dangerouslySetInnerHTML={{ __html: useBoilDriver }} />
				<span class="second-name">Lívia</span>
			</h1>
		</Styled.header>
	);
}
