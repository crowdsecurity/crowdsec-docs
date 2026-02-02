import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import { Button } from "@site/src/ui/button";
import Heading from "@theme/Heading";
import type { Props } from "@theme/NotFound/Content";
import clsx from "clsx";
import { type ReactNode } from "react";

export default function NotFoundContent({ className }: Props): ReactNode {
	return (
		<main className={clsx("container margin-vert--xl", className)}>
			<div className="row">
				<div className="col col--6 col--offset-3">
					<Heading as="h1" className="hero__title">
						<Translate id="theme.NotFound.title" description="The title of the 404 page">
							Page Not Found
						</Translate>
					</Heading>
					<p>
						<Translate id="theme.NotFound.p1" description="The first paragraph of the 404 page">
							Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or the URL might
							be incorrect.
						</Translate>
					</p>
					<div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
						<div style={{ display: "flex", flexDirection: "row", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
							<Link to="/">
								<Button size="lg" color="primary">
									🏠 Go Home
								</Button>
							</Link>
							<Link to="/u/getting_started/intro">
								<Button size="lg" variant="secondary">
									🚀 Get Started
								</Button>
							</Link>
						</div>
						<p style={{ marginTop: "1rem", fontSize: "0.875rem", opacity: 0.7 }}>
							Need help? Check out our{" "}
							<Link to="/u/troubleshooting/intro" style={{ color: "var(--ifm-color-primary)", textDecoration: "underline" }}>
								FAQ/Troubleshooting
							</Link>{" "}
							section.
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
