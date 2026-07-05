/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css, Head } from "@404/imouto";
import { boundaries, fontSize, Layout, spacing, theme } from "~/layout.tsx";
import Hero from "~/components/home/Heading.tsx";
import Heading from "~/components/ui/Heading.tsx";
import Projects from "~/components/content/Projects.tsx";
import FeaturedSong from "~/components/content/FeaturedSong.tsx";
import RecentTracks from "~/components/content/RecentTracks.tsx";
import PropertyTable from "~/components/ui/PropertyTable.tsx";
import Footer from "~/components/layout/Footer.tsx";
import { songs } from "~/content/songs.ts";
import { projects } from "~/content/projects.ts";
import { lastfm, tracks } from "~/services/lastfm.ts";
import { friends } from "~/content/friends.ts";
import CollapsibleParagraph from "~/components/ui/CollapsibleParagraph.tsx";
import ButtonWall from "~/components/home/ButtonWall.tsx";

const Styled = css`
	#heading {
		margin-bottom: ${spacing.section};
		position: relative;
	}

	#intro-text-container > p {
		display: inline;
	}

	#read-more-content {
		margin-top: 2ch;
		padding: 0 2ch;
		border-left: 2px solid ${theme.lift};
	}

	@media (min-width: ${boundaries.desktopMinWidth}) {
		section, #heading {
			position: relative;

			&::before {
				position: absolute;
				font-size: 13rem;
				font-weight: 700;
				user-select: none;
				letter-spacing: -0.075em;
				-webkit-text-stroke: 2px ${theme.text};
				color: transparent;
				opacity: 0.025;
				pointer-events: none;
			}
		}

		#heading::before {
			content: ":3";
			font-size: 7rem !important;
			top: 0.1em;
			left: -7rem;
		}

		#intro::before {
			content: "bio";
			right: -8rem;
			top: 2.4rem;
		}

		#projects::before {
			content: "↩";
			transform: rotate(15deg);
			font-size: calc(${fontSize["2xl"]} * 5);
			right: -16rem;
			top: 2rem;
		}

		#donate::before {
			content: "$";
			left: -12.5rem;
			top: 7rem;
		}

		#friends::before {
			content: "<3";
			transform: rotate(15deg);
			font-size: calc(${fontSize["2xl"]} * 5);
			right: -5rem;
			top: 3rem;
		}
	}

	section {
		margin-bottom: ${spacing.section};
	}

	.media {
		list-style: none;
		padding-left: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));

		margin-top: ${spacing[2]};
		gap: ${spacing[2]};

		@media (max-width: ${boundaries.mobileMaxWidth}) {
			grid-template-columns: 1fr;
		}
	}

	.highlight {
		color: ${theme.accent};
	}

	.read-more-checkbox {
		display: none;

		& ~ #read-more-content {
			display: none !important;
		}
		& ~ .read-more-label-collapse {
			display: none;
		}

		&:checked {
			& ~ #read-more-content {
				display: block !important;
			}
			& ~ .read-more-label-expand {
				display: none;
			}
			& ~ .read-more-label-collapse {
				display: inline-block;
			}
		}
	}

	.read-more-btn {
		margin-left: 1ch;
		cursor: pointer;
		text-decoration: none;
		user-select: none;
		font-size: ${fontSize.body};
		color: ${theme.accent};
	}
`;

export default () => {
	return (
		<Layout scope={Styled} selected="home">
			<Head>
				<title>hewo!!</title>
				<link rel="stylesheet" href="/fonts/space-grotesk/import.css" />
			</Head>
			<header class="main" id="heading">
				<Hero />
			</header>
			<section id="intro">
				<Heading>Introduction</Heading>
				<div>
					<p style={{ display: "inline" }}>
						I'm an aspiring computer engineer passionate about open access and well-crafted software. I really love
						linguistics, functional programming, the C programming language, and unconventional TypeScript.
					</p>
					<CollapsibleParagraph id="intro-text-container">
						<p>
							<i>In a more personal tone~</i>{" "}
							I'm especially interested in atypical low-level systems and the intersection of hardware and software
							interface, with a particular fascination for the x86 and RISC-V ISAs, and I love finding elegant solutions
							in places most people don't bother to look at.
						</p>
						<p>
							I'm passionate about linguistics and philosophy, and I love meeting new people to learn from their
							different perspectives!! I'm autistic, so I might struggle with tone time to time. Still, I really enjoy
							befriending new people and growing as a person every single day!!! If you've read this far, thanks for
							stopping by and getting to know me a bit ^-^
						</p>
						<p>
							<i>Ummm…</i> this site is powered by{" "}
							<a href="/~snarl">snarl</a>, my own web framework, built on the principle that the best way to understand
							something is to build it yourself and have fun doing it. Go check it out!!!111!
						</p>
					</CollapsibleParagraph>
				</div>
			</section>
			<section id="song">
				<Heading>Current favourite songs</Heading>
				<ul class="media">
					{songs.map((song) => (
						<li>
							<FeaturedSong {...song} />
						</li>
					))}
				</ul>
			</section>
			<section id="projects">
				<Heading>Projects</Heading>
				<Projects
					projects={projects}
				/>
			</section>
			<section id="fm">
				<Heading>Recently listened</Heading>
				<RecentTracks tracks={tracks() ?? []} cutoff={4} profileUrl={`https://last.fm/user/${lastfm.user}`} />
			</section>
			<section id="friends">
				<Heading>{"Friends &lt;3"}</Heading>
				<p>Precious friendships; from the bottom of my heart, I am genuinely grateful for their existence~</p>
				<ButtonWall buttons={friends} />
			</section>
			<section id="donate">
				<Heading>Piggy bank</Heading>
				<p>
					If you enjoy throwing money at people on the internet, please consider me to help keep my projects alive and
					help me navigate some rough financial patches and stay afloat while things are tight (like rn)
				</p>
				<PropertyTable
					data={{
						"GitHub Sponsors": ["adoravel", "https://github.com/sponsors/adoravel"],
						"Ko-Fi": ["west", "https://ko-fi.com/west"],
					}}
				/>
			</section>
			<Footer />
		</Layout>
	);
};
