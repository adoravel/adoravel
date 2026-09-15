// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import Markdoc, { type Node, type Schema } from "@markdoc/markdoc";

type Token = ReturnType<InstanceType<typeof Markdoc.Tokenizer>["tokenize"]>[number];

interface Attribute {
	type: "attribute";
	name: string;
	value: unknown;
}

interface Ruler<S> {
	before(name: string, ruleName: string, fn: S, options?: { alt: string[] }): void;
	push(ruleName: string, fn: S, options?: { alt: string[] }): void;
	getRules(chain: string): S[];
}

interface Parser<S> {
	ruler: Ruler<S>;
	parse(src: string, md: MarkdownIt, env: Env, tokens: Token[]): void;
}

interface Env {
	footnotes?: Map<string, number>;
}

interface MarkdownIt {
	inline: Parser<InlineRule>;
	block: Parser<BlockRule>;
	core: Parser<CoreRule>;
	use(plugin: (md: MarkdownIt) => void): MarkdownIt;
}

interface InlineState {
	src: string;
	pos: number;
	posMax: number;
	env: Env;
	md: MarkdownIt;
	push(type: string, tag: string, nesting: -1 | 0 | 1): Token;
}

interface BlockState {
	src: string;
	line: number;
	lineMax: number;
	bMarks: number[];
	eMarks: number[];
	tShift: number[];
	sCount: number[];
	env: Env;
	md: MarkdownIt;
	tokens: Token[];
	isEmpty(line: number): boolean;
	push(type: string, tag: string, nesting: -1 | 0 | 1): Token;
}

interface CoreState {
	tokens: Token[];
	env: Env;
}

type InlineRule = (state: InlineState, silent: boolean) => boolean;
type BlockRule = (
	state: BlockState,
	startLine: number,
	endLine: number,
	silent: boolean,
) => boolean;
type CoreRule = (state: CoreState) => void;

export const HTML_ELEMENTS: readonly string[] = [
	"a",
	"abbr",
	"aside",
	"b",
	"bdi",
	"bdo",
	"blockquote",
	"br",
	"cite",
	"code",
	"del",
	"details",
	"dfn",
	"div",
	"em",
	"figcaption",
	"figure",
	"i",
	"ins",
	"kbd",
	"mark",
	"p",
	"q",
	"rp",
	"rt",
	"ruby",
	"s",
	"samp",
	"section",
	"small",
	"span",
	"strong",
	"sub",
	"summary",
	"sup",
	"time",
	"u",
	"var",
	"wbr",
];

const VOID_ELEMENTS = new Set(["br", "wbr"]);
const ALLOWED_ELEMENTS = new Set(HTML_ELEMENTS);

const HTML_ATTRIBUTES: Schema["attributes"] = Object.fromEntries(
	[
		"style",
		"title",
		"lang",
		"dir",
		"href",
		"target",
		"rel",
		"datetime",
		"cite",
	].map((name) => [name, { type: String }]),
);
HTML_ATTRIBUTES.open = { type: Boolean };

export const htmlTags: Record<string, Schema> = Object.fromEntries(
	HTML_ELEMENTS.map((name) => [name, { render: name, attributes: HTML_ATTRIBUTES }]),
);

const TAG_RE =
	/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s"'=<>`/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/g;
const ATTRIBUTE_RE = /([^\s"'=<>`/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
const ENTITIES: Record<string, string> = {
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&quot;": '"',
	"&#39;": "'",
	"&apos;": "'",
};

function decodeEntities(value: string): string {
	return value.replace(/&(?:amp|lt|gt|quot|#39|apos);/g, (entity) => ENTITIES[entity]);
}

function attribute(name: string, value: unknown): Attribute {
	return { type: "attribute", name, value };
}

function parseAttributes(raw: string): Attribute[] {
	const attributes: Attribute[] = [];
	for (const match of raw.matchAll(ATTRIBUTE_RE)) {
		const name = match[1].toLowerCase();
		if (name.startsWith("on")) continue;
		const raw = match[2] ?? match[3] ?? match[4];
		if (raw === undefined) {
			attributes.push(attribute(name, true));
			continue;
		}
		const value = decodeEntities(raw);
		if (name === "href" && /^\s*javascript:/i.test(value)) continue;
		attributes.push(attribute(name, value));
	}
	return attributes;
}

function makeToken(type: string, nesting: -1 | 0 | 1): Token {
	return {
		type,
		tag: "",
		nesting,
		meta: null,
		attrs: null,
		map: null,
		level: 0,
		children: null,
		content: "",
		markup: "",
		info: "",
		block: false,
		hidden: false,
	} as unknown as Token;
}

function tagToken(name: string, attributes: Attribute[], nesting: -1 | 0 | 1): Token {
	const token = makeToken(
		nesting === 1 ? "tag_open" : nesting === -1 ? "tag_close" : "tag",
		nesting,
	);
	token.meta = { tag: name, attributes };
	return token;
}

function textToken(content: string): Token {
	const token = makeToken("text", 0);
	token.content = content;
	return token;
}

function inlineToken(md: MarkdownIt, env: Env, content: string): Token {
	const token = makeToken("inline", 0);
	token.content = content;
	token.block = true;
	token.children = [];
	md.inline.parse(content, md, env, token.children);
	return token;
}

function literal(md: MarkdownIt, env: Env, content: string, block: boolean): Token {
	if (!block) return textToken(content);
	const token = inlineToken(md, env, "");
	token.content = content;
	token.children = [textToken(content)];
	return token;
}

function htmlTokens(md: MarkdownIt, env: Env, html: string, block: boolean): Token[] {
	const tokens: Token[] = [];
	let cursor = 0;

	const text = (chunk: string) => {
		const content = block ? chunk.replace(/^\n+|\n+$/g, "") : chunk;
		if (!content) return;
		if (!block) {
			tokens.push(textToken(decodeEntities(content)));
			return;
		}
		const token = inlineToken(md, env, content);
		token.children = convertInline(md, env, token.children ?? []);
		tokens.push(token);
	};

	for (const match of html.matchAll(TAG_RE)) {
		text(html.slice(cursor, match.index));
		cursor = match.index + match[0].length;

		const [, closing, rawName, rawAttributes, selfClosing] = match;
		const name = rawName.toLowerCase();
		if (!ALLOWED_ELEMENTS.has(name)) {
			tokens.push(literal(md, env, match[0], block));
			continue;
		}

		if (closing) tokens.push(tagToken(name, [], -1));
		else if (selfClosing || VOID_ELEMENTS.has(name)) {
			tokens.push(tagToken(name, parseAttributes(rawAttributes), 0));
		} else tokens.push(tagToken(name, parseAttributes(rawAttributes), 1));
	}

	text(html.slice(cursor));
	return tokens;
}

function isComment(content: string): boolean {
	return content.startsWith("<!--") || content.startsWith("<?") ||
		content.startsWith("<!");
}

function convertInline(md: MarkdownIt, env: Env, children: Token[]): Token[] {
	const output: Token[] = [];
	for (const child of children) {
		if (child.type !== "html_inline") output.push(child);
		else if (!isComment(child.content)) {
			output.push(...htmlTokens(md, env, child.content, false));
		}
	}
	return output;
}

function html(md: MarkdownIt): void {
	md.core.ruler.push("html_tags", (state) => {
		const output: Token[] = [];
		for (const token of state.tokens) {
			if (token.type === "html_block") {
				if (!isComment(token.content)) {
					output.push(...htmlTokens(md, state.env, token.content, true));
				}
				continue;
			}

			if (token.type === "inline" && token.children) {
				token.children = convertInline(md, state.env, token.children);
			}

			output.push(token);
		}
		state.tokens = output;
	});
}

function findClosing(src: string, from: number, open: string, close: string): number {
	let depth = 0;
	for (let i = from; i < src.length; i++) {
		const char = src[i];
		if (char === "\\") i++;
		else if (char === open) depth++;
		else if (char === close && --depth === 0) return i;
		else if (char === "\n") return -1;
	}
	return -1;
}

const rubyRule: InlineRule = (state, silent) => {
	const { src, pos } = state;
	if (src[pos] !== "^" || src[pos + 1] !== "[") return false;

	const baseEnd = findClosing(src, pos + 1, "[", "]");
	if (baseEnd < 0 || src[baseEnd + 1] !== "{") return false;

	const readingEnd = findClosing(src, baseEnd + 1, "{", "}");
	if (readingEnd < 0) return false;

	const base = src.slice(pos + 2, baseEnd);
	const reading = src.slice(baseEnd + 2, readingEnd);
	if (!base || !reading) return false;

	if (!silent) {
		const push = (token: Token) =>
			state.push(token.type, "", token.nesting).meta = token.meta;
		push(tagToken("ruby", [], 1));
		state.push("text", "", 0).content = base;
		push(tagToken("rp", [], 1));
		state.push("text", "", 0).content = "(";
		push(tagToken("rp", [], -1));
		push(tagToken("rt", [], 1));
		state.push("text", "", 0).content = reading;
		push(tagToken("rt", [], -1));
		push(tagToken("rp", [], 1));
		state.push("text", "", 0).content = ")";
		push(tagToken("rp", [], -1));
		push(tagToken("ruby", [], -1));
	}

	state.pos = readingEnd + 1;
	return true;
};

function ruby(md: MarkdownIt): void {
	md.inline.ruler.before("link", "ruby", rubyRule);
}

const FOOTNOTE_REF_RE = /^\[\^([^\]\s]+)\]/;
const FOOTNOTE_DEF_RE = /^\[\^([^\]\s]+)\]:[ \t]*/;

const footnoteRefRule: InlineRule = (state, silent) => {
	const match = FOOTNOTE_REF_RE.exec(state.src.slice(state.pos, state.posMax));
	if (!match) return false;

	if (!silent) {
		state.push("tag", "", 0).meta = {
			tag: "footnoteRef",
			attributes: [attribute("id", match[1])],
		};
	}

	state.pos += match[0].length;
	return true;
};

const footnoteDefRule: BlockRule = (state, startLine, endLine, silent) => {
	const start = state.bMarks[startLine] + state.tShift[startLine];
	const finish = state.eMarks[startLine];
	if (state.sCount[startLine] >= 4) return false;

	const match = FOOTNOTE_DEF_RE.exec(state.src.slice(start, finish));
	if (!match) return false;
	if (silent) return true;

	const terminators = state.md.block.ruler.getRules("paragraph");
	const lines = [state.src.slice(start + match[0].length, finish)];
	let nextLine = startLine + 1;

	for (; nextLine < endLine; nextLine++) {
		if (state.isEmpty(nextLine)) {
			let peek = nextLine + 1;
			while (peek < endLine && state.isEmpty(peek)) peek++;
			if (peek >= endLine || state.sCount[peek] < 2) break;
			lines.push("");
			continue;
		}

		if (state.sCount[nextLine] < 2) {
			if (terminators.some((rule) => rule(state, nextLine, endLine, true))) break;
			if (
				FOOTNOTE_DEF_RE.test(
					state.src.slice(state.bMarks[nextLine], state.eMarks[nextLine]),
				)
			) {
				break;
			}
		}

		const indent = Math.min(state.sCount[nextLine], 4);
		lines.push(state.src.slice(state.bMarks[nextLine] + indent, state.eMarks[nextLine]));
	}

	const open = state.push("tag_open", "", 1);
	open.meta = { tag: "footnote", attributes: [attribute("id", match[1])] };
	open.map = [startLine, nextLine];
	state.md.block.parse(lines.join("\n"), state.md, state.env, state.tokens);
	state.push("tag_close", "", -1).meta = { tag: "footnote", attributes: [] };

	state.line = nextLine;
	return true;
};

const footnoteCollectRule: CoreRule = (state) => {
	const order = new Map<string, number>();

	for (const token of state.tokens) {
		if (token.type !== "inline" || !token.children) continue;
		for (const child of token.children) {
			if (child.type !== "tag" || child.meta?.tag !== "footnoteRef") continue;
			const id = child.meta.attributes[0].value as string;
			if (!order.has(id)) order.set(id, order.size + 1);
			child.meta.attributes.push(attribute("n", order.get(id)));
		}
	}

	const definitions = new Map<string, Token[]>();
	const body: Token[] = [];

	for (let i = 0; i < state.tokens.length; i++) {
		const token = state.tokens[i];
		if (token.type !== "tag_open" || token.meta?.tag !== "footnote") {
			body.push(token);
			continue;
		}

		let depth = 0;
		let end = i;
		for (; end < state.tokens.length; end++) {
			const current = state.tokens[end];
			if (current.meta?.tag !== "footnote") continue;
			if (current.type === "tag_open") depth++;
			else if (current.type === "tag_close" && --depth === 0) break;
		}

		const id = token.meta.attributes[0].value as string;
		if (!definitions.has(id)) definitions.set(id, state.tokens.slice(i, end + 1));
		i = end;
	}

	if (order.size === 0 || definitions.size === 0) {
		state.tokens = body;
		return;
	}

	const footnotes = [...order]
		.filter(([id]) => definitions.has(id))
		.map(([id, n]) => {
			const tokens = definitions.get(id) as Token[];
			tokens[0].meta.attributes.push(attribute("n", n));
			return tokens;
		});

	state.tokens = [
		...body,
		tagToken("footnotes", [], 1),
		...footnotes.flat(),
		tagToken("footnotes", [], -1),
	];
};

function footnotes(md: MarkdownIt): void {
	md.inline.ruler.before("link", "footnote_ref", footnoteRefRule);
	md.block.ruler.before("reference", "footnote_def", footnoteDefRule, {
		alt: ["paragraph", "reference"],
	});
	md.core.ruler.push("footnotes", footnoteCollectRule);
}

const tokenizer = new Markdoc.Tokenizer({ html: true });
const parser = (tokenizer as unknown as { parser: MarkdownIt }).parser;
parser.use(html).use(ruby).use(footnotes);

export function parseMarkdown(source: string): Node {
	return Markdoc.parse(tokenizer.tokenize(source));
}
