// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

const PRONOUN_SET =
	/^(?:[a-z]{1,6}\/[a-z]{1,6}(?:\/[a-z]{1,6})?|any(?: pronouns)?|all(?: pronouns)?|ask)$/i;
const PARENTHESISED = /\s*[(\[{][^)\]}]*[)\]}]\s*/g;
const SEPARATORS = /\s*[,|·•;]\s*|\s+[-–—]\s+/;

function isPronouns(segment: string): boolean {
	return PRONOUN_SET.test(segment.trim());
}

export function cleanDisplayName(name: string | undefined, fallback: string): string {
	if (!name) return fallback;

	const withoutParens = name.replace(
		PARENTHESISED,
		(match) => isPronouns(match.replace(/[()\[\]{}]/g, "")) ? " " : match,
	);
	const segments = withoutParens
		.split(SEPARATORS)
		.map((segment) => segment.trim())
		.filter((segment) => segment && !isPronouns(segment));

	return segments[0] || fallback;
}
