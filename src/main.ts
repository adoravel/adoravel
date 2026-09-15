// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { createApp, staticFiles } from "@404/aether";
import { fromFileUrl } from "@std/path/posix/from-file-url";
import { readNumberEnv } from "~/services/core/env.ts";

const app = await createApp({
	routesDir: "./src/routes",
	staticDir: "./static",
});

export function servePackage(
	specifier: string,
	options: Record<string, unknown> = {},
) {
	const fileUrl = import.meta.resolve(specifier);
	const packagePath = fromFileUrl(new URL(".", fileUrl));

	return app.use(staticFiles(packagePath, options));
}

servePackage("@fontsource/public-sans/index.css", {
	prefix: "/fonts/public-sans",
});

app.serve({ port: readNumberEnv("PORT", 5173) });
