// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { fetchJson } from "~/services/core/http.ts";
import { readOptionalEnv } from "~/services/core/env.ts";
import {
	hasShape,
	isNumber,
	isString,
	nullable,
	optional,
} from "~/services/core/validate.ts";
import { site } from "~/config/site.ts";
import { type ProjectEntry, projects } from "~/content/projects.ts";
import { SERVICE } from "./client.ts";

const API_URL = "https://api.github.com/repos";
const TOKEN = readOptionalEnv("GITHUB_TOKEN");

export interface Repository {
	owner: string;
	name: string;
	url: string;
	homepage?: string;
	description?: string;
	language?: string;
	license?: string;
	stars: number;
}

const isRepositoryPayload = hasShape({
	name: isString,
	html_url: isString,
	homepage: optional(nullable(isString)),
	description: nullable(isString),
	language: nullable(isString),
	stargazers_count: isNumber,
	license: nullable(hasShape({ spdx_id: nullable(isString) })),
	owner: hasShape({ login: isString }),
});

function headers(): HeadersInit {
	return TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
}

// deno-lint-ignore no-unused-vars
async function fetchRepository(
	entry: ProjectEntry,
	signal?: AbortSignal,
): Promise<Repository> {
	const owner = entry.owner ?? site.github.user;
	const payload = await fetchJson({
		service: SERVICE,
		url: `${API_URL}/${encodeURIComponent(owner)}/${encodeURIComponent(entry.name)}`,
		guard: isRepositoryPayload,
		headers: headers(),
		signal,
	});

	const license = payload.license?.spdx_id;
	return {
		owner: payload.owner.login,
		name: payload.name,
		url: payload.html_url,
		homepage: payload.homepage || undefined,
		description: entry.tagline ?? payload.description ?? undefined,
		language: payload.language ?? entry.language,
		license: license && license !== "NOASSERTION" ? license : undefined,
		stars: payload.stargazers_count,
	};
}

function fallback(entry: ProjectEntry): Repository {
	const owner = entry.owner ?? site.github.user;
	return {
		owner,
		name: entry.name,
		url: `https://github.com/${owner}/${entry.name}`,
		description: entry.tagline,
		language: entry.language,
		stars: 0,
	};
}

// deno-lint-ignore require-await
export async function fetchRepositories(_signal?: AbortSignal): Promise<Repository[]> {
	return projects.map(fallback);
	// const results = await Promise.allSettled(
	// 	projects.map((entry) => fetchRepository(entry, signal)),
	// );

	// return results.map((result, index) => {
	// 	if (result.status === "fulfilled") return result.value;
	// 	log.warn(
	// 		SERVICE,
	// 		`repository ${projects[index].name} unavailable: ${describeError(result.reason)}`,
	// 	);
	// 	return fallback(projects[index]);
	// });
}
