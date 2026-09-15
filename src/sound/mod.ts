// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { sharedSignal, type Signal } from "@404/aether";
import { getStoredSound, setStoredSound } from "~/storage/sound.ts";

export type SoundName =
	| "type"
	| "hover"
	| "tick"
	| "open"
	| "close"
	| "switch"
	| "print"
	| "success";

interface Note {
	at: number;
	from: number;
	to?: number;
	duration: number;
	gain?: number;
	type?: OscillatorType;
}

const SOUNDS: Record<SoundName, Note[]> = {
	type: [
		{ at: 0, from: 3800, to: 3000, duration: 0.007, gain: 0.006 },
		{ at: 0.001, from: 1500, to: 1050, duration: 0.016, gain: 0.006, type: "triangle" },
	],
	hover: [{ at: 0, from: 2600, to: 2100, duration: 0.02, gain: 0.012 }],
	tick: [{ at: 0, from: 1800, to: 1100, duration: 0.035, gain: 0.035 }],
	open: [{ at: 0, from: 320, to: 640, duration: 0.09, gain: 0.045, type: "triangle" }],
	close: [{ at: 0, from: 560, to: 300, duration: 0.09, gain: 0.04, type: "triangle" }],
	switch: [
		{ at: 0, from: 880, duration: 0.05, gain: 0.03 },
		{ at: 0.07, from: 1320, duration: 0.06, gain: 0.03 },
	],
	print: Array.from({ length: 9 }, (_, i) => ({
		at: i * 0.045,
		from: 150 + (i % 3) * 40,
		duration: 0.03,
		gain: 0.03,
		type: "square" as const,
	})),
	success: [
		{ at: 0, from: 660, duration: 0.12, gain: 0.04, type: "triangle" },
		{ at: 0.13, from: 990, duration: 0.18, gain: 0.04, type: "triangle" },
	],
};

const enabled: Signal<boolean> = sharedSignal("sound:enabled", false);
let hydrated = false;
let context: AudioContext | undefined;

export function soundEnabled(): Signal<boolean> {
	if (!hydrated && typeof localStorage !== "undefined") {
		hydrated = true;
		enabled(getStoredSound());
	}
	return enabled;
}

export function setSoundEnabled(next: boolean): void {
	soundEnabled()(next);
	setStoredSound(next);
	if (next) play("switch");
}

export function toggleSound(): boolean {
	const next = !soundEnabled().peek();
	setSoundEnabled(next);
	return next;
}

function audio(): AudioContext | undefined {
	if (typeof AudioContext === "undefined") return undefined;
	context ??= new AudioContext();
	if (context.state === "suspended") void context.resume();
	return context;
}

function schedule(ctx: AudioContext, note: Note): void {
	const start = ctx.currentTime + note.at;
	const end = start + note.duration;

	const oscillator = ctx.createOscillator();
	oscillator.type = note.type ?? "sine";
	oscillator.frequency.setValueAtTime(note.from, start);
	if (note.to) oscillator.frequency.exponentialRampToValueAtTime(note.to, end);

	const envelope = ctx.createGain();
	envelope.gain.setValueAtTime(0.0001, start);
	envelope.gain.exponentialRampToValueAtTime(note.gain ?? 0.04, start + 0.004);
	envelope.gain.exponentialRampToValueAtTime(0.0001, end);

	oscillator.connect(envelope).connect(ctx.destination);
	oscillator.start(start);
	oscillator.stop(end + 0.01);
}

export function play(name: SoundName, detune = 0): void {
	if (!soundEnabled().peek()) return;
	if (globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

	const ctx = audio();
	if (!ctx) return;
	for (const note of SOUNDS[name]) {
		schedule(
			ctx,
			detune
				? { ...note, from: note.from * detune, to: note.to && note.to * detune }
				: note,
		);
	}
}
