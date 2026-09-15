// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { dirname } from "@std/path";
import { log } from "@july/snarl/verbosity";
import { readEnv } from "~/services/core/env.ts";
import { describeError } from "~/services/core/errors.ts";
import type { Print, StoredMessage } from "./types.ts";

export const SERVICE = "messages";

const PENDING_FILE = readEnv("MESSAGES_FILE", "./data/messages.jsonl");
const PRINTS_FILE = readEnv("PRINTS_FILE", "./data/prints.jsonl");

const ensured = new Map<string, Promise<void>>();

function ensureFile(path: string): Promise<void> {
	let pending = ensured.get(path);
	if (!pending) {
		pending = (async () => {
			await Deno.mkdir(dirname(path), { recursive: true });
			try {
				await Deno.lstat(path);
			} catch {
				await Deno.writeTextFile(path, "");
			}
		})();
		ensured.set(path, pending);
	}
	return pending;
}

async function appendLine(path: string, value: unknown): Promise<void> {
	await ensureFile(path);
	await Deno.writeTextFile(path, `${JSON.stringify(value)}\n`, { append: true });
}

async function readLines<T>(
	path: string,
	guard: (value: unknown) => value is T,
): Promise<T[]> {
	await ensureFile(path);
	const text = await Deno.readTextFile(path);
	const items: T[] = [];
	for (const [index, line] of text.split("\n").entries()) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		try {
			const parsed = JSON.parse(trimmed);
			if (guard(parsed)) items.push(parsed);
			else log.warn(SERVICE, `${path}:${index + 1} skipped, unexpected shape`);
		} catch (error) {
			log.warn(SERVICE, `${path}:${index + 1} skipped: ${describeError(error)}`);
		}
	}
	return items;
}

export async function appendPending(message: StoredMessage): Promise<void> {
	await appendLine(PENDING_FILE, message);
	log.info(SERVICE, `received print ${message.id} from ${message.author.handle}`);
}

export function readApproved<T = Print>(
	guard: (value: unknown) => value is T,
): Promise<T[]> {
	return readLines(PRINTS_FILE, guard);
}
