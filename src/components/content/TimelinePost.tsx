/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css } from "@404/imouto";
import { ease, fontFamily, fontSize, radius, spacing, theme } from "~/layout.tsx";
import { type Post } from "~/content/post.ts";
import { type Profile } from "~/services/post.ts";
import { Bluesky } from "~/components/ui/Icon.tsx";
import { flattenThread, formatPostDate } from "~/util/formatting.ts";
import { PostSegments, truncateSegments } from "~/components/content/PostSegments.tsx";

const Styled = css`
	:scope {
		position: relative;
		display: flex;
		flex-direction: column;
		background: ${theme.base};
		border: 1px solid ${theme.baseBorder};
		border-radius: ${radius.lg};
		padding: ${spacing[4]} ${spacing[5]};
		text-decoration: none;
		color: inherit;

		transform: translateY(0px);
		transition:
			transform ${ease.spring},
			box-shadow ${ease.spring},
			border-color ${ease.fast},
			background-color ${ease.fast};

		&:hover {
			border-color: ${theme.surfaceBorderHover};
			background-color: ${theme.surfaceHover};
			transform: translateY(-4px);
			box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
		}
	}

	.post-inner {
		display: flex;
		gap: ${spacing[3]};
	}

	.pfp-wrapper {
		perspective: 600px;
		flex-shrink: 0;
		width: 48px;
		height: 48px;
	}

	.pfp-card {
		position: relative;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		transition: transform ${ease.spring};
		cursor: pointer;
	}

	:scope:hover .pfp-card {
		transform: rotateY(180deg);
	}

	.pfp-face {
		position: absolute;
		inset: 0;
		backface-visibility: hidden;
		border-radius: 50%;
		background: ${theme.surface};
		display: flex;
		align-items: center;
		justify-content: center;
		color: ${theme.textMuted};
		border: 1px solid ${theme.baseBorder};
		overflow: hidden;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.pfp-back {
		transform: rotateY(180deg);
		background: ${theme.lift};
		color: ${theme.textMuted};
	}

	.content-col {
		flex: 1;
		min-width: 0;
	}

	.header {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: ${spacing[1]};
	}

	.name {
		font-weight: 600;
		color: ${theme.text};
		font-size: ${fontSize.md};
	}

	.handle {
		color: ${theme.textMuted};
		font-size: ${fontSize.sm};
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
		&::after {
			display: none !important;
		}
	}

	.body .tl-hashtag {
		color: ${theme.accent};
	}

	.thread-indicator {
		display: inline-flex;
		align-items: center;
		vertical-align: middle;
		gap: ${spacing[2]};
		margin-left: 1ch;
		color: ${theme.accent};
		font-size: ${fontSize.sm};
		font-weight: 500;

		svg {
			width: 12px;
			height: 12px;
		}
	}

	.footer {
		display: flex;
		align-items: center;
		gap: ${spacing[3]};
		margin-top: ${spacing[3]};
		padding-top: ${spacing[2]};
		border-top: 1px solid ${theme.baseBorder};
		font-size: ${fontSize.xs};
		color: ${theme.textMuted};
		font-family: ${fontFamily.misc};
		letter-spacing: ${spacing.letter.misc};
	}
`;

function Knot() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<title>More posts</title>
			<g id="bowknot_line" fill="none" fill-rule="evenodd">
				<path d="M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z" />
				<path
					fill="currentColor"
					d="M19.09 4.668c.822.747 1.692 1.993 2.24 4.038.548 2.044.418 3.558.079 4.617-.518 1.617-2.209 1.902-3.353 1.668l-2.043-.418c.304.672.394 1.416.42 2.004.01.207.012.418.008.623l-.013.401-.022.375-.073.901a1 1 0 0 1-.475.797l-2.694 1.656c-.713.438-1.643-.183-1.511-1.01.108-.677.216-1.355.263-2.04-.552.631-1.206 1.143-1.827 1.7a1 1 0 0 1-.9.228l-3.076-.735c-.814-.194-1.032-1.29-.355-1.782l.595-.43c.696-.508 1.385-1.05 1.917-1.721.16-.203.25-.406.326-.62l.166-.506-2.818.577c-1.144.234-2.835-.05-3.353-1.668-.339-1.059-.469-2.572.079-4.617.548-2.045 1.418-3.29 2.24-4.038 1.258-1.142 2.864-.543 3.738.232l2.505 2.221a3.002 3.002 0 0 1 1.694 0L15.352 4.9c.874-.775 2.48-1.374 3.737-.232ZM13 14.253c.033.378.248.774.443 1.092.275.448.395.976.45 1.447.053.458.054.935.03 1.395l-.021.341.475-.291c.04-.449.084-.982.058-1.57-.036-.802-.204-1.316-.433-1.565l-.064-.061zm-2.038.135c-.182.32-.329.671-.42 1.051-.121.511-.41.97-.705 1.342a8.5 8.5 0 0 1-.964 1.008l-.257.226.542.13c.345-.29.754-.635 1.151-1.07.591-.646.829-1.16.799-1.501-.035-.4-.067-.792-.146-1.186m5.716-7.992-2.184 1.937c.233.348.395.748.465 1.178l.815-.218a1 1 0 0 1 .518 1.932l-1.35.362a2.979 2.979 0 0 1-.223.68l3.737.765c.328.067.918.084 1.047-.319.209-.653.354-1.773-.106-3.49-.46-1.716-1.145-2.613-1.653-3.075-.314-.284-.815.026-1.066.248M6.255 6.15c-.508.46-1.193 1.358-1.653 3.075-.46 1.716-.315 2.836-.106 3.49.13.402.719.385 1.047.318l3.737-.765a2.978 2.978 0 0 1-.223-.68l-1.35-.362a1 1 0 0 1 .518-1.932l.815.218c.07-.43.232-.83.465-1.178L7.321 6.396c-.25-.222-.752-.532-1.066-.247ZM12 9a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1"
				/>
			</g>
		</svg>
	);
}

export default function TimelinePost({ post, profile }: { post: Post; profile: Profile }) {
	const hasReplies = post.replies && post.replies.length > 0;
	const items = flattenThread(post);

	return (
		<Styled.div>
			<div class="post-inner">
				<a class="pfp-wrapper" href={profile.url}>
					<div class="pfp-card">
						<div class="pfp-face">
							{profile.avatarUrl ? <img src={profile.avatarUrl} alt={profile.displayName} /> : <Bluesky size={20} />}
						</div>
						<div class="pfp-face pfp-back">
							<Bluesky size={20} />
						</div>
					</div>
				</a>
				<a class="content-col" href={`/reports/${post.rkey}`}>
					<div class="header">
						<span class="name">{profile.displayName}</span>
						<span class="handle">@{profile.handle ?? "handle.invalid"}</span>
					</div>
					<div class="body">
						<PostSegments segments={truncateSegments(post.segments)} stopPropagation />
					</div>
					{hasReplies && (
						<div class="thread-indicator">
							<Knot />
							{items.length - 1} more {(items.length - 1) === 1 ? "skeet" : "more skeets"} in this thread
						</div>
					)}
				</a>
			</div>
			<div class="footer">
				<span class="date">{formatPostDate(post.createdAt)}</span>
			</div>
		</Styled.div>
	);
}
