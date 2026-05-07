import React from "react";

type SectionProps = {
	title: string;
	description?: string;
	children: React.ReactNode;
	variant?: "default" | "muted";
};

export const Section = ({ title, description, children, variant = "default" }: SectionProps): React.JSX.Element => {
	return (
		<section
			className={`py-12 px-6${variant === "muted" ? " border-y border-cs-border" : ""}`}
			style={{
				background: variant === "muted" ? "color-mix(in srgb, var(--cs-ink) 3%, var(--cs-bg))" : "var(--cs-bg)",
			}}
		>
			<div className="max-w-[960px] mx-auto">
				<h2 className="text-[22px] font-bold tracking-[-0.015em] text-cs-ink m-0 mb-2">{title}</h2>
				{description && <p className="text-[14.5px] text-cs-ink-dim m-0 mb-7 max-w-[600px] leading-[1.6]">{description}</p>}
				{children}
			</div>
		</section>
	);
};
