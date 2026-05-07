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
			style={{
				padding: "48px 24px",
				background: variant === "muted" ? "color-mix(in srgb, var(--cs-ink) 3%, var(--cs-bg))" : "var(--cs-bg)",
				borderTop: variant === "muted" ? "1px solid var(--cs-border)" : undefined,
				borderBottom: variant === "muted" ? "1px solid var(--cs-border)" : undefined,
			}}
		>
			<div style={{ maxWidth: 960, margin: "0 auto" }}>
				<h2
					style={{
						fontSize: 22,
						fontWeight: 700,
						letterSpacing: "-0.015em",
						color: "var(--cs-ink)",
						margin: "0 0 8px",
					}}
				>
					{title}
				</h2>
				{description && (
					<p
						style={{
							fontSize: 14.5,
							color: "var(--cs-ink-dim)",
							margin: "0 0 28px",
							maxWidth: 600,
							lineHeight: 1.6,
						}}
					>
						{description}
					</p>
				)}
				{children}
			</div>
		</section>
	);
};
