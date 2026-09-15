// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { isAbortError, ServiceError } from "./errors.ts";
import { assertShape, type Guard } from "./validate.ts";

const USER_AGENT = "suicide.diy/0.1.0";
const DEFAULT_TIMEOUT_MS = 8_000;

export interface JsonRequest<T> {
	service: string;
	url: string | URL;
	guard: Guard<T>;
	signal?: AbortSignal;
	timeoutMs?: number;
	headers?: HeadersInit;
}

export function combineSignals(timeoutMs: number, external?: AbortSignal): AbortSignal {
	const timeout = AbortSignal.timeout(timeoutMs);
	return external ? AbortSignal.any([external, timeout]) : timeout;
}

export function buildUrl(base: string, params: Record<string, string | number>): URL {
	const url = new URL(base);
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, String(value));
	}
	return url;
}

export async function fetchJson<T>(request: JsonRequest<T>): Promise<T> {
	const { service, url, guard, signal, timeoutMs = DEFAULT_TIMEOUT_MS, headers } =
		request;

	let response: Response;
	try {
		response = await fetch(url, {
			signal: combineSignals(timeoutMs, signal),
			headers: { "User-Agent": USER_AGENT, Accept: "application/json", ...headers },
		});
	} catch (error) {
		if (isAbortError(error) || signal?.aborted) {
			throw new ServiceError(service, "aborted", "request aborted", { cause: error });
		}
		if (error instanceof DOMException && error.name === "TimeoutError") {
			throw new ServiceError(
				service,
				"network",
				`request timed out after ${timeoutMs}ms`,
				{
					cause: error,
				},
			);
		}
		throw new ServiceError(service, "network", "request failed", { cause: error });
	}

	if (!response.ok) {
		await response.body?.cancel();
		throw new ServiceError(
			service,
			"http",
			`request failed with status ${response.status}`,
			{
				status: response.status,
			},
		);
	}

	let payload: unknown;
	try {
		payload = await response.json();
	} catch (error) {
		throw new ServiceError(service, "payload", "response was not valid json", {
			cause: error,
		});
	}

	return assertShape(service, payload, guard, "response");
}
