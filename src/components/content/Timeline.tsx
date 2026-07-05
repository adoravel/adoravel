/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css } from "@404/imouto";
import { ease, radius, spacing, theme } from "~/layout.tsx";
import TimelinePost from "~/components/content/TimelinePost.tsx";
import type { Post } from "~/content/post.ts";
import type { Profile } from "~/services/post.ts";

interface Props {
	posts: Post[];
	profile: Profile;
}

const Styled = css`
	:scope {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: ${spacing[3]};
		padding-left: ${spacing[6]};
		margin-left: ${spacing[2]};
		border-left: 2px solid ${theme.baseBorder};
	}

	:scope > * {
		position: relative;
	}

	:scope > *::before {
		content: "";
		position: absolute;
		left: calc(-${spacing[6]} - 10px);
		top: ${spacing[5]};
		width: 16px;
		height: 16px;
		border-radius: ${radius.circle};
		background: ${theme.baseBorder};
		border: 6px solid ${theme.background};
		z-index: 1;
		transition: background ${ease.spring};
	}

	:scope > *:hover::before {
		background: ${theme.accent};
	}
`;

export default function Timeline({ posts, profile }: Props) {
	if (!posts || posts.length === 0) return null;
	return (
		<Styled.div>
			{posts.map((post) => <TimelinePost key={post.rkey} post={post} profile={profile} />)}
		</Styled.div>
	);
}
