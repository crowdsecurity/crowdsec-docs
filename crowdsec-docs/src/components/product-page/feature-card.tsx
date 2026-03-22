import Link from "@docusaurus/Link";
import React from "react";

export type FeatureCardProps = {
	title: string;
	description: string;
	link: string;
	icon: string;
};

export const FeatureCard = ({ title, description, link, icon }: FeatureCardProps): React.JSX.Element => (
	<Link href={link} className="hover:no-underline group">
		<div className="h-full border border-solid border-border rounded-lg p-5 bg-card hover:shadow-md hover:border-primary/30 transition-all duration-200">
			<div className="text-3xl mb-3">{icon.startsWith("/") ? <img src={icon} alt={title} className="h-8 w-8" /> : icon}</div>
			<h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-900 group-hover:text-primary transition-colors">
				{title}
			</h3>
			<p className="text-sm text-gray-600 dark:text-gray-700 mb-0">{description}</p>
		</div>
	</Link>
);

export type IntegrationCardProps = {
	title: string;
	description: string;
	link: string;
	icon: React.ReactNode;
};

export const IntegrationCard = ({ title, description, link, icon }: IntegrationCardProps): React.JSX.Element => (
	<Link href={link} className="hover:no-underline group">
		<div className="h-full border border-solid border-border rounded-lg p-4 bg-card hover:shadow-md hover:border-primary/30 transition-all duration-200 flex items-center gap-4">
			<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">{icon}</div>
			<div>
				<h3 className="text-base font-semibold text-gray-900 dark:text-gray-900 group-hover:text-primary transition-colors mb-1">
					{title}
				</h3>
				<p className="text-sm text-gray-600 dark:text-gray-700 mb-0">{description}</p>
			</div>
		</div>
	</Link>
);

export type IntegrationItemProps = {
	title: string;
	link: string;
};

export const IntegrationItem = ({ title, link }: IntegrationItemProps): React.JSX.Element => (
	<Link href={link} className="hover:no-underline group">
		<div className="border border-solid border-border rounded-lg px-4 py-3 bg-card hover:shadow-md hover:border-primary/30 transition-all duration-200">
			<span className="text-sm font-medium text-gray-900 dark:text-gray-900 group-hover:text-primary transition-colors">{title}</span>
		</div>
	</Link>
);
