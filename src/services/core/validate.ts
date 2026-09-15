// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ServiceError } from "./errors.ts";

export type Guard<T> = (value: unknown) => value is T;

export type JsonRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is JsonRecord {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isString(value: unknown): value is string {
	return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

export function isArrayOf<T>(guard: Guard<T>): Guard<T[]> {
	return (value): value is T[] => Array.isArray(value) && value.every(guard);
}

export function isOneOf<const T extends readonly unknown[]>(
	options: T,
): Guard<T[number]> {
	return (value): value is T[number] => options.includes(value);
}

export function optional<T>(guard: Guard<T>): Guard<T | undefined> {
	return (value): value is T | undefined => value === undefined || guard(value);
}

export function hasShape<T extends Record<string, Guard<unknown>>>(
	shape: T,
): Guard<{ [K in keyof T]: T[K] extends Guard<infer U> ? U : never }> {
	return (
		value,
	): value is { [K in keyof T]: T[K] extends Guard<infer U> ? U : never } => {
		if (!isRecord(value)) return false;
		for (const key in shape) {
			if (!shape[key](value[key])) return false;
		}
		return true;
	};
}

export function assertShape<T>(
	service: string,
	value: unknown,
	guard: Guard<T>,
	what: string,
): T {
	if (guard(value)) return value;
	throw new ServiceError(service, "payload", `unexpected ${what} shape`);
}

export function asList<T>(value: T | T[] | undefined | null): T[] {
	if (value === undefined || value === null) return [];
	return Array.isArray(value) ? value : [value];
}

export function nullable<T>(guard: Guard<T>): Guard<T | null> {
	return (value): value is T | null => value === null || guard(value);
}
