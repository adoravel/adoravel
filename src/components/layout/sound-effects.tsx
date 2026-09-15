// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

"use island";

import { onMount } from "@404/aether";
import { play } from "~/sound/mod.ts";

const INTERACTIVE = "a[href], button, [role='option'], summary";

const HOVER_COOLDOWN_MS = 60;
const TYPE_COOLDOWN_MS = 28;
const EDITABLE =
	"textarea, input:not([type='checkbox']):not([type='radio']), [contenteditable='true']";

function isTypingKey(event: KeyboardEvent): boolean {
	if (event.ctrlKey || event.metaKey || event.altKey) return false;
	return event.key.length === 1 || event.key === "Backspace" || event.key === "Enter";
}

function controlFrom(event: Event): Element | null {
	const target = event.target as Element | null;
	const control = target?.closest?.(INTERACTIVE) ?? null;
	return control && !control.hasAttribute("data-silent") ? control : null;
}

export default function SoundEffects() {
	onMount(() => {
		const finePointer = globalThis.matchMedia?.("(hover: hover) and (pointer: fine)")
			.matches;
		let lastHovered: Element | null = null;
		let lastHoverAt = 0;

		const onClick = (event: MouseEvent) => {
			if (controlFrom(event)) play("tick");
		};

		const onPointerOver = (event: PointerEvent) => {
			const control = controlFrom(event);
			if (!control || control === lastHovered) {
				if (!control) lastHovered = null;
				return;
			}
			lastHovered = control;
			const now = performance.now();
			if (now - lastHoverAt < HOVER_COOLDOWN_MS) return;
			lastHoverAt = now;
			play("hover");
		};

		let lastTypeAt = 0;
		const onKeydown = (event: KeyboardEvent) => {
			const target = event.target as Element | null;
			if (!target?.matches?.(EDITABLE) || !isTypingKey(event)) return;
			const now = performance.now();
			if (now - lastTypeAt < TYPE_COOLDOWN_MS) return;
			lastTypeAt = now;
			const detune = event.key === "Backspace"
				? 0.8
				: event.key === " "
				? 0.72
				: 0.92 + Math.random() * 0.16;
			play("type", detune);
		};

		document.addEventListener("click", onClick, true);
		document.addEventListener("keydown", onKeydown, true);
		if (finePointer) document.addEventListener("pointerover", onPointerOver, true);
		return () => {
			document.removeEventListener("click", onClick, true);
			document.removeEventListener("keydown", onKeydown, true);
			document.removeEventListener("pointerover", onPointerOver, true);
		};
	});

	return null;
}
