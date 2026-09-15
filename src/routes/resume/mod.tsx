// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css, Head } from "@404/aether";
import { ease, fontSize, media, radius, spacing, theme } from "~/tokens";
import SiteHeader from "~/components/layout/site-header.tsx";
import { Download } from "~/components/ui/icon.tsx";
import ResumeSheet from "~/components/resume/resume-sheet.tsx";
import { buildResume, fileName } from "~/services/resume/mod.ts";
import { pageTitle, routes } from "~/config/site.ts";

const Styled = css`
	:scope {
		display: flex;
		flex-direction: column;
		gap: ${spacing[4]};
	}

	.resume-toolbar {
		display: flex;
		justify-content: flex-end;
	}

	.resume-download {
		display: inline-flex;
		align-items: center;
		gap: ${spacing[2]};
		padding: ${spacing[1]} ${spacing[2]};
		margin: 0 calc(${spacing[2]} * -1);
		border-radius: ${radius.sm};
		font-size: ${fontSize.sm};
		color: ${theme.textMuted};
		text-decoration: none;
		transition: color ${ease.fast}, background-color ${ease.fast};
	}

	.resume-download:hover,
	.resume-download:focus-visible {
		color: ${theme.text};
		background-color: ${theme.surfaceHover};
	}

	.resume-download-icon {
		transform: translate3d(0, 0, 0);
		transition: transform ${ease.hover};
		will-change: transform;
	}

	.resume-download:hover .resume-download-icon,
	.resume-download:focus-visible .resume-download-icon {
		transform: translate3d(0, 2px, 0);
	}

	${media.mobile} {
		.resume-toolbar {
			justify-content: center;
		}
	}

	${media.reducedMotion} {
		.resume-download-icon {
			transition: none;
			transform: none !important;
		}
	}
`;

export default function Resume() {
	const document = buildResume();

	return (
		<main id="content">
			<Head>
				<title>{pageTitle("Résumé")}</title>
				<meta name="description" content={`${document.name}'s résumé`} />
			</Head>
			{/* @ts-ignore */}
			<SiteHeader current="resume" />

			<Styled.div>
				<div class="resume-toolbar">
					<a
						class="resume-download"
						href={routes.resumePdf}
						download={fileName(document)}
					>
						<Download class="resume-download-icon" size={14} strokeWidth={2.25} />
						Download as PDF
					</a>
				</div>
				<ResumeSheet document={document} />
			</Styled.div>
		</main>
	);
}
