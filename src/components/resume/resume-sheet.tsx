// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css } from "@404/aether";
import { media, radius, spacing } from "~/tokens";
import { displayUrl, formatPeriod, type ResumeDocument } from "~/services/resume/mod.ts";
import {
	RESUME_COLOUR,
	RESUME_GAP,
	RESUME_LEADING,
	RESUME_PAGE,
	RESUME_SIZE,
} from "~/services/resume/style.ts";

export interface ResumeSheetProps {
	document: ResumeDocument;
}

const Styled = css`
	:scope {
		box-sizing: border-box;
		width: 100%;
		max-width: ${RESUME_PAGE.width}pt;
		min-height: ${RESUME_PAGE.height}pt;
		margin: 0 auto;
		padding: ${RESUME_PAGE.marginY}pt ${RESUME_PAGE.marginX}pt ${RESUME_PAGE.marginY /
			2}pt;
		display: flex;
		flex-direction: column;
		border-radius: ${radius.lg};
		background: ${RESUME_COLOUR.paper};
		color: ${RESUME_COLOUR.text};
		font-size: ${RESUME_SIZE.body}pt;
		line-height: ${RESUME_LEADING};
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 12px 32px rgba(0, 0, 0, 0.12);
		color-scheme: light;
	}

	:scope a {
		color: inherit;
		text-decoration: none;
	}

	:scope a:hover,
	:scope a:focus-visible {
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.sheet-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 24pt;
		padding-bottom: 10pt;
		border-bottom: 0.8pt solid ${RESUME_COLOUR.rule};
	}

	.sheet-name {
		font-size: ${RESUME_SIZE.name}pt;
		font-weight: 700;
		line-height: ${RESUME_LEADING};
	}

	.sheet-headline {
		margin-top: 2pt;
		font-size: ${RESUME_SIZE.headline}pt;
		color: ${RESUME_COLOUR.subtext};
	}

	.sheet-contact {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		flex-shrink: 0;
		margin: 1pt 0 0;
		padding: 0;
		list-style: none;
		font-size: ${RESUME_SIZE.small}pt;
		color: ${RESUME_COLOUR.muted};
		text-align: right;
	}

	.sheet-section {
		margin-top: ${RESUME_GAP.section}pt;
	}

	.sheet-heading {
		padding-bottom: 3pt;
		margin-bottom: ${RESUME_GAP.heading}pt;
		border-bottom: 0.6pt solid ${RESUME_COLOUR.rule};
		font-size: ${RESUME_SIZE.heading}pt;
		font-weight: 600;
	}

	.sheet-paragraph {
		color: ${RESUME_COLOUR.subtext};
	}

	.sheet-entries {
		display: flex;
		flex-direction: column;
		gap: ${RESUME_GAP.entry}pt;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.sheet-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12pt;
	}

	.sheet-row-small {
		font-size: ${RESUME_SIZE.small}pt;
		color: ${RESUME_COLOUR.muted};
	}

	.sheet-entry-title {
		font-weight: 600;
	}

	.sheet-row-end {
		flex-shrink: 0;
		font-size: ${RESUME_SIZE.small}pt;
		color: ${RESUME_COLOUR.muted};
		white-space: nowrap;
	}

	.sheet-entry-summary {
		margin-top: 3pt;
		color: ${RESUME_COLOUR.subtext};
	}

	.sheet-entry-highlights {
		margin: 3pt 0 0;
		padding: 0;
		list-style: none;
		color: ${RESUME_COLOUR.subtext};
	}

	.sheet-entry-highlights li {
		position: relative;
		padding-left: ${RESUME_GAP.bullet}pt;
	}

	.sheet-entry-highlights li::before {
		content: "•";
		position: absolute;
		left: 1pt;
		color: ${RESUME_COLOUR.muted};
	}

	.sheet-facts {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: ${RESUME_GAP.paragraph}pt 16pt;
		margin: 0;
	}

	.sheet-facts dt {
		font-weight: 600;
	}

	.sheet-facts dd {
		margin: 0;
		color: ${RESUME_COLOUR.subtext};
	}

	.sheet-footer {
		display: flex;
		justify-content: flex-end;
		gap: 12pt;
		margin-top: auto;
		padding-top: ${RESUME_GAP.section}pt;
		font-size: ${RESUME_SIZE.small}pt;
		color: ${RESUME_COLOUR.muted};
	}

	${media.mobile} {
		:scope {
			padding: ${spacing[6]} ${spacing[4]} ${spacing[4]};
			min-height: 0;
		}

		.sheet-head {
			flex-direction: column;
			gap: ${spacing[2]};
		}

		.sheet-contact {
			align-items: flex-start;
			text-align: left;
		}

		.sheet-row {
			flex-direction: column;
			gap: 0;
		}

		.sheet-facts {
			grid-template-columns: 1fr;
			gap: 2pt;
		}

		.sheet-facts dd {
			margin-bottom: ${RESUME_GAP.paragraph}pt;
		}
	}
`;

interface EntryProps {
	title: string;
	href?: string;
	end?: string;
	subtitle?: string;
	subtitleEnd?: string;
	summary?: string;
	highlights?: string[];
}

function Entry(
	{ title, href, end, subtitle, subtitleEnd, summary, highlights }: EntryProps,
) {
	return (
		<li>
			<div class="sheet-row">
				<span class="sheet-entry-title">
					{href
						? <a href={href} target="_blank" rel="noopener noreferrer">{title}</a>
						: title}
				</span>
				{end && <span class="sheet-row-end">{end}</span>}
			</div>
			{(subtitle || subtitleEnd) && (
				<div class="sheet-row sheet-row-small">
					<span>{subtitle}</span>
					{subtitleEnd && <span class="sheet-row-end">{subtitleEnd}</span>}
				</div>
			)}
			{summary && <p class="sheet-entry-summary">{summary}</p>}
			{highlights && highlights.length > 0 && (
				<ul class="sheet-entry-highlights">
					{highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
				</ul>
			)}
		</li>
	);
}

function SheetSection({ title, children }: { title: string; children?: unknown }) {
	return (
		<section class="sheet-section" aria-label={title}>
			<h2 class="sheet-heading">{title}</h2>
			{children}
		</section>
	);
}

function Facts({ entries }: { entries: Array<[string, string]> }) {
	return (
		<dl class="sheet-facts">
			{entries.map(([label, value]) => (
				<>
					<dt key={`${label}-label`}>{label}</dt>
					<dd key={`${label}-value`}>{value}</dd>
				</>
			))}
		</dl>
	);
}

export default function ResumeSheet({ document }: ResumeSheetProps) {
	const site = document.links.find((link) => !link.href.startsWith("mailto:"));

	return (
		<Styled.article aria-labelledby="resume-name">
			<header class="sheet-head">
				<div>
					<h1 class="sheet-name" id="resume-name">{document.name}</h1>
					<p class="sheet-headline">{document.headline}</p>
				</div>
				<ul class="sheet-contact">
					{document.links.map((link) => (
						<li key={link.href}>
							<a href={link.href}>{displayUrl(link.label)}</a>
						</li>
					))}
					{document.location && <li>{document.location}</li>}
				</ul>
			</header>

			<SheetSection title="Career goal">
				<p class="sheet-paragraph">{document.goal}</p>
			</SheetSection>

			{document.experience.length > 0 && (
				<SheetSection title="Experience">
					<ul class="sheet-entries">
						{document.experience.map((entry) => (
							<Entry
								key={`${entry.role}${entry.start}`}
								title={entry.role}
								href={entry.url}
								end={formatPeriod(entry)}
								subtitle={entry.organisation}
								subtitleEnd={entry.location}
								summary={entry.summary}
								highlights={entry.highlights}
							/>
						))}
					</ul>
				</SheetSection>
			)}

			{document.projects.length > 0 && (
				<SheetSection title="Projects">
					<ul class="sheet-entries">
						{document.projects.map((project) => (
							<Entry
								key={project.url}
								title={project.name}
								href={project.url}
								end={project.stack}
								subtitle={project.kind}
								subtitleEnd={displayUrl(project.url)}
								summary={project.summary}
								highlights={project.highlights}
							/>
						))}
					</ul>
				</SheetSection>
			)}

			{document.education.length > 0 && (
				<SheetSection title="Education">
					<ul class="sheet-entries">
						{document.education.map((entry) => (
							<Entry
								key={`${entry.degree}${entry.start}`}
								title={entry.degree}
								end={formatPeriod(entry)}
								subtitle={entry.institution}
								subtitleEnd={entry.location}
								summary={entry.summary}
							/>
						))}
					</ul>
				</SheetSection>
			)}

			{document.skills.length > 0 && (
				<SheetSection title="Technical skills">
					<Facts
						entries={document.skills.map((
							group,
						) => [group.label, group.items.join(", ")])}
					/>
				</SheetSection>
			)}

			{document.languages.length > 0 && (
				<SheetSection title="Spoken languages">
					<Facts
						entries={document.languages.map((
							language,
						) => [language.name, language.level])}
					/>
				</SheetSection>
			)}

			<footer class="sheet-footer">
				<span>{document.name}</span>
				{site && <span>{displayUrl(site.href)}</span>}
			</footer>
		</Styled.article>
	);
}
