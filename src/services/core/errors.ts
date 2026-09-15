// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

export type ServiceErrorKind = "config" | "network" | "http" | "payload" | "aborted";

export class ServiceError extends Error {
	override readonly name = "ServiceError";

	constructor(
		readonly service: string,
		readonly kind: ServiceErrorKind,
		message: string,
		options?: { cause?: unknown; status?: number },
	) {
		super(`${service}: ${message}`, { cause: options?.cause });
		this.status = options?.status;
	}

	readonly status: number | undefined;
}

export function isAbortError(error: unknown): boolean {
	if (error instanceof ServiceError) return error.kind === "aborted";
	return error instanceof DOMException && error.name === "AbortError";
}

export function describeError(error: unknown): string {
	if (error instanceof Error) return error.message;
	return String(error);
}
