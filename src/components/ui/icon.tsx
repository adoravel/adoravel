// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { JSX } from "@404/aether";

export interface IconProps {
	class?: string;
	size?: number | string;
	stroke?: string;
	strokeWidth?: number;
	fill?: string;
	label?: string;
}

export function Icon({
	children,
	class: className,
	size = 20,
	strokeWidth = 2,
	stroke = "currentColor",
	fill = "none",
	label,
}: IconProps & { children: JSX.Node }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill={fill}
			stroke={stroke}
			stroke-width={strokeWidth}
			stroke-linecap="round"
			stroke-linejoin="round"
			class={className}
			role={label ? "img" : undefined}
			aria-label={label}
			aria-hidden={label ? undefined : "true"}
			focusable="false"
		>
			{children}
		</svg>
	);
}

export function ArrowUpRight(props: IconProps) {
	return (
		<Icon {...props}>
			<path d="M7 17L17 7" />
			<path d="M7 7h10v10" />
		</Icon>
	);
}

export function ArrowRight(props: IconProps) {
	return (
		<Icon {...props}>
			<path d="M5 12h14" />
			<path d="m12 5 7 7-7 7" />
		</Icon>
	);
}

export function Mail(props: IconProps) {
	return (
		<Icon {...props}>
			<rect width="20" height="16" x="2" y="4" rx="2" />
			<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
		</Icon>
	);
}

export function Coffee(props: IconProps) {
	return (
		<Icon {...props}>
			<path d="M10 2v2" />
			<path d="M14 2v2" />
			<path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
			<path d="M6 2v2" />
		</Icon>
	);
}

export function Download(props: IconProps) {
	return (
		<Icon {...props}>
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<path d="m7 10 5 5 5-5" />
			<path d="M12 15V3" />
		</Icon>
	);
}

export function ArrowUp(props: IconProps) {
	return (
		<Icon {...props}>
			<path d="M12 19V5" />
			<path d="m5 12 7-7 7 7" />
		</Icon>
	);
}

export function ArrowLeft(props: IconProps) {
	return (
		<Icon {...props}>
			<path d="M19 12H5" />
			<path d="m12 19-7-7 7-7" />
		</Icon>
	);
}

export function ChevronLeft(props: IconProps) {
	return (
		<Icon {...props}>
			<path d="m15 18-6-6 6-6" />
		</Icon>
	);
}

export function ChevronRight(props: IconProps) {
	return (
		<Icon {...props}>
			<path d="m9 18 6-6-6-6" />
		</Icon>
	);
}

export function Play(props: IconProps) {
	return (
		<Icon fill="currentColor" strokeWidth={0} {...props}>
			<path d="M6 4.5v15a1 1 0 0 0 1.52.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 6 4.5Z" />
		</Icon>
	);
}

export function Heart(props: IconProps) {
	return (
		<Icon fill="currentColor" strokeWidth={0} {...props}>
			<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
		</Icon>
	);
}

export function Star(props: IconProps) {
	return (
		<Icon fill="currentColor" strokeWidth={0} {...props}>
			<path d="M12 2.6c.3 0 .6.2.7.5l2.4 5 5.4.7c.7.1 1 1 .5 1.5l-4 3.8 1 5.4c.1.7-.6 1.2-1.2.9L12 17.8l-4.8 2.6c-.6.3-1.3-.2-1.2-.9l1-5.4-4-3.8c-.5-.5-.2-1.4.5-1.5l5.4-.7 2.4-5c.1-.3.4-.5.7-.5Z" />
		</Icon>
	);
}

export function Send(props: IconProps) {
	return (
		<Icon {...props}>
			<title>Send</title>
			<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
			<path d="m21.854 2.147-10.94 10.939" />
		</Icon>
	);
}

export function ImageIcon(props: IconProps) {
	return (
		<Icon {...props}>
			<title>Attach image</title>
			<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
			<circle cx="9" cy="9" r="2" />
			<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
		</Icon>
	);
}

export function Close(props: IconProps) {
	return (
		<Icon {...props}>
			<title>Close</title>
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</Icon>
	);
}

export function Bookmark(props: IconProps) {
	return (
		<Icon fill="currentColor" strokeWidth={0} {...props}>
			<path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5v17a.75.75 0 0 1-1.2.6L12 17.6l-4.8 3.5A.75.75 0 0 1 6 20.5v-17Z" />
		</Icon>
	);
}

export function Command(props: IconProps) {
	return (
		<Icon {...props}>
			<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
		</Icon>
	);
}

export function DiscordIcon(props: IconProps) {
	return (
		<Icon strokeWidth={0} fill="currentColor" {...props}>
			<title>Discord</title>
			<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
		</Icon>
	);
}

export function BlueskyIcon(props: IconProps) {
	return (
		<Icon strokeWidth={0} fill="currentColor" {...props}>
			<title>Bluesky</title>
			<path d="M5.202 2.857C7.954 4.922 10.913 9.11 12 11.358c1.087-2.247 4.046-6.436 6.798-8.501C20.783 1.366 24 .213 24 3.883c0 .732-.42 6.156-.667 7.037-.856 3.061-3.978 3.842-6.755 3.37 4.854.826 6.089 3.562 3.422 6.299-5.065 5.196-7.28-1.304-7.847-2.97-.104-.305-.152-.448-.153-.327 0-.121-.05.022-.153.327-.568 1.666-2.782 8.166-7.847 2.97-2.667-2.737-1.432-5.473 3.422-6.3-2.777.473-5.899-.308-6.755-3.369C.42 10.04 0 4.615 0 3.883c0-3.67 3.217-2.517 5.202-1.026" />
		</Icon>
	);
}

export function GitHubIcon(props: IconProps) {
	return (
		<Icon strokeWidth={0} fill="currentColor" {...props}>
			<title>GitHub</title>
			<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
		</Icon>
	);
}

export function LastFmIcon(props: IconProps) {
	return (
		<Icon strokeWidth={0} fill="currentColor" {...props}>
			<title>Last.fm</title>
			<path d="M10.584 17.21l-.88-2.392s-1.43 1.594-3.573 1.594c-1.897 0-3.244-1.649-3.244-4.288 0-3.382 1.704-4.591 3.381-4.591 2.42 0 3.189 1.567 3.849 3.574l.88 2.749c.88 2.666 2.529 4.81 7.285 4.81 3.409 0 5.718-1.044 5.718-3.793 0-2.227-1.265-3.381-3.63-3.931l-1.758-.385c-1.21-.275-1.567-.77-1.567-1.595 0-.934.742-1.484 1.952-1.484 1.32 0 2.034.495 2.144 1.677l2.749-.33c-.22-2.474-1.924-3.492-4.729-3.492-2.474 0-4.893.935-4.893 3.932 0 1.87.907 3.051 3.189 3.601l1.87.44c1.402.33 1.869.907 1.869 1.704 0 1.017-.99 1.43-2.86 1.43-2.776 0-3.93-1.457-4.59-3.464l-.907-2.75c-1.155-3.573-2.997-4.893-6.653-4.893C2.144 5.333 0 7.89 0 12.233c0 4.18 2.144 6.434 5.993 6.434 3.106 0 4.591-1.457 4.591-1.457z" />
		</Icon>
	);
}

export function PixivIcon(props: IconProps) {
	return (
		<Icon strokeWidth={0} fill="currentColor" {...props}>
			<title>pixiv</title>
			<path d="M4.94 0A4.953 4.953 0 0 0 0 4.94v14.12A4.953 4.953 0 0 0 4.94 24h14.12A4.953 4.953 0 0 0 24 19.06c-.014 1.355 0-14.12 0-14.12A4.953 4.953 0 0 0 19.06 0Zm1.783 5.465h.904a.37.37 0 0 1 .31.17l.752 1.17a6.172 6.172 0 0 1 10.01 4.834 6.172 6.172 0 0 1-9.394 5.265v2.016a.37.37 0 0 1-.37.367H6.724a.37.37 0 0 1-.37-.367V5.834a.37.37 0 0 1 .37-.37m5.804 2.951a3.222 3.222 0 1 0-.002 6.443 3.222 3.222 0 0 0 .002-6.443" />
		</Icon>
	);
}
