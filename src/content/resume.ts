// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { site } from "~/config/site.ts";

export interface ResumeLink {
	label: string;
	href: string;
}

export interface ResumeExperience {
	role: string;
	organisation: string;
	location?: string;
	start: string;
	end?: string;
	summary?: string;
	highlights?: string[];
	url?: string;
}

export interface ResumeEducation {
	degree: string;
	institution: string;
	location?: string;
	start: string;
	end?: string;
	planned?: boolean;
	summary?: string;
}

export interface ResumeProjectEntry {
	name: string;
	kind: string;
	stack: string;
	url?: string;
	summary: string;
	highlights?: string[];
}

export interface ResumeSkillGroup {
	label: string;
	items: string[];
}

export interface ResumeLanguage {
	name: string;
	level: string;
}

export interface ResumeContent {
	name: string;
	headline: string;
	location?: string;
	links: ResumeLink[];
	goal: string;
	experience: ResumeExperience[];
	education: ResumeEducation[];
	projects: ResumeProjectEntry[];
	skills: ResumeSkillGroup[];
	languages: ResumeLanguage[];
}

export const resume: ResumeContent = {
	name: "Júlia Lívia",
	headline: "Systems programming, web platforms and search",
	location: "São Paulo, Brazil",
	links: [
		{ label: site.email, href: `mailto:${site.email}` },
		{ label: `www.${site.handle}`, href: `https://${site.handle}` },
		{ label: `github.com/${site.github.user}`, href: `https:${site.github.profileUrl}` },
	],
	goal:
		"Systems-focused engineer looking to build low-level tooling and runtimes that respect both the hardware and the people using them.",
	experience: [],
	education: [
		{
			degree: "B.Sc. in Computer Engineering",
			institution: "Universidade Federal de Minas Gerais (UFMG)",
			location: "Belo Horizonte, Brazil",
			start: "2028",
			end: "2032",
			planned: true,
			summary: "Five-year programme, starting in 2028.",
		},
	],
	projects: [
		{
			name: "vye",
			kind: "Search engine",
			stack: "Rust, TypeScript",
			summary: "A modern, privacy-respecting frontend for popular search engines.",
		},
		{
			name: "wildcat",
			kind: "Game engine",
			stack: "C",
			summary:
				"A lightweight, modular and cross-platform game engine written in modern C, built so small games can ship with a minimal core instead of a heavyweight runtime.",
			highlights: [
				"Modules are opt-in, keeping binaries small and the core easy to read and audit.",
			],
		},
		{
			name: "snarl",
			kind: "Web framework",
			stack: "TypeScript, Deno",
			summary:
				"A full-stack web framework and JSX runtime for Deno built on the standard library alone. Powers kyu.re and the web layer of vye.",
			highlights: [
				"Published on JSR as @july/snarl with no third-party runtime dependencies.",
			],
		},
		{
			name: "ratazana",
			kind: "Firmware research",
			stack: "C",
			summary:
				"A minimal reimplementation of Logitech and Razer mouse firmware that repurposes the wireless link as a covert data channel, demonstrating a practical exfiltration path over commodity peripherals.",
		},
	],
	skills: [
		{
			label: "Programming languages",
			items: [
				"JavaScript",
				"TypeScript",
				"C",
				"C++",
				"Rust",
				"Go",
				"Python",
				"Java",
				"Kotlin",
				"Scala",
				"Lua",
				"Fennel",
			],
		},
		{
			label: "Platforms & tools",
			items: [
				"Deno",
				"Node.js",
				"Electron",
				"Linux",
				"Git",
				"Browser extensions",
				"Minecraft modding",
				"Reverse engineering",
			],
		},
	],
	languages: [
		{ name: "Brazilian Portuguese", level: "Native" },
		{ name: "British English", level: "Fluent" },
		{ name: "Latin American Spanish", level: "Conversational" },
	],
};
