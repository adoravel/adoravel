// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

export type ReadingKind = "book" | "manga" | "light-novel";
export type ReadingStatus = "reading" | "to-read";

export interface ReadingEntry {
	title: string;
	author: string;
	kind: ReadingKind;
	status?: ReadingStatus;
	isbn?: string;
	cover?: string;
	url?: string;
	note?: string;
}

export const reading: readonly ReadingEntry[] = [
	{
		title: "House of Leaves",
		author: "Mark Z. Danielewski",
		kind: "book",
		isbn: "9780375703768",
	},
	{
		title: "Otherside Picnic",
		author: "Iori Miyazawa",
		kind: "light-novel",
		isbn: "9781718360020",
	},
	{
		title: "The Making of the English Working Class",
		author: "E.P. Thompson",
		kind: "book",
		isbn: "9780140136036",
	},
	{
		title: "Cobalt Red",
		author: "Siddharth Kara",
		kind: "book",
		isbn: "9781250284303",
	},
	{
		title: "Chip War",
		author: "Chris Miller",
		kind: "book",
		isbn: "9781982172008",
	},
	{
		title: "Calling Bullshit",
		author: "Carl Bergstrom & Jevin West",
		kind: "book",
		isbn: "9780525509189",
	},
	{
		title: "How to Lie with Statistics",
		author: "Darrell Huff",
		kind: "book",
		isbn: "9780393310726",
	},
	{
		title: "The Mismeasure of Man",
		author: "Stephen Jay Gould",
		kind: "book",
		isbn: "9780393314250",
	},
	{
		title: "Chainsaw Man",
		author: "Tatsuki Fujimoto",
		kind: "manga",
		isbn: "9781974709939",
	},
	{
		title: "Oyasumi Punpun",
		author: "Inio Asano",
		kind: "manga",
		isbn: "9781421586205",
	},
	{
		title: "Uzumaki",
		author: "Junji Ito",
		kind: "manga",
		isbn: "9781421561325",
	},
	{
		title: "JoJo's Bizarre Adventure: Steel Ball Run",
		author: "Hirohiko Araki",
		kind: "manga",
		isbn: "9788419010124",
	},
	{
		title: "JoJo's Bizarre Adventure: Jojolion",
		author: "Hirohiko Araki",
		kind: "manga",
		isbn: "9784088703114",
	},
	{
		title: "Monster",
		author: "Naoki Urasawa",
		kind: "manga",
		isbn: "9781421569062",
	},
	{
		title: "The Origin of Capitalism",
		author: "Ellen Meiksins Wood",
		kind: "book",
		isbn: "9781859843925",
	},
	{
		title: "Mein Erst Deitschbuch",
		author: "Estevam Fortunato",
		kind: "book",
		isbn: "9786501791241",
	},
];
