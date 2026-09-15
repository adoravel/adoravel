// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import { onMount, signal } from "@404/aether";

export interface LocalTimeProps {
	timezone: string;
	locale: string;
	label: string;
}

function format(timezone: string, locale: string): string {
	return new Intl.DateTimeFormat(locale, {
		timeZone: timezone,
		hour: "numeric",
		minute: "2-digit",
	}).format(new Date());
}

export default function LocalTime({ timezone, locale, label }: LocalTimeProps) {
	const time = signal(format(timezone, locale));

	onMount(() => {
		const update = () => time(format(timezone, locale));
		update();
		const id = setInterval(update, 15_000);
		return () => clearInterval(id);
	});

	return (
		<span>
			<time>{time}</time> {label}
		</span>
	);
}
