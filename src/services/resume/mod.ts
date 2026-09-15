// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { resume, type ResumeContent, type ResumeProjectEntry } from "~/content/resume.ts";
import { site } from "~/config/site.ts";

export const SERVICE = "resume";

export interface ResumeProject extends ResumeProjectEntry {
	url: string;
}

export interface ResumeDocument extends Omit<ResumeContent, "projects"> {
	projects: ResumeProject[];
	generatedAt: string;
}

export interface Period {
	start: string;
	end?: string;
	planned?: boolean;
}

function repositoryUrl(name: string): string {
	return `https://github.com/${site.github.user}/${name}`;
}

export function formatPeriod({ start, end, planned }: Period): string {
	const range = end ? `${start} – ${end}` : planned ? start : `${start} – present`;
	return planned ? `${range} (expected)` : range;
}

export function displayUrl(href: string): string {
	return href.replace(/^(?:https?:\/\/|mailto:)/, "");
}

export function fileName(document: ResumeDocument): string {
	return `${document.name.replace(/\s+/g, "-").toLowerCase()}-resume.pdf`;
}

export function buildResume(): ResumeDocument {
	return {
		...resume,
		projects: resume.projects.map((project) => ({
			...project,
			url: project.url ?? repositoryUrl(project.name),
		})),
		generatedAt: new Date().toISOString().slice(0, 10),
	};
}

export type {
	ResumeEducation,
	ResumeExperience,
	ResumeLanguage,
	ResumeLink,
	ResumeProjectEntry,
	ResumeSkillGroup,
} from "~/content/resume.ts";
