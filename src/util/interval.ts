/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export function withInterval<T>(
	callback: () => Promise<T>,
	seconds: number,
): () => T | undefined {
	let value: T | undefined;

	async function tick(isInitial: boolean): Promise<void> {
		try {
			value = await callback();
		} catch (e) {
			console.warn(`[interval] ${isInitial ? "initial call" : "tick"} failed, keeping stale value:`, e);
		}
		setTimeout(() => tick(false), seconds * 1000);
	}

	tick(true);
	return () => value;
}
