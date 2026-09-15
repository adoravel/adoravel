// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { buildResume, fileName } from "~/services/resume/mod.ts";
import { renderResumePdf } from "~/services/resume/pdf.ts";

export default async function Resume() {
	const document = buildResume();

	const bytes = await renderResumePdf(document);
	const name = fileName(document);
	const ascii = name.normalize("NFKD").replace(/[^\x20-\x7e]/g, "");

	return new Response(bytes, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": `inline; filename="${ascii}"; filename*=UTF-8''${
				encodeURIComponent(name)
			}`,
			"Cache-Control": "public, max-age=3600",
		},
	});
}
