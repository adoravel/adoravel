/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createApp as createRouter } from "@404/imouto";
import { staticFiles } from "@july/snarl";

const router = await createRouter({
	routesDir: "./src/routes",
	staticDir: "./static",
});

router.use(staticFiles("./assets", {
	maxAge: 259200,
}));

router.serve();
