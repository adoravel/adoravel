/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createRouter } from "@july/snarl";
import { staticFiles } from "@july/snarl";

import { scopedStyling, styleScopeInjection } from "~/middleware/scoped-css.ts";
import { scanRoutes as scan } from "~/lib/routing.ts";
import minify from "~/middleware/minification.ts";
import { contextMiddleware as context } from "~/lib/context.ts";

const router = createRouter();
router.use(
	context(),
	scopedStyling(),
	staticFiles("./static", { maxAge: 259200 }),
	staticFiles("./assets", { maxAge: 259200 }),
	minify(),
	styleScopeInjection(),
);

scan(router);

Deno.serve({ port: 8254 }, router.fetch);
