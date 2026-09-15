// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { join } from "@std/path";
import { log } from "@july/snarl/verbosity";
import { readNumberEnv } from "~/services/core/env.ts";
import { createPoller, type PolledResource } from "~/services/core/poller.ts";
import { hasShape, isOneOf, isString, optional } from "~/services/core/validate.ts";
import {
	authorKey,
	AUTHORS_DIR,
	AVATARS_DIR,
	isAuthorFile,
} from "~/services/authors/mod.ts";
import { sweepStaleImages } from "~/services/media/proxy.ts";
import { attachmentName, ATTACHMENTS_DIR } from "./attachments.ts";
import { readApproved, SERVICE } from "./store.ts";

const MAX_AGE_MS = readNumberEnv("ATTACHMENT_MAX_AGE_DAYS", 7) * 24 * 60 * 60 * 1000;

const isApprovedRef = hasShape({
	image: optional(isString),
	author: optional(hasShape({
		provider: isOneOf(["discord", "bluesky", "lastfm"] as const),
		id: optional(isString),
		handle: isString,
	})),
});

type ApprovedRef = {
	image?: string;
	author?: { provider: "discord" | "bluesky" | "lastfm"; id?: string; handle: string };
};

interface Referenced {
	attachments: Set<string>;
	authors: Set<string>;
}

async function referenced(): Promise<Referenced> {
	const prints = await readApproved((value): value is ApprovedRef =>
		isApprovedRef(value)
	);
	const attachments = new Set<string>();
	const authors = new Set<string>();
	for (const print of prints) {
		const name = print.image && attachmentName(print.image);
		if (name) attachments.add(name);
		if (print.author) authors.add(authorKey(print.author));
	}
	return { attachments, authors };
}

export interface SweepResult {
	removed: number;
	kept: number;
}

async function sweepDirectory(
	dir: string,
	keep: (name: string) => boolean,
	now: number,
	result: SweepResult,
): Promise<void> {
	let entries: Deno.DirEntry[];
	try {
		entries = await Array.fromAsync(Deno.readDir(dir));
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) return;
		throw error;
	}

	for (const entry of entries) {
		if (!entry.isFile) continue;
		const path = join(dir, entry.name);
		const info = await Deno.stat(path).catch(() => undefined);
		if (!info) continue;
		const bornAt = info.mtime ?? info.birthtime;
		const expired = bornAt !== null && now - bornAt.getTime() > MAX_AGE_MS;

		if (expired && !keep(entry.name)) {
			await Deno.remove(path).catch((error) => {
				if (!(error instanceof Deno.errors.NotFound)) throw error;
			});
			result.removed++;
		} else {
			result.kept++;
		}
	}
}

export async function sweepUnapproved(now = Date.now()): Promise<SweepResult> {
	const result: SweepResult = { removed: 0, kept: 0 };
	const refs = await referenced();
	const keepAuthor = (name: string) => {
		const file = isAuthorFile(name);
		return file !== undefined && refs.authors.has(file.key);
	};

	await sweepDirectory(
		ATTACHMENTS_DIR,
		(name) => refs.attachments.has(name),
		now,
		result,
	);
	await sweepDirectory(AVATARS_DIR, keepAuthor, now, result);
	await sweepDirectory(AUTHORS_DIR, keepAuthor, now, result);

	if (result.removed > 0) {
		log.info(
			SERVICE,
			`removed ${result.removed} unapproved file(s) older than the limit`,
		);
	}
	return result;
}

async function sweep(): Promise<SweepResult> {
	const now = Date.now();
	const [unapproved, images] = await Promise.all([
		sweepUnapproved(now),
		sweepStaleImages(now),
	]);
	return {
		removed: unapproved.removed + images.removed,
		kept: unapproved.kept + images.kept,
	};
}

export const janitor: PolledResource<SweepResult> = createPoller({
	name: `${SERVICE}/janitor`,
	intervalSeconds: readNumberEnv("ATTACHMENT_SWEEP_INTERVAL", 60 * 60),
	load: sweep,
});
