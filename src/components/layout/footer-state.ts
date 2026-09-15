// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Context } from "@july/snarl";

export interface FooterLead {
	href: string;
	label: string;
	arrow?: "up";
}

export interface FooterOptions {
	lead?: FooterLead;
	buttons?: boolean;
}

const FOOTER = Symbol.for("suicide.diy/footer");

export function setFooter(ctx: Context, options: FooterOptions): void {
	ctx.state.set(FOOTER, { ...getFooter(ctx), ...options });
}

export function getFooter(ctx: Context | undefined): FooterOptions {
	return (ctx?.state.get(FOOTER) as FooterOptions | undefined) ?? {};
}
