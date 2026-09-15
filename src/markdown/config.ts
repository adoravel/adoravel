// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Config } from "@markdoc/markdoc";
import { fromFileUrl } from "@std/path";
import { createMarkdownCollection, type MarkdownCollection } from "./collection.ts";
import { markdocComponents } from "./components.tsx";
import { htmlTags } from "./extensions.ts";

export const markdocConfig: Omit<Config, "variables"> = {
	tags: {
		...htmlTags,
		footnoteRef: {
			render: "FootnoteRef",
			selfClosing: true,
			attributes: {
				id: { type: String, required: true },
				n: { type: Number, required: true },
			},
		},
		footnote: {
			render: "Footnote",
			attributes: {
				id: { type: String, required: true },
				n: { type: Number, required: true },
			},
		},
		footnotes: {
			render: "Footnotes",
		},
		callout: {
			render: "Callout",
			children: ["paragraph", "tag", "list"],
			attributes: {
				type: {
					type: String,
					default: "note",
					matches: ["note", "warning"],
				},
			},
		},
	},
};

export const thoughts: MarkdownCollection = createMarkdownCollection({
	dir: fromFileUrl(new URL("../../content/thoughts", import.meta.url)),
	components: markdocComponents,
	config: markdocConfig,
});
