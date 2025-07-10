import type { Props } from "@theme/Footer/Copyright";
import React from "react";

export default function FooterCopyright({ copyright }: Readonly<Props>): React.JSX.Element {
	return (
		<div className="mt-8 border-0 border-t border-border/40 border-solid pt-4">
			<p className="text-sm/6 text-foreground/50 text-left">{copyright}, Inc. All rights reserved.</p>
		</div>
	);
}
