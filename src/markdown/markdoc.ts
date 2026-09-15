// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import Markdoc, { type Config, type RenderableTreeNode } from "@markdoc/markdoc";
import { JSX, jsx } from "@404/aether";
import { parseMarkdown } from "./extensions.ts";

export type MarkdocComponentMap = Record<string, (props: never) => unknown>;

const { Tag } = Markdoc;

export function renderMarkdoc(
	node: RenderableTreeNode | RenderableTreeNode[],
	components: MarkdocComponentMap = {},
): JSX.Node {
	if (Array.isArray(node)) {
		return node.map((child) => renderMarkdoc(child, components));
	}

	if (node === null || node === undefined || typeof node === "boolean") return null;
	if (typeof node === "string" || typeof node === "number") return node;
	if (!(node instanceof Tag)) return null;

	const { name, attributes, children } = node;
	const $ = children.length ? renderMarkdoc(children, components) : undefined;

	if (typeof name === "string" && name[0] === name[0].toUpperCase() && components[name]) {
		return jsx(components[name] as JSX.FC, { ...attributes, children: $ });
	}

	return jsx(name as string, { ...attributes, children: $ });
}

export interface RenderMarkdownOptions {
	components?: MarkdocComponentMap;
	config?: Config;
}

export function renderMarkdown(
	source: string,
	options: RenderMarkdownOptions = {},
): unknown {
	const ast = parseMarkdown(source);
	const content = Markdoc.transform(ast, options.config);
	return renderMarkdoc(content, options.components ?? {});
}

export { Markdoc };
