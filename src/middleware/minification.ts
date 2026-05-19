/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Context, Middleware } from "@july/snarl";
import { minify as mini } from "@minify-html/deno";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const MAX_ENTRIES = 128;
const MAX_BYTES = 8 * 1024 * 1024; // 8 MiB

class LRUCache {
	private map = new Map<string, string>();
	private bytes = 0;

	get(key: string): string | undefined {
		const value = this.map.get(key);
		if (value !== undefined) {
			this.map.delete(key);
			this.map.set(key, value);
		}
		return value;
	}

	set(key: string, value: string): void {
		if (this.map.has(key)) return; // already cached

		this.bytes += key.length + value.length;
		this.map.set(key, value);

		while (this.map.size > MAX_ENTRIES || this.bytes > MAX_BYTES) {
			const entry = this.map.entries().next().value;
			if (!entry) continue;

			const [oldestKey, oldestValue] = entry;

			this.bytes -= oldestKey.length + oldestValue.length;
			this.map.delete(oldestKey);
		}
	}
}

const cache = new LRUCache();

export default function minify(): Middleware {
	return async (_ctx: Context, next: () => Promise<Response>) => {
		const response = await next();

		const contentType = response.headers.get("Content-Type") ?? "";
		const isHtml = contentType.includes("text/html");
		const isCss = contentType.includes("text/css");
		if (!isHtml && !isCss) return response;

		const raw = await response.text();
		if (!raw) return response;

		const cached = cache.get(raw);
		if (cached) {
			return new Response(cached, {
				status: response.status,
				statusText: response.statusText,
				headers: response.headers,
			});
		}

		let minified: string;

		if (isCss) {
			minified = raw
				.replace(/\/\*[\s\S]*?\*\//g, "")
				.replace(/\s*([{}:;,])\s*/g, "$1")
				.replace(/^\s+|\s+$/gm, "")
				.replace(/\n+/g, "");
		} else {
			const data = mini(encoder.encode(raw), {
				keep_spaces_between_attributes: false,
				keep_comments: false,
				minify_css: true,
				minify_js: true,
			});
			minified = decoder.decode(data);
		}

		cache.set(raw, minified);

		return new Response(minified, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
		});
	};
}
