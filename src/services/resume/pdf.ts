// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { fromFileUrl } from "@std/path";
import { PDFDocument, type PDFFont, type PDFPage, type RGB, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { displayUrl, formatPeriod, type ResumeDocument } from "./mod.ts";
import {
	RESUME_COLOUR,
	RESUME_GAP as GAP,
	RESUME_LEADING as LEADING,
	RESUME_PAGE,
	RESUME_SIZE as SIZE,
	type ResumeColour,
} from "./style.ts";
import { woffToSfnt } from "./woff.ts";

const PAGE = { width: RESUME_PAGE.width, height: RESUME_PAGE.height };
const MARGIN = { x: RESUME_PAGE.marginX, y: RESUME_PAGE.marginY };
const CONTENT_WIDTH = PAGE.width - MARGIN.x * 2;

function hex(colour: string): RGB {
	const value = parseInt(colour.slice(1), 16);
	return rgb(
		((value >> 16) & 255) / 255,
		((value >> 8) & 255) / 255,
		(value & 255) / 255,
	);
}

const COLOUR = Object.fromEntries(
	Object.entries(RESUME_COLOUR).map(([name, value]) => [name, hex(value)]),
) as Record<ResumeColour, RGB>;

const FONT_FILES = {
	regular: "@fontsource/public-sans/files/public-sans-latin-400-normal.woff",
	semibold: "@fontsource/public-sans/files/public-sans-latin-600-normal.woff",
	bold: "@fontsource/public-sans/files/public-sans-latin-700-normal.woff",
} as const;

type Weight = keyof typeof FONT_FILES;
type Fonts = Record<Weight, PDFFont>;

interface TextStyle {
	weight?: Weight;
	size?: number;
	colour?: RGB;
}

const fontBytes = new Map<Weight, Promise<Uint8Array>>();

function loadFont(weight: Weight): Promise<Uint8Array> {
	let bytes = fontBytes.get(weight);
	if (!bytes) {
		bytes = Deno.readFile(fromFileUrl(import.meta.resolve(FONT_FILES[weight]))).then(
			woffToSfnt,
		);
		fontBytes.set(weight, bytes);
	}
	return bytes;
}

class Layout {
	page!: PDFPage;
	y = 0;

	constructor(readonly pdf: PDFDocument, readonly fonts: Fonts) {
		this.newPage();
	}

	newPage(): void {
		this.page = this.pdf.addPage([PAGE.width, PAGE.height]);
		this.y = PAGE.height - MARGIN.y;
	}

	ensure(height: number): void {
		if (this.y - height < MARGIN.y) this.newPage();
	}

	font(style: TextStyle): PDFFont {
		return this.fonts[style.weight ?? "regular"];
	}

	width(text: string, style: TextStyle = {}): number {
		return this.font(style).widthOfTextAtSize(text, style.size ?? SIZE.body);
	}

	wrap(text: string, style: TextStyle, maxWidth: number): string[] {
		const lines: string[] = [];
		for (const paragraph of text.split("\n")) {
			let line = "";
			for (const word of paragraph.split(/\s+/).filter(Boolean)) {
				const candidate = line ? `${line} ${word}` : word;
				if (this.width(candidate, style) <= maxWidth || !line) line = candidate;
				else {
					lines.push(line);
					line = word;
				}
			}
			lines.push(line);
		}
		return lines;
	}

	text(
		text: string,
		style: TextStyle = {},
		options: { x?: number; width?: number } = {},
	) {
		const size = style.size ?? SIZE.body;
		const lineHeight = size * LEADING;
		const x = options.x ?? MARGIN.x;
		const lines = this.wrap(text, style, options.width ?? CONTENT_WIDTH - (x - MARGIN.x));

		for (const line of lines) {
			this.ensure(lineHeight);
			this.page.drawText(line, {
				x,
				y: this.y - size,
				size,
				font: this.font(style),
				color: style.colour ?? COLOUR.text,
			});
			this.y -= lineHeight;
		}
	}

	textRight(text: string, style: TextStyle = {}): void {
		const size = style.size ?? SIZE.body;
		this.page.drawText(text, {
			x: PAGE.width - MARGIN.x - this.width(text, style),
			y: this.y - size,
			size,
			font: this.font(style),
			color: style.colour ?? COLOUR.text,
		});
	}

	row(left: string, right: string, style: TextStyle = {}, rightStyle?: TextStyle): void {
		const size = style.size ?? SIZE.body;
		this.ensure(size * LEADING);
		const right_ = rightStyle ?? { size: SIZE.small, colour: COLOUR.muted };
		const rightWidth = right ? this.width(right, right_) : 0;
		if (right) this.textRight(right, right_);
		this.text(left, style, { width: CONTENT_WIDTH - rightWidth - 12 });
	}

	rule(colour: RGB = COLOUR.rule, thickness = 0.6): void {
		this.ensure(thickness);
		this.page.drawLine({
			start: { x: MARGIN.x, y: this.y },
			end: { x: PAGE.width - MARGIN.x, y: this.y },
			thickness,
			color: colour,
		});
	}

	heading(title: string): void {
		this.ensure(SIZE.heading * LEADING + GAP.heading + 30);
		this.space(GAP.section);
		this.text(title, { weight: "semibold", size: SIZE.heading });
		this.space(3);
		this.rule();
		this.space(GAP.heading);
	}

	bullet(text: string): void {
		const size = SIZE.body;
		this.ensure(size * LEADING);
		this.page.drawText("–", {
			x: MARGIN.x + 1,
			y: this.y - size,
			size,
			font: this.fonts.regular,
			color: COLOUR.muted,
		});
		this.text(text, { colour: COLOUR.subtext }, { x: MARGIN.x + GAP.bullet });
	}

	facts(entries: Array<[string, string]>): void {
		const labelWidth = Math.max(
			...entries.map(([label]) => this.width(label, { weight: "semibold" })),
		) + 16;
		entries.forEach(([label, value], index) => {
			if (index > 0) this.space(GAP.paragraph);
			const top = this.y;
			this.text(label, { weight: "semibold" });
			this.y = top;
			this.text(value, { colour: COLOUR.subtext }, { x: MARGIN.x + labelWidth });
		});
	}

	space(height: number): void {
		this.y -= height;
	}
}

function drawHeader(layout: Layout, document: ResumeDocument): void {
	const top = layout.y;
	const contact = [
		...document.links.map((link) => displayUrl(link.href)),
		document.location,
	].filter((item): item is string => Boolean(item));
	const contactWidth = Math.max(
		...contact.map((item) => layout.width(item, { size: SIZE.small })),
	);

	layout.text(document.name, { weight: "bold", size: SIZE.name }, {
		width: CONTENT_WIDTH - contactWidth - 24,
	});
	layout.space(2);
	layout.text(document.headline, { size: SIZE.headline, colour: COLOUR.subtext }, {
		width: CONTENT_WIDTH - contactWidth - 24,
	});
	const leftBottom = layout.y;

	layout.y = top + 1;
	for (const item of contact) {
		layout.textRight(item, { size: SIZE.small, colour: COLOUR.muted });
		layout.y -= SIZE.small * LEADING;
	}

	layout.y = Math.min(leftBottom, layout.y) - 10;
	layout.rule(COLOUR.rule, 0.8);
}

function drawGoal(layout: Layout, document: ResumeDocument): void {
	layout.heading("Career goal");
	layout.text(document.goal, { colour: COLOUR.subtext });
}

function drawExperience(layout: Layout, document: ResumeDocument): void {
	if (!document.experience.length) return;
	layout.heading("Experience");

	document.experience.forEach((entry, index) => {
		if (index > 0) layout.space(GAP.entry);
		layout.row(entry.role, formatPeriod(entry), { weight: "semibold" });
		layout.row(entry.organisation, entry.location ?? "", {
			size: SIZE.small,
			colour: COLOUR.muted,
		});
		if (entry.summary) {
			layout.space(3);
			layout.text(entry.summary, { colour: COLOUR.subtext });
		}
		if (entry.highlights?.length) {
			layout.space(3);
			for (const highlight of entry.highlights) layout.bullet(highlight);
		}
	});
}

function drawProjects(layout: Layout, document: ResumeDocument): void {
	if (!document.projects.length) return;
	layout.heading("Projects");

	document.projects.forEach((project, index) => {
		if (index > 0) layout.space(GAP.entry);
		layout.row(project.name, project.stack, { weight: "semibold" });
		layout.row(project.kind, displayUrl(project.url), {
			size: SIZE.small,
			colour: COLOUR.muted,
		});
		layout.space(3);
		layout.text(project.summary, { colour: COLOUR.subtext });
		if (project.highlights?.length) {
			layout.space(3);
			for (const highlight of project.highlights) layout.bullet(highlight);
		}
	});
}

function drawEducation(layout: Layout, document: ResumeDocument): void {
	if (!document.education.length) return;
	layout.heading("Education");

	document.education.forEach((entry, index) => {
		if (index > 0) layout.space(GAP.entry);
		layout.row(entry.degree, formatPeriod(entry), { weight: "semibold" });
		layout.row(entry.institution, entry.location ?? "", {
			size: SIZE.small,
			colour: COLOUR.muted,
		});
		if (entry.summary) {
			layout.space(3);
			layout.text(entry.summary, { colour: COLOUR.subtext });
		}
	});
}

function drawSkills(layout: Layout, document: ResumeDocument): void {
	if (!document.skills.length) return;
	layout.heading("Technical skills");
	layout.facts(document.skills.map((group) => [group.label, group.items.join(", ")]));
}

function drawLanguages(layout: Layout, document: ResumeDocument): void {
	if (!document.languages.length) return;
	layout.heading("Spoken languages");
	layout.facts(document.languages.map((language) => [language.name, language.level]));
}

function drawFooter(pdf: PDFDocument, fonts: Fonts, document: ResumeDocument): void {
	const pages = pdf.getPages();
	const site = document.links.find((link) => !link.href.startsWith("mailto:"));
	pages.forEach((page, index) => {
		const label = `${document.name}   ${site ? displayUrl(site.href) : ""}   ${
			index + 1
		}/${pages.length}`;
		page.drawText(label, {
			x: PAGE.width - MARGIN.x - fonts.regular.widthOfTextAtSize(label, SIZE.small),
			y: MARGIN.y / 2,
			size: SIZE.small,
			font: fonts.regular,
			color: COLOUR.muted,
		});
	});
}

export async function renderResumePdf(
	document: ResumeDocument,
): Promise<Uint8Array<ArrayBuffer>> {
	const pdf = await PDFDocument.create();
	pdf.registerFontkit(fontkit);
	pdf.setTitle(`${document.name} — résumé`);
	pdf.setAuthor(document.name);
	pdf.setProducer(document.links[0]?.href ?? document.name);
	pdf.setCreationDate(new Date(document.generatedAt));

	const fonts = {
		regular: await pdf.embedFont(await loadFont("regular"), { subset: true }),
		semibold: await pdf.embedFont(await loadFont("semibold"), { subset: true }),
		bold: await pdf.embedFont(await loadFont("bold"), { subset: true }),
	};

	const layout = new Layout(pdf, fonts);
	drawHeader(layout, document);
	drawGoal(layout, document);
	drawExperience(layout, document);
	drawProjects(layout, document);
	drawEducation(layout, document);
	drawSkills(layout, document);
	drawLanguages(layout, document);
	drawFooter(pdf, fonts, document);

	const bytes = await pdf.save();
	return new Uint8Array(
		bytes.buffer.slice(
			bytes.byteOffset,
			bytes.byteOffset + bytes.byteLength,
		) as ArrayBuffer,
	);
}
