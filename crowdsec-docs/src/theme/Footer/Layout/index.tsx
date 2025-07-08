import type { Props } from "@theme/Footer/Layout";
import React from "react";

export default function FooterLayout({ links, logo, copyright }: Readonly<Props>): React.JSX.Element {
	return (
		<footer className="bg-card border-0 border-t border-border/80 border-solid">
			<div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 space-y-8">
				<div className="flex flex-row items-center gap-6">
					<img alt="CrowdSec Logo" src="/img/crowdsec_logo.png" className="h-10" />
					<div className="flex flex-col items-start gap-0">
						<h3 className="mb-0">CrowdSec</h3>
						<p className="text-balance text-sm/6 text-foreground/80 mb-0">Safer together.</p>
					</div>
				</div>

				{links}
				{(logo || copyright) && (
					<div className="footer__bottom text--center">
						{logo && <div className="margin-bottom--sm">{logo}</div>}
						{copyright}
					</div>
				)}
			</div>
		</footer>
	);
}
