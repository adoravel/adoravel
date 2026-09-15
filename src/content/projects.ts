// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

export interface ProjectEntry {
	name: string;
	owner?: string;
	tagline?: string;
	language?: string;
}

export const projects: readonly ProjectEntry[] = [
	// {
	// 	name: "vye",
	// 	tagline:
	// 		"a modern, privacy-respecting frontend for popular search engines",
	// 	language: "Rust",
	// },
	// {
	// 	name: "wildcat",
	// 	tagline: "a lightweight, modular, minimal and cross-platform game engine in modern C",
	// 	language: "C",
	// },
	{
		name: "snarl",
		tagline: "a lightweight full-stack web framework and JSX runtime for Deno",
		language: "TypeScript",
	},
	{
		name: "ratazana",
		tagline: "logitech and razer mouse firmware repurposed as a covert data channel",
		language: "C",
	},
];
