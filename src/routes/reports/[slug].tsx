/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css, Head } from "@404/imouto";
import { boundaries, ease, fontFamily, fontSize, Layout, radius, spacing, theme } from "~/layout.tsx";
import Footer from "~/components/layout/Footer.tsx";
import PostDetail from "~/components/content/PostDetail.tsx";
import { getPost as getBskyPost, getProfile } from "~/services/post.ts";
import { getPost as getBlogPost } from "~/services/blog.ts";
import type { Context } from "@july/snarl";

const Styled = css`
	.progress {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: ${theme.accentDim};
		transform-origin: 0 0;
		z-index: 100;
		animation: read-progress linear both;
		animation-timeline: scroll(root block);

		@supports not (animation-timeline: scroll(root block)) {
			display: none;
		}

		@media (max-width: ${boundaries.mobileMaxWidth}) {
			display: none;
		}
	}

	@keyframes read-progress {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}

	[data-footnote-ref], [data-footnote-backref] {
		margin-left: 0.2ch;
		font-weight: 800;

		&::after {
			display: none;
		}
	}

	.back {
		display: inline-flex;
		align-items: center;
		gap: ${spacing[1]};
		font-size: ${fontSize.sm};
		color: ${theme.textMuted};
		text-decoration: none;
		margin-bottom: ${spacing.section};
		transition: color ${ease.fast}, transform ${ease.spring};
	}

	.back:hover {
		color: ${theme.accent};
		transform: translateX(-4px);
	}

	.back::after {
		display: none !important;
	}

	.post-header {
		margin-bottom: ${spacing[8]};
	}

	.post-date {
		display: block;
		font-family: ${fontFamily.misc};
		font-size: ${fontSize.xs};
		letter-spacing: ${spacing.letter.plus};
		text-transform: uppercase;
		color: ${theme.textMuted};
		margin-bottom: ${spacing[3]};
	}

	.post-title {
		font-size: ${fontSize["3xl"]};
		font-weight: 800;
		letter-spacing: ${spacing.letter.tight};
		line-height: 1.08;
		color: ${theme.text};
		margin-bottom: ${spacing[4]};

		@media (max-width: ${boundaries.mobileMaxWidth}) {
			font-size: ${fontSize["2xl"]};
		}
	}

	.post-description {
		font-size: ${fontSize.lg};
		color: ${theme.subtext};
		line-height: 1.65;
		margin-bottom: ${spacing[5]};
	}

	.post-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: ${spacing[3]};
		padding-top: ${spacing[3]};
		border-top: 1px solid ${theme.baseBorder};
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: ${spacing[1]};
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.tag {
		padding: ${spacing.pill};
		font-size: ${fontSize.xs};
		font-family: ${fontFamily.misc};
		letter-spacing: ${spacing.letter.misc};
		background: ${theme.surface};
		color: ${theme.text};
		border-radius: ${radius.circle};
		line-height: 1.75;
		text-decoration: none;
		transition: filter ${ease.fast}, transform ${ease.spring};
	}

	.tag:hover {
		filter: brightness(1.25);
		transform: translateY(-2px);
	}

	.tag::after {
		display: none !important;
	}

	.reading-time {
		margin-left: auto;
		font-size: ${fontSize.xs};
		font-family: ${fontFamily.misc};
		color: ${theme.textMuted};
	}

	.prose :is(h2, h3, h4) {
		font-weight: 700;
		letter-spacing: ${spacing.letter.tight};
		color: ${theme.text};
		line-height: 1.2;
		margin-top: 2.5em;
		margin-bottom: 0.6em;
	}

	.prose h2 {
		font-size: ${fontSize.xl};
	}
	.prose h3 {
		font-size: ${fontSize.lg};
	}
	.prose h4 {
		font-size: ${fontSize.base};
	}

	.prose p {
		font-size: ${fontSize.body};
		color: ${theme.subtext};
		line-height: 1.85;
		margin-bottom: 1.25em;
	}

	.prose strong {
		color: ${theme.text};
		font-weight: 600;
	}
	.prose em {
		color: ${theme.subtext};
	}

	.prose a {
		color: ${theme.accent};
	}

	.prose blockquote {
		border-left: 2px solid ${theme.accent};
		padding: ${spacing[2]} ${spacing[4]};
		margin: ${spacing[6]} 0;
		color: ${theme.textMuted};
		background: ${theme.base};
		border-radius: 0 ${radius.md} ${radius.md} 0;
	}

	.prose blockquote p:last-of-type {
		margin-bottom: 0;
	}

	.prose hr {
		border: none;
		border-top: 1px solid ${theme.baseBorder};
		margin: ${spacing[8]} 0;
	}

	.prose pre {
		background: ${theme.base};
		border: 1px solid ${theme.baseBorder};
		border-radius: ${radius.lg};
		padding: ${spacing[4]} ${spacing[5]};
		overflow-x: auto;
		margin: ${spacing[4]} 0;
		font-family: ${fontFamily.misc};
		font-size: ${fontSize.sm};
		line-height: 1.7;
	}

	.prose code:not(pre > code) {
		background: ${theme.base};
		border: 1px solid ${theme.baseBorder};
		border-radius: ${radius.sm};
		padding: 1px 5px;
		font-family: ${fontFamily.misc};
		font-size: 0.88em;
		color: ${theme.onAccent};
	}

	.prose img {
		border-radius: ${radius.lg};
		max-width: 100%;
		border: 1px solid ${theme.baseBorder};
	}

	.prose :is(ul, ol) {
		padding-left: ${spacing[6]};
		color: ${theme.subtext};
		font-size: ${fontSize.body};
		margin-bottom: 1.25em;
	}

	.prose li {
		margin-bottom: 0.4em;
	}

	.not-found {
		text-align: center;
		padding: ${spacing[16]} 0;
	}

	.not-found-glyph {
		font-family: ${fontFamily.misc};
		display: block;
		font-size: 4rem;
		color: ${theme.textMuted};
		opacity: 0.35;
		margin-bottom: -${spacing[4]};
	}

	.not-found-title {
		font-size: ${fontSize["2xl"]};
		font-weight: 800;
		letter-spacing: ${spacing.letter.tight};
		color: ${theme.text};
	}

	.draft {
		user-select: none;
		pointer-events: none;
		vertical-align: middle;
		text-transform: uppercase;
		font-size: ${fontSize.xl};
		margin-left: ${spacing[3]};
		color: ${theme.textMuted};
		background-color: ${theme.surface};
		border-radius: ${radius.circle};
		padding: ${spacing.pill};
	}
`;

function formatDate(input: Date) {
	return input.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export default (ctx: Context) => {
	const { slug } = ctx.params as { slug: string };
	const post = getBlogPost(slug);

	const bskyPost = !post ? getBskyPost(slug) : undefined;
	const bskyProfile = bskyPost ? getProfile() : undefined;

	if (bskyPost && bskyProfile) {
		const description = bskyPost.text.length > 150 ? bskyPost.text.slice(0, 147) + "…" : bskyPost.text;
		const imageUrl = bskyProfile.avatarUrl;
		const title = `${bskyProfile.displayName} on kyu.re`;

		return (
			<Layout scope={Styled} selected="reports">
				<Head>
					<title>{bskyPost.text.slice(0, 30)}... :: kyu.re</title>
					<meta name="description" content={description} />
					<meta property="og:title" content={title} />
					<meta property="og:description" content={description} />
					<meta property="og:type" content="article" />
					{imageUrl && <meta property="og:image" content={imageUrl} />}
					<meta property="og:image:alt" content={`${bskyProfile.displayName}'s avatar`} />
					<meta name="twitter:card" content={imageUrl ? "summary" : "summary_large_image"} />
					<meta name="twitter:title" content={title} />
					<meta name="twitter:description" content={description} />
					{imageUrl && <meta name="twitter:image" content={imageUrl} />}
				</Head>
				<div class="progress" aria-hidden="true" />
				<a class="back" href="/reports">← reports</a>
				<article>
					<PostDetail post={bskyPost} profile={bskyProfile} />
				</article>
				<Footer />
			</Layout>
		);
	}

	if (!post) {
		return new Response(
			"<!DOCTYPE html>" + (
				<Layout scope={Styled}>
					<head>
						<title>not found :: kyu.re</title>
					</head>
					<div class="not-found">
						<span class="not-found-glyph">404</span>
						<h1 class="not-found-title">post not found</h1>
						<a class="back" href="/reports">← back to reports</a>
					</div>
				</Layout>
			),
			{ status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } },
		);
	}

	return (
		<Layout scope={Styled} selected="reports">
			<Head>
				<title>{post.title} :: kyu.re</title>
				<meta name="description" content={post.summary} />
				<meta property="og:title" content={post.title} />
				<meta property="og:description" content={post.summary} />
				<meta property="og:type" content="article" />
				<meta property="article:published_time" content={post.createdAt.toISOString()} />
				{post.updatedAt && <meta property="article:modified_time" content={post.updatedAt.toISOString()} />}
				{post.tags.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}
				<meta name="twitter:card" content={post.cover ? "summary_large_image" : "summary"} />
				<meta name="twitter:title" content={post.title} />
				<meta name="twitter:description" content={post.summary} />
			</Head>
			<div class="progress" aria-hidden="true" />
			<a class="back" href="/reports">← reports</a>
			<article>
				<header class="post-header main">
					<span class="post-date">{formatDate(post.createdAt)}</span>
					<h1 class="post-title">
						{post.title}
						{post.visibility === "draft" && <span class="draft">draft</span>}
					</h1>
					<p class="post-description">{post.summary}</p>
					<div class="post-meta">
						<ul class="tags">
							{post.tags.map((tag) => (
								<li key={tag}>
									<a class="tag" href={`/reports?tag=${encodeURIComponent(tag)}`}>{tag}</a>
								</li>
							))}
						</ul>
						<span class="reading-time">{post.readingTime} min read</span>
					</div>
				</header>
				<div class="prose" dangerouslySetInnerHTML={{ __html: post.parsed.html }} />
			</article>
			<Footer />
		</Layout>
	);
};
