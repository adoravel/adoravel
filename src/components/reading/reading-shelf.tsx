// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { ease, fontSize, media, spacing, theme } from "~/tokens";
import { Bookmark } from "~/components/ui/icon.tsx";
import ScrollShelf from "~/components/ui/scroll-shelf.tsx";
import BookCover from "~/components/reading/book-cover.tsx";
import type { ReadingItem, ReadingKind } from "~/services/reading/mod.ts";

export interface ReadingShelfProps {
	items: ReadingItem[];
	label?: string;
}

const COVER_WIDTH = 124;

const KIND_LABELS: Record<ReadingKind, string> = {
	book: "book",
	manga: "manga",
	"light-novel": "light novel",
};

const Styled = css`
	:scope {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		width: ${COVER_WIDTH + 36}px;
		scroll-snap-align: start;
	}

	.reading-link {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: ${spacing[3]};
		width: 100%;
		padding: ${spacing[2]} ${spacing[3]} 0;
		text-align: center;
		color: inherit;
		text-decoration: none;
	}

	.reading-cover {
		margin-bottom: ${spacing[3]};
	}

	.reading-link:hover .book,
	.reading-link:focus-visible .book {
		transform: rotateY(-10deg);
	}

	.reading-link:hover .book-face img,
	.reading-link:focus-visible .book-face img {
		opacity: 1;
	}

	.reading-meta {
		display: flex;
		flex-direction: column;
		width: 100%;
		font-size: ${fontSize.md};
		color: ${theme.subtext};
	}

	.reading-title {
		font-size: ${fontSize.base};
		font-weight: 600;
		color: ${theme.text};
		transition: color ${ease.hover};
	}

	.reading-link:hover .reading-title,
	.reading-link:focus-visible .reading-title {
		color: ${theme.accent};
	}

	.reading-title,
	.reading-author {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		overflow-wrap: anywhere;
	}

	.reading-kind {
		margin-top: ${spacing[1]};
		font-size: ${fontSize.xs};
		color: ${theme.textMuted};
	}

	.reading-status {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: ${spacing[1]};
		margin-top: ${spacing[1]};
		font-size: ${fontSize.xs};
		color: ${theme.accent};
	}

	${media.reducedMotion} {
		.reading-link:hover .book,
		.reading-link:focus-visible .book {
			transform: rotateY(-26deg);
		}
	}
`;

function ReadingCard({ item }: { item: ReadingItem }) {
	const Tag = item.url ? "a" : "span";

	return (
		<Styled.li>
			<Tag
				class="reading-link"
				href={item.url}
				target={item.url ? "_blank" : undefined}
				rel={item.url ? "noopener noreferrer" : undefined}
			>
				<BookCover
					class="reading-cover"
					title={item.title}
					url={item.coverUrl}
					blurhash={item.coverBlurhash}
					width={COVER_WIDTH}
				/>
				<span class="reading-meta">
					<span class="reading-title">{item.title}</span>
					<span class="reading-author">{item.author}</span>
					<span class="reading-kind">{KIND_LABELS[item.kind]}</span>
					{item.status === "reading" && (
						<span class="reading-status">
							<Bookmark size={11} label="Currently reading" />
							reading
						</span>
					)}
				</span>
				{item.url && <span class="sr-only">(opens in a new tab)</span>}
			</Tag>
		</Styled.li>
	);
}

export default function ReadingShelf(
	{ items, label = "Reading list" }: ReadingShelfProps,
) {
	if (!items.length) return null;

	return (
		<ScrollShelf label={label} controlTop={`${(COVER_WIDTH * 3) / 2 / 2 + 8}px`}>
			{items.map((item) => <ReadingCard key={item.title} item={item} />)}
		</ScrollShelf>
	);
}
