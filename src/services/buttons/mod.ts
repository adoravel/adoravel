// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { readNumberEnv } from "~/services/core/env.ts";
import { createPoller, type PolledResource } from "~/services/core/poller.ts";
import { cacheImage, isExternalUrl } from "~/services/media/proxy.ts";
import { buttons, type WebButton } from "~/content/buttons.ts";

export const SERVICE = "buttons";

async function loadButtons(signal: AbortSignal): Promise<WebButton[]> {
	const resolved = await Promise.all(
		buttons.map(async (button) => {
			if (!isExternalUrl(button.src)) return button;
			const cached = await cacheImage(button.src, {}, signal);
			return cached ? { ...button, src: cached.route } : undefined;
		}),
	);
	return resolved.filter((button): button is WebButton => button !== undefined);
}

export const webButtons: PolledResource<WebButton[]> = createPoller({
	name: SERVICE,
	intervalSeconds: readNumberEnv("BUTTONS_POLL_INTERVAL", 24 * 60 * 60),
	load: loadButtons,
});

export type { WebButton } from "~/content/buttons.ts";
