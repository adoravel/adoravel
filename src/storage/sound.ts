// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

export const SOUND_STORAGE_KEY = "suicide.diy:sound";
export const SOUND_CHANGED_EVENT = "sound-changed";

export function getStoredSound(): boolean {
	if (typeof localStorage === "undefined") return false;
	return localStorage.getItem(SOUND_STORAGE_KEY) === "on";
}

export function setStoredSound(enabled: boolean): void {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(SOUND_STORAGE_KEY, enabled ? "on" : "off");
	globalThis.dispatchEvent(
		new CustomEvent<boolean>(SOUND_CHANGED_EVENT, { detail: enabled }),
	);
}

export function onSoundChanged(listener: (enabled: boolean) => void): () => void {
	const handler = (event: Event) => listener((event as CustomEvent<boolean>).detail);
	globalThis.addEventListener(SOUND_CHANGED_EVENT, handler);
	return () => globalThis.removeEventListener(SOUND_CHANGED_EVENT, handler);
}
