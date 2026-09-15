// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Context } from "@july/snarl";
import SiteHeader from "~/components/layout/site-header.tsx";
import { setFooter } from "~/components/layout/footer-state.ts";
import Section from "~/components/layout/section.tsx";
import Prose from "~/components/ui/prose.tsx";
import Link from "~/components/ui/link.tsx";
import { GitHubIcon, LastFmIcon } from "~/components/ui/icon.tsx";
import Projects from "~/components/activity/projects.tsx";
import RecentTracks from "~/components/activity/recent-tracks.tsx";
import RecentThoughts from "~/components/activity/recent-thoughts.tsx";
import { recentTracks } from "~/services/lastfm/mod.ts";
import { repositories } from "~/services/github/mod.ts";
import { thoughts } from "~/markdown/mod.ts";
import { routes, site } from "~/config/site.ts";

const RECENT_THOUGHTS = 4;

export default async function Home(ctx: Context) {
	setFooter(ctx, { buttons: true });

	const [tracks, projects, summaries] = await Promise.all([
		recentTracks.ready.then(recentTracks.get),
		repositories.ready.then(repositories.get),
		thoughts.summaries(RECENT_THOUGHTS),
	]);

	return (
		<main id="content">
			<SiteHeader current="about" />

			<Section title={`Hi, I'm Lívia! :3`}>
				<Prose>
					<p>{site.bio}</p>
				</Prose>
			</Section>

			{projects && projects.length > 0 && (
				<Section
					title="Projects"
					action={
						<Link href={site.github.profileUrl}>
							<GitHubIcon class="link-icon" />
							See more on GitHub
						</Link>
					}
				>
					<Projects repositories={projects} />
				</Section>
			)}

			{tracks && tracks.length > 0 && (
				<Section
					title="Listening history"
					action={
						<Link href={site.lastfm.profileUrl}>
							<LastFmIcon class="link-icon" />
							See more on Last.fm
						</Link>
					}
				>
					<RecentTracks tracks={tracks} />
				</Section>
			)}

			{summaries.length > 0 && (
				<Section
					title="Recent write-ups"
					action={<Link href={routes.more}>See more</Link>}
				>
					<RecentThoughts thoughts={summaries} />
				</Section>
			)}
		</main>
	);
}
