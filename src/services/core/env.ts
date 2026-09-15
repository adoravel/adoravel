// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

export function readEnv(name: string, fallback: string): string {
	const value = Deno.env.get(name)?.trim();
	return value ? value : fallback;
}

export function readOptionalEnv(name: string): string | undefined {
	const value = Deno.env.get(name)?.trim();
	return value ? value : undefined;
}

export function readNumberEnv(name: string, fallback: number): number {
	const raw = Deno.env.get(name);
	if (raw === undefined) return fallback;

	const parsed = Number(raw);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const isProduction: boolean = readEnv("ENV", "development") === "production";
