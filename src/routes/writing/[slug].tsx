// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css, Head } from "@404/aether";
import type { Context } from "@july/snarl";
import { boundaries, ease, fontSize, media, spacing, theme } from "~/tokens";
import SiteHeader from "~/components/layout/site-header.tsx";
import Prose from "~/components/ui/prose.tsx";
import { ArrowLeft } from "~/components/ui/icon.tsx";
import DraftBadge from "~/components/ui/draft-badge.tsx";
import { setFooter } from "~/components/layout/footer-state.ts";
import { thoughts } from "~/markdown/mod.ts";
import { pageTitle, routes, site } from "~/config/site.ts";

const Styled = css`
	:scope {
		display: flex;
		flex-direction: column;
		gap: ${spacing[6]};
	}

	.post-crumb {
		display: inline-flex;
		align-items: center;
		gap: ${spacing[1]};
		align-self: flex-start;
		font-size: ${fontSize.sm};
		color: ${theme.textMuted};
		transition: color ${ease.hover};
	}

	.post-crumb:hover,
	.post-crumb:focus-visible {
		color: ${theme.accent};
	}

	.post-crumb-arrow {
		transform: translate3d(0, 0, 0);
		transition: transform ${ease.hover};
		will-change: transform;
	}

	.post-crumb:hover .post-crumb-arrow,
	.post-crumb:focus-visible .post-crumb-arrow {
		transform: translate3d(-2px, 0, 0);
	}

	.post-header {
		display: flex;
		flex-direction: column;
		gap: ${spacing[2]};
		max-width: ${boundaries.contentWidth};
	}

	.post-title {
		font-size: ${fontSize["2xl"]};
		font-weight: 600;
		letter-spacing: ${spacing.letter.tight};
		line-height: 1.2;
		color: ${theme.text};
	}

	.post-lede {
		font-size: ${fontSize.base};
		line-height: 1.6;
		color: ${theme.subtext};
	}

	.post-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: ${spacing[1]} ${spacing[2]};
		margin-top: ${spacing[1]};
		font-size: ${fontSize.sm};
		color: ${theme.textMuted};
	}

	.post-tags {
		display: inline-flex;
		flex-wrap: wrap;
		gap: ${spacing[2]};
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.post-body {
		max-width: ${boundaries.contentWidth};
		padding-top: ${spacing[2]};
	}

	${media.reducedMotion} {
		.post-crumb-arrow {
			transition: none;
			transform: none !important;
		}
	}
`;

const dateFormatter = new Intl.DateTimeFormat(site.locale, {
	year: "numeric",
	month: "short",
	day: "numeric",
});

export default async function WritingPost(ctx: Context) {
	const { slug } = ctx.params as { slug: string };
	const canonical = thoughts.canonicalSlug(slug);
	if (canonical !== slug) return ctx.redirect(routes.writing(canonical), 301);

	const post = await thoughts.get(canonical);
	if (!post) return new Response(null, { status: 404 });

	const { frontmatter } = post;
	const lede = frontmatter.summary ?? frontmatter.description;
	const createdAt = frontmatter.createdAt.toISOString();
	const tags = frontmatter.tags ?? [];
	const draft = frontmatter.visibility === "draft";

	setFooter(ctx, { lead: { href: "#content", label: "Back to top", arrow: "up" } });

	return (
		<main id="content">
			<Head>
				<title>
					{pageTitle(draft ? `[draft] ${frontmatter.title}` : frontmatter.title)}
				</title>
				{draft && <meta name="robots" content="noindex" />}
				{lede && <meta name="description" content={lede} />}
				<meta property="og:title" content={frontmatter.title} />
				<meta property="og:type" content="article" />
				<meta property="article:published_time" content={createdAt} />
			</Head>
			<SiteHeader current="more" />

			<Styled.article aria-labelledby="post-title">
				<a class="post-crumb" href={routes.more}>
					<ArrowLeft class="post-crumb-arrow" size={14} strokeWidth={2.5} />
					go back
				</a>

				<header class="post-header">
					<h1 class="post-title" id="post-title">{frontmatter.title}</h1>
					{lede && <p class="post-lede">{lede}</p>}
					<div class="post-meta">
						{draft && (
							<>
								<DraftBadge />
								<span aria-hidden="true">·</span>
							</>
						)}
						<time datetime={createdAt}>
							{dateFormatter.format(frontmatter.createdAt)}
						</time>
						<span aria-hidden="true">·</span>
						<span>{post.readingTime} min read</span>
						{tags.length > 0 && (
							<>
								<span aria-hidden="true">·</span>
								<ul class="post-tags" aria-label="Tags">
									{tags.map((tag) => <li key={tag}>#{tag}</li>)}
								</ul>
							</>
						)}
					</div>
				</header>

				<Prose class="post-body">{post.render()}</Prose>
			</Styled.article>
		</main>
	);
}
