/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { TextSegment } from "~/content/post.ts";

interface Props {
	segments: TextSegment[];
	hashtagClass?: string;
	stopPropagation?: boolean;
}

export function truncateSegments(segments: TextSegment[]): TextSegment[] {
	if (!segments.length) return segments;

	const last = segments[segments.length - 1];
	if (last.type !== "text" || !last.text) return segments;

	const text = last.text.replace(/[.,]+\s*$/, "");

	return [
		...segments.slice(0, -1),
		{ ...last, text: text + "…" },
	];
}

export function PostSegments({ segments, hashtagClass = "tl-hashtag", stopPropagation = false }: Props) {
	const onclick: any = stopPropagation ? (e: PointerEvent) => e.stopPropagation() : undefined;

	return (
		<>
			{segments.map((seg, i) => {
				switch (seg.type) {
					case "link":
						return (
							<a key={i} href={seg.uri} target="_blank" rel="noopener noreferrer" onclick={onclick}>
								{seg.text}
							</a>
						);
					case "mention":
						return (
							<a
								key={i}
								href={`https://bsky.app/profile/${seg.did}`}
								target="_blank"
								rel="noopener noreferrer"
								onclick={onclick}
							>
								{seg.text}
							</a>
						);
					case "tag":
						return (
							<a
								key={i}
								class={hashtagClass}
								href={`https://bsky.app/search?q=%23${seg.tag}`}
								target="_blank"
								rel="noopener noreferrer"
								onclick={onclick}
							>
								{seg.text}
							</a>
						);
					default:
						return seg.text;
				}
			})}
		</>
	);
}
