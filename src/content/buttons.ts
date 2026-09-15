// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

export interface WebButton {
	href: string;
	src: string;
	alt: string;
	label: string;
}

export const WEB_BUTTON_WIDTH = 88;
export const WEB_BUTTON_HEIGHT = 31;

export const buttons: readonly WebButton[] = [
	{
		href: "https://katelyn.moe/",
		src: "https://katelyn.moe/8831.png",
		alt: "yuzu",
		label: "katelyn bleh",
	},
	{
		href: "https://worf.win",
		src: "https://worf.win/images/worfwin.gif",
		alt: "worf",
		label: "NAHHHH 🗿☠️",
	},
	{
		href: "https://www.juwuba.xyz",
		src: "https://www.juwuba.xyz/88x31.gif",
		alt: "Júlia",
		label: "the most goated sulista ever",
	},
	{
		href: "https://paige.moe",
		src: "https://paige.moe/88x31.gif",
		alt: "paige",
		label: "dms",
	},
	{
		href: "https://nin0.dev",
		src: "https://files.nin0.dev/88x31.png",
		alt: "nin0",
		label: "i don't feel like insulting him this time but go check his website i guess",
	},
	{
		href: "https://meow-d.github.io",
		src: "https://meow-d.github.io/assets/images/buttons/meow_d.webp",
		alt: "meow_d",
		label: "she's basically claire and meows. d. wow",
	},
	{
		href: "https://rushii.dev",
		src: "https://rushii.dev/88x31/rushii.webp",
		alt: "rushii's site",
		label: "🇰🇿🍣",
	},
];
