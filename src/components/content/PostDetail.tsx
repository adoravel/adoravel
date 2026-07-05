/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css } from "@404/imouto";
import { ease, fontFamily, fontSize, radius, spacing, theme } from "~/layout.tsx";
import { type Post } from "~/content/post.ts";
import { type Profile } from "~/services/post.ts";
import { Bluesky, ExternalLink } from "~/components/ui/Icon.tsx";
import { flattenThread, formatPostDate } from "~/util/formatting.ts";
import { PostSegments } from "~/components/content/PostSegments.tsx";

const Styled = css`
	:scope {
		display: flex;
		flex-direction: column;
		max-width: 680px;
		width: 100%;
		margin: 0 auto;
	}

	.thread-item {
		display: flex;
		position: relative;
		animation: detail-slide-up ${ease.reveal} both;
	}

	.thread-item + .thread-item {
		animation-delay: 0.07s;
	}

	@keyframes detail-slide-up {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.thread-item::after {
		content: "";
		position: absolute;
		left: 23px;
		top: 72px;
		width: 2px;
		height: 100%;
		background: ${theme.baseBorder};
		z-index: 0;
	}

	.thread-item:last-child::after {
		top: -10px;
	}

	.thread-node {
		flex-shrink: 0;
		width: 48px;
		display: flex;
		justify-content: center;
		padding-top: ${spacing[3]};
		z-index: 1;
	}

	.pfp-root {
		width: 48px;
		height: 48px;
		border-radius: ${radius.circle};
		background: ${theme.background};
		z-index: 2;
		border: 2px solid ${theme.background};
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		color: ${theme.textMuted};

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.dot-node {
		width: 20px;
		height: 20px;
		background: ${theme.baseBorder};
		border-radius: 50%;
		border: 7px solid ${theme.background};
		transition: background ${ease.fast}, transform ${ease.reveal};
	}

	.thread-item:hover .dot-node {
		background: ${theme.textMuted};
	}

	.thread-content {
		flex: 1;
		min-width: 0;
		padding: ${spacing[2]} ${spacing[3]} ${spacing[2]};
		margin-left: ${spacing[1]};
		border-radius: ${radius.lg};
		transition: background-color ${ease.fast};
	}

	.thread-item:hover .thread-content {
		background-color: ${theme.surfaceHover};
	}

	.header,
	.header a {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: ${spacing[2]};

		&.link::after {
			background-color: ${theme.textMuted};
			margin-left: 0;
		}
	}

	.name {
		font-weight: 700;
		color: ${theme.text};
		font-size: ${fontSize.md};
	}

	.handle {
		color: ${theme.textMuted};
		font-size: ${fontSize.sm};
	}

	.bsky-link {
		margin-left: auto;
		color: ${theme.textMuted};
		opacity: 0.6;
		transition: opacity ${ease.fast}, color ${ease.fast};

		&::after {
			display: none !important;
		}

		&:hover {
			opacity: 1;
			color: ${theme.accent};
		}
	}

	.body {
		display: inline;
		color: ${theme.subtext};
		font-size: ${fontSize.body};
		white-space: pre-wrap;
		word-break: break-word;
	}

	.body a {
		color: ${theme.accent};
		text-decoration: none;
	}

	.body .tl-hashtag {
		color: ${theme.accent};
	}

	.embeds {
		margin-top: ${spacing[3]};
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: ${spacing[2]};
	}

	.embed-img {
		border-radius: ${radius.md};
		border: 1px solid ${theme.baseBorder};
		width: 100%;
		object-fit: cover;
		max-height: 400px;
		background: ${theme.surface};
	}

	.embed-external {
		display: flex;
		align-items: center;
		gap: ${spacing[2]};
		padding: ${spacing[2]} ${spacing[3]};
		background: ${theme.surface};
		border: 1px solid ${theme.baseBorder};
		border-radius: ${radius.md};
		color: ${theme.text};
		font-size: ${fontSize.sm};
		text-decoration: none;
		margin-top: ${spacing[3]};
		overflow: hidden;

		&::after {
			display: none !important;
		}

		&:hover {
			border-color: ${theme.surfaceBorderHover};
		}
	}

	.footer {
		max-height: 0;
		opacity: 0;
		transition: opacity ${ease.fast}, max-height ${ease.fast}, margin ${ease.fast};
		vertical-align: middle;

		font-size: ${fontSize.xs};
		color: ${theme.textMuted};
		font-family: ${fontFamily.misc};
		letter-spacing: ${spacing.letter.misc};
	}

	.thread-item:hover .footer {
		display: inline;
		margin-left: 1.25ch;
		opacity: 1;
	}
`;

export default function PostDetail({ post, profile }: { post: Post; profile: Profile }) {
	const items = flattenThread(post);

	return (
		<Styled.div>
			{items.map((item, index) => {
				const isRoot = index === 0;
				return (
					<div key={item.rkey} class={`thread-item ${isRoot ? "root" : "reply"}`}>
						<div class="thread-node">
							{isRoot
								? (
									<a class="pfp-root" href={profile.url}>
										{profile.avatarUrl
											? <img src={profile.avatarUrl} alt={profile.displayName} />
											: <Bluesky size={20} />}
									</a>
								)
								: <div class="dot-node" />}
						</div>
						<div class="thread-content">
							{isRoot && (
								<div class="header" href={post.url}>
									<a class="link" href={profile.url}>
										<span class="name">{profile.displayName}</span>
										<span class="handle">@{profile.handle}</span>
									</a>
									<a
										class="bsky-link"
										href={post.url}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="View on Bluesky"
									>
										<ExternalLink size={16} />
									</a>
								</div>
							)}
							<div class="body">
								<PostSegments segments={item.segments} />
							</div>
							{item.embed && "images" in item.embed && item.embed?.images && item.embed.images?.length > 0 && (
								<div class="embeds">
									{item.embed.images.map((img) => (
										<img
											key={img.url}
											class="embed-img"
											src={img.url}
											alt={img.alt || "Embedded image"}
											loading="lazy"
										/>
									))}
								</div>
							)}

							{item.embed && "external" in item.embed && item.embed?.external && (
								<a class="embed-external" href={item.embed.external.uri} target="_blank" rel="noopener noreferrer">
									<ExternalLink size={14} />
									<span>{item.embed.external.title || item.embed.external.uri}</span>
								</a>
							)}
							<div class="footer">
								<span class="date">{formatPostDate(item.createdAt)}</span>
							</div>
						</div>
					</div>
				);
			})}
		</Styled.div>
	);
}
