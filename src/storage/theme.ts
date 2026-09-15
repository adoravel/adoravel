// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

export type ThemePref = "dark" | "light" | "system";
export type ResolvedTheme = Exclude<ThemePref, "system">;

export const THEME_STORAGE_KEY = "suicide.diy:theme";
export const THEME_ORDER = [
	"system",
	"dark",
	"light",
] as const satisfies readonly ThemePref[];
export const THEME_CHANGED_EVENT = "theme-changed";
export const THEME_TRANSITION_ATTRIBUTE = "data-theme-transition";
export const THEME_TRANSITION_MS = 400;

export interface ThemeChangedDetail {
	pref: ThemePref;
	resolved: ResolvedTheme;
}

export const THEME_LABELS: Record<ThemePref, string> = {
	system: "System",
	dark: "Dark",
	light: "Light",
};

export function isThemePref(value: unknown): value is ThemePref {
	return typeof value === "string" && (THEME_ORDER as readonly string[]).includes(value);
}

export function resolveTheme(pref: ThemePref): ResolvedTheme {
	if (pref !== "system") return pref;
	return globalThis.matchMedia?.("(prefers-color-scheme: light)").matches
		? "light"
		: "dark";
}

export function nextTheme(current: ThemePref): ThemePref {
	return THEME_ORDER[(THEME_ORDER.indexOf(current) + 1) % THEME_ORDER.length];
}

let transitionTimer: ReturnType<typeof setTimeout> | undefined;

function withThemeTransition(root: HTMLElement, apply: () => void): void {
	root.setAttribute(THEME_TRANSITION_ATTRIBUTE, "");
	apply();

	clearTimeout(transitionTimer);
	transitionTimer = setTimeout(
		() => root.removeAttribute(THEME_TRANSITION_ATTRIBUTE),
		THEME_TRANSITION_MS,
	);
}

export function applyTheme(pref: ThemePref): void {
	if (typeof document === "undefined") return;

	const root = document.documentElement;
	const resolved = resolveTheme(pref);

	withThemeTransition(root, () => root.setAttribute("data-theme", resolved));

	globalThis.dispatchEvent(
		new CustomEvent<ThemeChangedDetail>(THEME_CHANGED_EVENT, {
			detail: { pref, resolved },
		}),
	);
}

export function getStoredTheme(): ThemePref {
	if (typeof localStorage === "undefined") return "system";
	const stored = localStorage.getItem(THEME_STORAGE_KEY);
	return isThemePref(stored) ? stored : "system";
}

export function cycleTheme(): ThemePref {
	const next = nextTheme(getStoredTheme());
	localStorage.setItem(THEME_STORAGE_KEY, next);
	applyTheme(next);
	return next;
}

export function onThemeChanged(
	listener: (detail: ThemeChangedDetail) => void,
): () => void {
	const handler = (event: Event) => {
		const detail = (event as CustomEvent<ThemeChangedDetail>).detail;
		if (detail) listener(detail);
	};

	globalThis.addEventListener(THEME_CHANGED_EVENT, handler);
	return () => globalThis.removeEventListener(THEME_CHANGED_EVENT, handler);
}

export const initTheme: string = `(function(){
	var pref = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
	if (${JSON.stringify(THEME_ORDER)}.indexOf(pref) === -1) pref = "system";
	var resolved = pref === "system"
		? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
		: pref;
	document.documentElement.setAttribute("data-theme", resolved);
})()`;
