// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { ease, fontFamily, fontSize, media, radius, spacing, theme } from "~/tokens";
import AuthorAvatar from "~/components/inbox/author-avatar.tsx";
import { ArrowUpRight } from "~/components/ui/icon.tsx";
import { profileUrl } from "~/components/inbox/identity.ts";
import type { Print } from "~/services/messages/types.ts";

export interface PrintCardProps {
	print: Print;
	locale: string;
}

const CODE39: Record<string, string> = {
	0: "NNNWWNWNN",
	1: "WNNWNNNNW",
	2: "NNWWNNNNW",
	3: "WNWWNNNNN",
	4: "NNNWWNNNW",
	5: "WNNWWNNNN",
	6: "NNWWWNNNN",
	7: "NNNWNNWNW",
	8: "WNNWNNWNN",
	9: "NNWWNNWNN",
	"*": "NNWNWNWNN",
};

function barcode(value: string): { bar: boolean; wide: boolean }[] {
	const bars: { bar: boolean; wide: boolean }[] = [];
	const encoded = `*${value}*`;
	for (let i = 0; i < encoded.length; i++) {
		const pattern = CODE39[encoded[i]];
		if (!pattern) continue;
		for (let j = 0; j < pattern.length; j++) {
			bars.push({ bar: j % 2 === 0, wide: pattern[j] === "W" });
		}
		if (i < encoded.length - 1) bars.push({ bar: false, wide: false });
	}
	return bars;
}

export const printCardStyles = css`
	:scope {
		position: relative;
		display: flex;
		flex-direction: column;
		width: min(24rem, 100%);
		border: 1px solid ${theme.surfaceBorder};
		border-radius: ${radius.lg};
		background: ${theme.surface};
		box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.55);
		transform: rotate(-1.5deg);
		transform-origin: 50% 20%;
		animation: print-settle ${ease.slow} both;
	}

	.print-head {
		display: flex;
		align-items: center;
		gap: ${spacing[3]};
		padding: ${spacing[4]} ${spacing[5]} 0;
	}

	.print-author {
		display: flex;
		flex-direction: column;
		min-width: 0;
		line-height: 1.3;
	}

	.print-author-name {
		display: inline-flex;
		align-items: center;
		gap: ${spacing[1]};
		font-size: ${fontSize.sm};
		font-weight: 500;
		color: ${theme.text};
		text-decoration: none;
		transition: color ${ease.hover};
	}

	a.print-author-name:hover,
	a.print-author-name:focus-visible {
		color: ${theme.accent};
	}

	.print-author-arrow {
		flex-shrink: 0;
		opacity: 0.5;
	}

	.print-author-handle {
		font-size: ${fontSize.xs};
		color: ${theme.textMuted};
	}

	.print-image {
		display: block;
		width: 100%;
		max-height: 18rem;
		margin-top: ${spacing[4]};
		object-fit: contain;
		background: ${theme.base};
		border-top: 1px solid ${theme.surfaceBorder};
		border-bottom: 1px solid ${theme.surfaceBorder};
	}

	.print-body:empty {
		display: none;
	}

	.print-body {
		margin: 0;
		padding: ${spacing[4]} ${spacing[5]};
		font-size: ${fontSize.body};
		line-height: 1.6;
		color: ${theme.text};
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}

	.print-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: ${spacing[3]};
		padding: ${spacing[3]} ${spacing[5]};
		border-top: 1px solid ${theme.surfaceBorder};
		font-family: ${fontFamily.mono};
		font-size: ${fontSize.xs};
		letter-spacing: ${spacing.letter.wide};
		color: ${theme.textMuted};
	}

	.print-foot time {
		font-variant-numeric: tabular-nums;
	}

	.print-tail {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: ${spacing[2]};
		padding: ${spacing[3]} ${spacing[5]} ${spacing[4]};
		border-top: 1px solid ${theme.surfaceBorder};
	}

	.print-barcode {
		display: flex;
		height: 26px;
	}

	.print-barcode i {
		display: block;
		width: 2px;
	}

	.print-barcode i.bar {
		background: ${theme.text};
		opacity: 0.85;
	}

	.print-barcode i.wide {
		width: 5px;
	}

	.print-thanks {
		font-size: ${fontSize.sm};
		font-weight: 600;
		color: ${theme.text};
	}

	@keyframes print-settle {
		from {
			opacity: 0;
			transform: translateY(-16px) rotate(-3deg);
		}
		to {
			opacity: 1;
			transform: rotate(-1.5deg);
		}
	}

	${media.reducedMotion} {
		:scope {
			animation: none;
			transform: none;
		}
	}
`;

export default function PrintCard({ print, locale }: PrintCardProps) {
	const { author } = print;
	const printedAt = new Date(print.printedAt);
	const href = author && profileUrl(author);
	const Name = href ? "a" : "span";
	const stamp = printedAt.toLocaleString(locale, {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});

	return (
		<printCardStyles.article aria-label={`Print #${print.number}`}>
			{author && (
				<header class="print-head">
					<AuthorAvatar author={author} size={30} />
					<span class="print-author">
						<Name
							class="print-author-name"
							href={href}
							target={href ? "_blank" : undefined}
							rel={href ? "noopener noreferrer" : undefined}
						>
							{author.displayName ?? author.handle}
							{href && (
								<ArrowUpRight class="print-author-arrow" size={11} strokeWidth={2.5} />
							)}
						</Name>
						<span class="print-author-handle">@{author.handle}</span>
					</span>
				</header>
			)}

			{print.image && <img class="print-image" src={print.image} alt="" loading="lazy" />}
			<p class="print-body">{print.body}</p>

			<footer class="print-foot">
				<span>№ {print.number}</span>
				<time datetime={print.printedAt}>{stamp}</time>
			</footer>
			<div class="print-tail">
				<div class="print-barcode" aria-hidden="true">
					{barcode(print.number).map((item, index) => (
						<i
							key={index}
							class={`${item.bar ? "bar" : ""}${item.wide ? " wide" : ""}`}
						/>
					))}
				</div>
				<span class="print-thanks">thank you ♡</span>
			</div>
		</printCardStyles.article>
	);
}
