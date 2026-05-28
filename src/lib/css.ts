/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Component, jsx } from "@july/snarl/jsx-runtime";

import { contextualisedStyles, styleRegistry } from "~/middleware/scoped-css.ts";
import { retrieveContext } from "~/lib/context.ts";
import meowmix1 from "~/lib/meowmix1.ts";

export type ScopedStyling = {
	[K in keyof HTMLElementTagNameMap]: Component<{ children: any; [key: string]: unknown }>;
};

// brace characters inside string values should be replaced with unicode escapes
const CONDITIONAL_AT = /^@(media|supports|layer|container|document)\b/i;

const RAW_AT = /^@(keyframes|font-face|font-palette-values|counter-style|page|viewport|color-profile)\b/i;

function prefixSelectors(selector: string, scope: string): string {
	return selector
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean)
		.map((s) => {
			if (s.includes(":scope")) return s.replace(/:scope\b/g, scope);
			if (s.startsWith("&")) return s;
			return `${scope} ${s}`;
		})
		.join(",");
}

function transformRules(src: string, scope: string): string {
	let out = "";
	let i = 0;

	while (i < src.length) {
		while (i < src.length && src[i] <= " ") i++;
		if (i >= src.length) break;

		if (src[i] === "/" && src[i + 1] === "*") {
			const end = src.indexOf("*/", i + 2);
			i = end === -1 ? src.length : end + 2;
			continue;
		}

		if (src[i] === "}") {
			i++;
			break;
		}

		let sel = "";
		let hasBlock = false;

		scan: while (i < src.length) {
			if (src[i] === "/" && src[i + 1] === "*") {
				const end = src.indexOf("*/", i + 2);
				i = end === -1 ? src.length : end + 2;
				continue;
			}
			switch (src[i]) {
				case "{":
					hasBlock = true;
					i++;
					break scan;
				case "}":
					break scan;
				default:
					sel += src[i++];
			}
		}

		sel = sel.trim();
		if (!hasBlock || !sel) break;

		const blockStart = i;
		let depth = 1;
		while (i < src.length && depth > 0) {
			if (src[i] === "{") depth++;
			else if (src[i] === "}") depth--;
			i++;
		}

		const block = src.slice(blockStart, i - 1);

		if (RAW_AT.test(sel)) {
			out += `${sel}{${block}}`;
		} else if (CONDITIONAL_AT.test(sel)) {
			out += `${sel}{${transformRules(block, scope)}}`;
		} else {
			out += `${prefixSelectors(sel, scope)}{${block}}`;
		}
	}

	return out;
}

function generateScopedStyle(content: string, scopeId: string): string {
	return transformRules(content.trim(), `.${scopeId}`);
}

export function css(src: string): ScopedStyling {
	src = src.trim();
	if (!src) throw new Error("css: empty stylesheet");

	const hash = meowmix1(src);
	if (styleRegistry.has(hash)) {
		throw new Error(`css: hash collision ${hash}`);
	}

	const style = generateScopedStyle(src, hash);
	styleRegistry.set(hash, style);

	const createComponent = <T extends keyof HTMLElementTagNameMap>(tag: T) => {
		const Component = function (props: Parameters<Component>[0]) {
			const ctx = retrieveContext();
			if (!ctx) {
				throw new Error(
					`css: a component using hash "${hash}" was rendered outside of a request context. ` +
						`ensure contextMiddleware() is registered before any route handlers`,
				);
			}

			let mem = contextualisedStyles.get(ctx);
			if (!mem) {
				contextualisedStyles.set(ctx, mem = new Set());
			}
			mem.add(hash);

			return jsx(tag, {
				...props,
				class: props.class ? `${props.class} ${hash}` : hash,
			});
		};

		return Component;
	};

	const target = Object.create(null);
	return new Proxy(target, {
		get(target, property) {
			if (property in target) return target[property];

			const tag = String(property).toLowerCase();
			return target[property] = createComponent(tag as keyof HTMLElementTagNameMap);
		},
	});
}
