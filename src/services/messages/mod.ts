// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { appendPending } from "./store.ts";
import { notifyPendingPrint } from "./webhook.ts";
import { storeAttachment } from "./attachments.ts";
import { ServiceError } from "~/services/core/errors.ts";
import type { Author, MessageInput, Print, SubmitResult } from "./types.ts";

export const MESSAGE_LIMIT = 1_000;

function clean(value: unknown): { value?: string; tooLong?: boolean } {
	if (typeof value !== "string") return {};
	const trimmed = value.replace(/\r\n/g, "\n").trim();
	if (trimmed.length > MESSAGE_LIMIT) return { tooLong: true };
	return { value: trimmed || undefined };
}

async function hash(client: string): Promise<string> {
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(client));
	return Array.from(
		new Uint8Array(digest).slice(0, 8),
		(b) => b.toString(16).padStart(2, "0"),
	)
		.join("");
}

function computeReceiptNumber(id: string): string {
	let hash = 0;
	for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
	return String(1000 + (hash % 9000));
}

export async function submitMessage(
	input: MessageInput,
	author: Author | null,
	client: string,
): Promise<SubmitResult> {
	if (!author) return { ok: false, reason: "unauthenticated" };

	const body = clean(input.body);
	if (body.tooLong) return { ok: false, reason: "too_long" };
	if (!body.value && !input.image) return { ok: false, reason: "invalid" };

	const honeypot = typeof input.website === "string" && input.website.length > 0;

	let image: string | undefined;
	if (input.image && !honeypot) {
		try {
			image = await storeAttachment(input.image, "messages");
		} catch (error) {
			if (error instanceof ServiceError) return { ok: false, reason: "bad_image" };
			throw error;
		}
	}

	const id = crypto.randomUUID();
	const print: Print = {
		id,
		number: computeReceiptNumber(id),
		body: body.value ?? "",
		printedAt: new Date().toISOString(),
		author,
		image,
	};

	if (!honeypot) {
		await appendPending({ ...print, author, client: await hash(client) });
		await notifyPendingPrint(print);
	}

	return {
		ok: true,
		receipt: {
			id,
			number: print.number,
			printedAt: print.printedAt,
			characters: print.body.length,
			image,
		},
	};
}

export { getRecentPrints as recentPrints, WALL_LIMIT } from "./wall.ts";
export { janitor, sweepUnapproved } from "./janitor.ts";
export type {
	Author,
	AuthorProvider,
	MessageInput,
	Print,
	Receipt,
	SubmitResult,
} from "./types.ts";
