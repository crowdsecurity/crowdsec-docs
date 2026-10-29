import Head from "@docusaurus/Head";
import { translate } from "@docusaurus/Translate";
import { PageMetadata } from "@docusaurus/theme-common";
import Layout from "@theme/Layout";
import NotFoundContent from "@theme/NotFound/Content";
import { type ReactNode } from "react";

export default function Index(): ReactNode {
	const title = translate({
		id: "theme.NotFound.title",
		message: "Page Not Found",
	});
	return (
		<>
			<PageMetadata title={title} />
			<Head>
				{/* Amplify serves this page on every unknown path, so keep those URLs out of search indexes. */}
				<meta name="robots" content="noindex" />
			</Head>
			<Layout>
				<NotFoundContent />
			</Layout>
		</>
	);
}
