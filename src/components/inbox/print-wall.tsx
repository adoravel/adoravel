// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { ease, fontSize, radius, spacing, theme } from "~/tokens";
import AuthorAvatar from "~/components/inbox/author-avatar.tsx";
import { profileUrl } from "~/components/inbox/identity.ts";
import { ArrowUpRight } from "~/components/ui/icon.tsx";
import type { Print } from "~/services/messages/types.ts";

export interface PrintWallProps {
	prints: Print[];
	locale: string;
}

const Styled = css`
	:scope {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
		border: 1px solid ${theme.surfaceBorder};
		border-radius: ${radius.lg};
		overflow: hidden;
	}

	.print + .print {
		border-top: 1px solid ${theme.surfaceBorder};
	}

	.print {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		column-gap: ${spacing[3.5]};
		row-gap: ${spacing[1]};
		padding: ${spacing[4]} ${spacing[5]};
	}

	.print-avatar {
		grid-row: span 3;
		align-self: start;
	}

	.print-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: ${spacing[3]};
		min-width: 0;
	}

	.print-name {
		display: inline-flex;
		align-items: center;
		gap: ${spacing[1]};
		min-width: 0;
		font-size: ${fontSize.md};
		font-weight: 500;
		color: ${theme.text};
		text-decoration: none;
		transition: color ${ease.hover};
	}

	.print-name-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.print-arrow {
		flex-shrink: 0;
		opacity: 0.5;
		transform: translate3d(0, 0, 0);
		transition: transform ${ease.hover}, opacity ${ease.hover};
	}

	a.print-name:hover .print-arrow,
	a.print-name:focus-visible .print-arrow {
		opacity: 1;
		transform: translate3d(1px, -1px, 0);
	}

	a.print-name:hover,
	a.print-name:focus-visible {
		color: ${theme.accent};
	}

	a.print-avatar {
		display: inline-flex;
		border-radius: ${radius.full};
	}

	.print-name small {
		margin-left: ${spacing[1.5]};
		font-size: ${fontSize.xs};
		font-weight: 400;
		color: ${theme.textMuted};
		transition: color ${ease.hover};
	}

	a.print-name:hover small,
	a.print-name:focus-visible small {
		color: ${theme.accent};
	}

	.print-time {
		flex-shrink: 0;
		font-size: ${fontSize.xs};
		color: ${theme.textMuted};
	}

	.print-image {
		display: block;
		max-width: 16rem;
		max-height: 10rem;
		margin-top: ${spacing[2]};
		border: 1px solid ${theme.surfaceBorder};
		border-radius: ${radius.md};
		object-fit: contain;
		background: ${theme.base};
	}

	.print-body:empty {
		display: none;
	}

	.print-body {
		margin: 0;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
		font-size: ${fontSize.sm};
		line-height: 1.6;
		color: ${theme.subtext};
		overflow-wrap: anywhere;
	}
`;

function relativeTime(iso: string, locale: string): string {
	const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
	const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
	if (minutes < 60) return formatter.format(-minutes, "minute");
	const hours = Math.round(minutes / 60);
	if (hours < 24) return formatter.format(-hours, "hour");
	return formatter.format(-Math.round(hours / 24), "day");
}

export default function PrintWall({ prints, locale }: PrintWallProps) {
	const signed = prints.filter((print) => print.author);
	if (!signed.length) return null;

	return (
		<Styled.ul>
			{signed.map((print) => {
				const author = print.author!;
				const href = profileUrl(author);
				const Avatar = href ? "a" : "span";
				const Name = href ? "a" : "span";
				return (
					<li class="print" key={print.id}>
						<Avatar
							class="print-avatar"
							href={href}
							target={href ? "_blank" : undefined}
							rel={href ? "noopener noreferrer" : undefined}
							tabindex={href ? "-1" : undefined}
						>
							<AuthorAvatar author={author} size={36} flip />
						</Avatar>
						<div class="print-head">
							<Name
								class="print-name"
								href={href}
								target={href ? "_blank" : undefined}
								rel={href ? "noopener noreferrer" : undefined}
							>
								<span class="print-name-text">{author.displayName ?? author.handle}</span>
								{author.displayName && author.handle !== author.displayName && (
									<small>@{author.handle}</small>
								)}
								{href && <ArrowUpRight class="print-arrow" size={12} strokeWidth={2.5} />}
							</Name>
							<time class="print-time" datetime={print.printedAt}>
								{relativeTime(print.printedAt, locale)}
							</time>
						</div>
						<p class="print-body">{print.body}</p>
						{print.image && (
							<img class="print-image" src={print.image} alt="" loading="lazy" />
						)}
					</li>
				);
			})}
		</Styled.ul>
	);
}
