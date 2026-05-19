/**
 * Copyright (c) 2025 adoravel
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { css } from "~/lib/css.ts";
import { Layout } from "~/layout.tsx";

const Styled = css(`
	.sorry {}
`);

export default () => {
	return (
		<Layout scope={Styled}>
			<span>wip, sorry</span>
		</Layout>
	);
};
