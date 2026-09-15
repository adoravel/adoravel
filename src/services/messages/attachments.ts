// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { join } from "@std/path";
import { decodeBase64 } from "@std/encoding/base64";
import { readEnv } from "~/services/core/env.ts";
import { ServiceError } from "~/services/core/errors.ts";
import { toWebp } from "~/services/media/image.ts";

export const ATTACHMENT_LIMIT_BYTES = 2 * 1024 * 1024;
export const ATTACHMENT_MAX_SIZE = 1024;

export const ATTACHMENTS_DIR = readEnv("ATTACHMENTS_DIR", "./data/attachments");

const DATA_URL_HEADER_RE = /^data:(image\/(?:png|jpeg|webp));base64,/;
let isDirCreated = false;

const MIME_TO_EXT: Record<string, string> = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/webp": "webp",
};

const EXT_TO_MIME: Record<string, string> = {
	"png": "image/png",
	"jpg": "image/jpeg",
	"webp": "image/webp",
};

const ID_RE = /^[a-f0-9-]{36}\.(?:png|jpg|webp)$/;

export function getAttachmentPathname(file: string): string {
	return `/attachments/${file}`;
}

export function attachmentName(route: string): string | undefined {
	const match = /^\/attachments\/([a-f0-9-]{36}\.(?:png|jpg|webp))$/.exec(route);
	return match?.[1];
}

export async function storeAttachment(dataUrl: string, service: string): Promise<string> {
	if (dataUrl.length > ATTACHMENT_LIMIT_BYTES * 1.4) {
		throw new ServiceError(service, "payload", "attachment too large");
	}

	const headerMatch = DATA_URL_HEADER_RE.exec(dataUrl);
	if (!headerMatch) {
		throw new ServiceError(service, "payload", "attachment must be a png, jpeg or webp");
	}

	const [, type] = headerMatch;
	const base64Str = dataUrl.slice(headerMatch[0].length);

	let bytes: Uint8Array;
	try {
		bytes = decodeBase64(base64Str);
	} catch {
		throw new ServiceError(service, "payload", "invalid base64 encoding");
	}

	if (bytes.length > ATTACHMENT_LIMIT_BYTES) {
		throw new ServiceError(service, "payload", "attachment too large");
	}

	const webp = await toWebp(bytes, ATTACHMENT_MAX_SIZE, "inside");
	const id = crypto.randomUUID();

	const file = `${id}.${webp ? "webp" : MIME_TO_EXT[type]}`;

	if (!isDirCreated) {
		await Deno.mkdir(ATTACHMENTS_DIR, { recursive: true });
		isDirCreated = true;
	}

	await Deno.writeFile(join(ATTACHMENTS_DIR, file), webp ?? bytes);
	return getAttachmentPathname(file);
}

export async function getAttachmentFile(
	name: string,
): Promise<{ path: string; type: string } | undefined> {
	if (!ID_RE.test(name)) return undefined;

	const path = join(ATTACHMENTS_DIR, name);

	try {
		const stat = await Deno.stat(path);
		if (!stat.isFile) return undefined;
	} catch (err) {
		if (err instanceof Deno.errors.NotFound) return undefined;
		throw err;
	}

	const extension = name.slice(name.lastIndexOf(".") + 1);
	const type = EXT_TO_MIME[extension];

	return { path, type };
}
