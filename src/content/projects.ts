/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export interface Project {
	author: string;
	name: string;
	description: string;
	lang: ProjectLanguage;
	license: string;
	url: string;
}

export enum ProjectLanguage {
	TypeScript = 0x3178c6,
	C = 0x555555,
	Scala = 0xc22d40,
}

export const projects: Project[] = [
	{
		author: "w",
		name: "snarl",
		description: "a minimal web framework for deno",
		license: "Apache-2.0",
		url: "/~snarl",
		lang: ProjectLanguage.TypeScript,
	},
	{
		author: "w",
		name: "ratazana",
		description:
			"minimal implementation of logitech and razer mouse firmware, repurposing their onboard memory as a covert channel for arbitrary data",
		license: "BSD-3-Clause",
		url: "/~ratazana",
		lang: ProjectLanguage.C,
	},
	{
		author: "w",
		name: "ribbon",
		description: "modular client mod for fluxer",
		url: "/~ribbon",
		license: "EUPL-1.2 & MPL-2.0",
		lang: ProjectLanguage.TypeScript,
	},
	{
		author: "w",
		name: "scrobkit",
		description: "a minimal CLI toolkit for working with last.fm scrobbles",
		url: "/~scrobkit",
		license: "BSD-3-Clause",
		lang: ProjectLanguage.TypeScript,
	},
	// {
	// 	author: "w",
	// 	name: "terracotta",
	// 	description: "mill-based toolchain for crossplatform and multi-version minecraft mod development",
	// 	url: "/~terracotta",
	// 	license: "LGPL-3.0",
	// 	lang: ProjectLanguage.Scala,
	// },
	{
		author: "w",
		name: "wildcat",
		description: "lightweight, minimal, portable, crossplatform, and straightforward game engine inspired by raylib",
		license: "BSD-3-Clause",
		url: "/~wildcat",
		lang: ProjectLanguage.C,
	},
];
