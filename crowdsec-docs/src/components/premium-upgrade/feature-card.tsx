import Link from "@docusaurus/Link";
import React from "react";

export interface FeatureCardProps {
	id?: string;
	title: string;
	metric?: string;
	description: string;
	comparison?: {
		before: string;
		after: string;
	};
	link?: string;
	category?: "protection" | "scale" | "monitoring" | "intelligence";
	highlight?: boolean;
	badges?: string[];
}

const categoryColors = {
	protection: {
		border: "border-l-4 border-l-red-500 dark:border-l-red-400",
		metric: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300",
	},
	scale: {
		border: "border-l-4 border-l-purple-500 dark:border-l-purple-400",
		metric: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
	},
	monitoring: {
		border: "border-l-4 border-l-teal-500 dark:border-l-teal-400",
		metric: "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300",
	},
	intelligence: {
		border: "border-l-4 border-l-yellow-600 dark:border-l-yellow-500",
		metric: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300",
	},
};

export const FeatureCard = ({
	id,
	title,
	metric,
	description,
	comparison,
	link,
	category = "protection",
	highlight = false,
	badges = [],
}: FeatureCardProps): React.JSX.Element => {
	const colors = categoryColors[category];

	// Generate ID from title if not explicitly provided
	const generatedId = id || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

	const cardContent = (
		<div
			id={generatedId}
			className={`
				h-full border border-solid border-border rounded-lg p-5 bg-card
				hover:shadow-md hover:border-primary/30 transition-all duration-200
				${category ? colors.border : ""}
				${highlight ? "bg-gradient-to-r from-primary/5 to-transparent border-primary/30" : ""}
			`}
		>
			<div className="flex items-start justify-between gap-3 mb-3">
				<div className="flex-1">
					<h4 className="font-semibold text-base mb-1 text-gray-900 dark:text-gray-900">
						{title}
						{badges.map((badge) => (
							<span
								key={badge}
								className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-0.5 rounded-full"
							>
								{badge}
							</span>
						))}
					</h4>
				</div>
				{metric && (
					<span className={`flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${colors.metric}`}>
						{metric}
					</span>
				)}
			</div>
			<p className="text-sm text-gray-600 dark:text-gray-700 mb-3 leading-relaxed">{description}</p>
			{comparison && (
				<div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-md text-xs">
					<span className="text-gray-500 dark:text-gray-600 line-through">{comparison.before}</span>
					{" → "}
					<span className="font-semibold text-primary">{comparison.after}</span>
				</div>
			)}
			{link && (
				<div className="mt-3 text-sm font-medium text-primary hover:underline">
					Learn more →
				</div>
			)}
		</div>
	);

	if (link) {
		return (
			<Link href={link} className="hover:no-underline block">
				{cardContent}
			</Link>
		);
	}

	return cardContent;
};

export interface HighlightCardProps {
	id?: string;
	title: string;
	description: string;
	stats?: Array<{
		value: string;
		label: string;
	}>;
	link?: string;
	category?: "protection" | "scale" | "monitoring" | "intelligence";
}

export const HighlightCard = ({ id, title, description, stats, link, category = "protection" }: HighlightCardProps): React.JSX.Element => {
	// Generate ID from title if not explicitly provided
	const generatedId = id || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

	const content = (
		<div id={generatedId} className="border border-solid border-primary/30 rounded-lg p-6 bg-gradient-to-r from-primary/5 to-transparent hover:shadow-md transition-all">
			<h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-900">{title}</h4>
			<p className="text-sm text-gray-600 dark:text-gray-700 mb-4 leading-relaxed">{description}</p>
			{stats && stats.length > 0 && (
				<div className="flex gap-8 mt-4">
					{stats.map((stat, idx) => (
						<div key={idx} className="text-center">
							<div className="text-3xl font-bold text-primary">{stat.value}</div>
							<div className="text-xs text-gray-500 dark:text-gray-600 mt-1">{stat.label}</div>
						</div>
					))}
				</div>
			)}
			{link && (
				<div className="mt-4 text-sm font-medium text-primary hover:underline">
					Learn more →
				</div>
			)}
		</div>
	);

	if (link) {
		return (
			<Link href={link} className="hover:no-underline block">
				{content}
			</Link>
		);
	}

	return content;
};
