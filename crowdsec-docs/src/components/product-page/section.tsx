import React from "react";

type SectionProps = {
	title: string;
	description?: string;
	children: React.ReactNode;
	variant?: "default" | "muted";
};

export const Section = ({ title, description, children, variant = "default" }: SectionProps): React.JSX.Element => {
	const bgClass = variant === "muted" ? "bg-muted border-t border-border" : "";

	return (
		<section className={`py-10 md:py-14 px-4 ${bgClass}`}>
			<div className="container max-w-5xl mx-auto">
				<h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-900 dark:text-gray-900">{title}</h2>
				{description && <p className="text-gray-600 dark:text-gray-700 mb-8 max-w-2xl">{description}</p>}
				{children}
			</div>
		</section>
	);
};
