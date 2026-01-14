import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import React from "react";
import { Button } from "../../ui/button";

type HeroButton = {
	label: string;
	link: string;
	variant?: "primary" | "outline";
};

type HelpButton = {
	label: string;
	link: string;
};

type ProductPageLayoutProps = {
	title: string;
	metaDescription: string;
	icon: string;
	description: string;
	heroButtons: HeroButton[];
	helpTitle?: string;
	helpDescription?: string;
	helpButtons: HelpButton[];
	children: React.ReactNode;
};

export const ProductPageLayout = ({
	title,
	metaDescription,
	icon,
	description,
	heroButtons,
	helpTitle = "Need Help?",
	helpDescription,
	helpButtons,
	children,
}: ProductPageLayoutProps): React.JSX.Element => {
	return (
		<Layout title={title} description={metaDescription}>
			<main className="flex-1">
				{/* Hero Section */}
				<section className="py-10 md:py-16 px-4 border-b border-border">
					<div className="container max-w-5xl mx-auto">
						<Link to="/" className="text-sm text-gray-500 dark:text-gray-600 hover:text-primary mb-4 inline-block">
							← Back to Documentation
						</Link>
						<div className="flex flex-col md:flex-row md:items-center gap-6">
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
										<img src={icon} className="h-7 w-7" alt={title} />
									</div>
									<h1 className="text-3xl md:text-4xl font-bold m-0 text-gray-900 dark:text-gray-900">{title}</h1>
								</div>
								<p className="text-lg text-gray-600 dark:text-gray-700 mb-6 max-w-2xl">{description}</p>
								<div className="flex gap-3">
									{heroButtons.map((btn) =>
										btn.variant === "outline" ? (
											<Link key={btn.label} to={btn.link}>
												<Button variant="outline">{btn.label}</Button>
											</Link>
										) : (
											<Link key={btn.label} to={btn.link}>
												<Button color="primary">{btn.label}</Button>
											</Link>
										)
									)}
								</div>
							</div>
						</div>
					</div>
				</section>

				{children}

				{/* Help Section */}
				<section className="py-10 md:py-14 px-4 bg-primary/5 border-t border-border">
					<div className="container max-w-3xl mx-auto text-center">
						<h2 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-900">{helpTitle}</h2>
						{helpDescription && <p className="text-gray-600 dark:text-gray-700 mb-6">{helpDescription}</p>}
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							{helpButtons.map((btn) => (
								<Link key={btn.label} to={btn.link}>
									<Button size="lg" variant="outline">
										{btn.label}
									</Button>
								</Link>
							))}
						</div>
					</div>
				</section>
			</main>
		</Layout>
	);
};
