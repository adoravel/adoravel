/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css, Head } from "@404/imouto";
import { boundaries, ease, fontSize, Layout, radius, spacing, theme } from "~/layout.tsx";
import Heading from "~/components/ui/Heading.tsx";
import Footer from "~/components/layout/Footer.tsx";
import { BlogCard } from "~/components/content/BlogCard.tsx";
import { filterPostsByTag, getPosts as getPosts, getTags } from "~/services/blog.ts";
import { getPosts as getBskyPosts, getProfile as getBskyProfile } from "~/services/post.ts";

import type { Context } from "@july/snarl";
import Timeline from "~/components/content/Timeline.tsx";

const Styled = css`
	.header-row {
		display: flex;
		align-items: baseline;
		gap: ${spacing[3]};
		margin-bottom: ${spacing[3]};
	}

	.post-count {
		color: ${theme.textMuted};
		font-size: ${fontSize.md};
		font-variant-numeric: tabular-nums;
	}

	.filter-bar {
		display: flex;
		flex-wrap: wrap;
		gap: ${spacing[1]};
		margin-bottom: ${spacing.section};
		list-style: none;
		padding: 0;
	}

	.filter-chip {
		display: inline-flex;
		align-items: center;
		padding: ${spacing[1]} ${spacing[3]};
		font-size: ${fontSize.sm};
		border-radius: ${radius.circle};
		text-decoration: none;
		border: 1px solid ${theme.baseBorder};
		background: ${theme.base};
		color: ${theme.subtext};
		transition:
			color ${ease.fast},
			background-color ${ease.fast},
			border-color ${ease.fast},
			transform ${ease.spring},
			box-shadow ${ease.spring};
	}

	.filter-chip::after {
		display: none !important;
	}

	.filter-chip:hover {
		color: ${theme.text};
		border-color: ${theme.surfaceBorder};
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.filter-chip[data-active="true"] {
		background: ${theme.accentBackground};
		border-color: ${theme.accentDim};
		color: ${theme.onAccent};
	}

	.filter-chip[data-active="true"]:hover {
		box-shadow: 0 4px 16px rgba(166, 181, 247, 0.2);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: ${spacing[3]};

		@media (max-width: ${boundaries.mobileMaxWidth}) {
			grid-template-columns: 1fr;
		}
	}

	.empty {
		grid-column: 1 / -1;
		text-align: center;
		padding: ${spacing[16]} 0;
		color: ${theme.textMuted};
		font-size: ${fontSize.md};
	}

	.empty-symbol {
		display: block;
		font-size: 3rem;
		margin-bottom: ${spacing[3]};
		opacity: 0.4;
	}

	.squiggly-divider {
		height: 12px;
		width: 100%;
		margin: ${spacing.section} 0;
		background-color: ${theme.baseBorder};
		mask-image:
			url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIxMiI+PHBhdGggZD0iTTAgNnE2LTYgMTIgMHQxMiAwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+"),
			linear-gradient(to right, transparent, black 3%, black 97%, transparent);
		mask-composite: intersect;
		mask-repeat: repeat-x;
		mask-position: center;
	}
`;

export default async (ctx: Context) => {
	const tag = ctx.url.searchParams.get("tag");
	let [posts, tags] = await Promise.all([tag ? filterPostsByTag(tag) : getPosts() ?? [], getTags()]);

	posts = [...posts];
	posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

	const drafts = [];
	let index;
	while ((index = posts.findIndex((post) => post.visibility === "draft")) !== -1) {
		drafts.push(posts.splice(index, 1)[0]);
	}

	const bskyPosts = getBskyPosts() ?? [];
	const bskyProfile = getBskyProfile() ?? { displayName: "handle.invalid", handle: "handle.invalid", url: "/" };

	return (
		<Layout scope={Styled} selected="reports">
			<Head>
				<title>{tag ? `#${tag} — ` : ""}reports :: kyu.re</title>
			</Head>
			<div class="header-row">
				<Heading>
					{`${tag ? `#${tag}` : "Reports"}`}
				</Heading>
				<span class="post-count">{posts.length} {posts.length === 1 ? "post" : "posts"}</span>
			</div>

			{tags.length > 0 && (
				<ul class="filter-bar">
					<li>
						<a class="filter-chip" href="/reports" data-active={String(!tag)}>
							all
						</a>
					</li>
					{tags.map((t) => (
						<li key={t}>
							<a
								class="filter-chip"
								href={`/reports?tag=${encodeURIComponent(t)}`}
								data-active={String(t === tag)}
							>
								{t}
							</a>
						</li>
					))}
				</ul>
			)}

			<ul class="main grid" style={{ listStyle: "none", padding: 0 }}>
				{posts.length > 0
					? posts.map((post) => (
						<li key={post.identity.rkey}>
							<BlogCard {...post} />
						</li>
					))
					: (
						<div class="empty">
							<span class="empty-symbol">◌</span>
							{tag ? `nothing tagged #${tag} yet.` : "nothing here yet. check back soon!"}
						</div>
					)}
			</ul>

			{drafts.length > 0 && (
				<>
					<div class="squiggly-divider" aria-hidden="true" />
					<div class="header-row">
						<Heading>Drafts</Heading>
						<span class="post-count">{drafts.length} {drafts.length === 1 ? "draft" : "drafts"}</span>
					</div>
					<ul class="grid" style={{ listStyle: "none", padding: 0 }}>
						{drafts.map((post) => (
							<li key={post.identity.rkey}>
								<BlogCard {...post} />
							</li>
						))}
					</ul>
				</>
			)}

			{!tag && bskyPosts.length > 0 && (
				<>
					<div class="squiggly-divider" aria-hidden="true" />
					<div class="timeline-container">
						<div class="header-row">
							<Heading>Microblogging</Heading>
							<span class="post-count">{bskyPosts.length} {bskyPosts.length === 1 ? "note" : "notes"}</span>
						</div>
						<Timeline posts={bskyPosts} profile={bskyProfile} />
					</div>
				</>
			)}

			<Footer />
		</Layout>
	);
};
