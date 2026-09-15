// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { log } from "@july/snarl/verbosity";
import { describeError, isAbortError } from "./errors.ts";

export interface PollerOptions<T> {
	name: string;
	intervalSeconds: number;
	load: (signal: AbortSignal) => Promise<T>;
	maxBackoffSeconds?: number;
}

export interface PolledResource<T> {
	get(): T | undefined;
	readonly ready: Promise<void>;
	refresh(): Promise<void>;
	dispose(): void;
}

export function createPoller<T>(options: PollerOptions<T>): PolledResource<T> {
	const { name, load } = options;
	const intervalMs = options.intervalSeconds * 1000;
	const maxBackoffMs = (options.maxBackoffSeconds ?? options.intervalSeconds * 16) * 1000;

	const controller = new AbortController();
	let value: T | undefined;
	let failures = 0;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let inFlight: Promise<void> | undefined;
	let disposed = false;

	const { promise: ready, resolve: markReady } = Promise.withResolvers<void>();

	function nextDelay(elapsedMs: number): number {
		const base = failures === 0
			? intervalMs
			: Math.min(intervalMs * 2 ** (failures - 1), maxBackoffMs);
		return Math.max(0, base - elapsedMs);
	}

	function schedule(delay: number): void {
		if (disposed) return;
		const id = setTimeout(() => void tick(), delay);
		timer = id;
		Deno.unrefTimer(id);
	}

	async function attempt(): Promise<void> {
		try {
			value = await load(controller.signal);
			if (failures > 0) log.info(name, "recovered after failure, value refreshed");
			failures = 0;
		} catch (error) {
			if (isAbortError(error) || disposed) return;
			failures++;
			log.warn(
				name,
				`refresh failed (attempt ${failures}), ${
					value === undefined ? "no value yet" : "keeping stale value"
				}: ${describeError(error)}`,
			);
		}
	}

	function tick(): Promise<void> {
		if (inFlight) return inFlight;

		const startedAt = performance.now();
		inFlight = attempt().finally(() => {
			inFlight = undefined;
			markReady();
			schedule(nextDelay(performance.now() - startedAt));
		});

		return inFlight;
	}

	return tick(), {
		get: () => value,
		ready,
		refresh() {
			if (timer !== undefined) clearTimeout(timer);
			return tick();
		},
		dispose() {
			disposed = true;
			if (timer !== undefined) clearTimeout(timer);
			controller.abort();
		},
	};
}
