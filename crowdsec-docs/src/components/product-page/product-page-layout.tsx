import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import React from "react";

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
				{/* ── Hero ── */}
				<section className="py-10 px-6 pb-12 border-b border-cs-border bg-cs-bg relative overflow-hidden">
					{/* Subtle radial glow */}
					<div
						className="absolute inset-0 pointer-events-none"
						style={{
							background:
								"radial-gradient(ellipse 600px 300px at 60% 50%, color-mix(in srgb, var(--cs-orange) 6%, transparent), transparent 70%)",
						}}
						aria-hidden="true"
					/>

					<div className="max-w-[960px] mx-auto relative">
						<Link
							to="/"
							className="text-xs font-cs-mono text-cs-ink-mute tracking-[0.06em] inline-flex items-center gap-1.5 mb-6 no-underline"
						>
							← Back to Documentation
						</Link>

						<div className="flex items-start gap-6">
							<div className="w-14 h-14 rounded-[14px] shrink-0 bg-[color-mix(in_srgb,var(--cs-orange)_14%,transparent)] border border-[color-mix(in_srgb,var(--cs-orange)_25%,transparent)] flex items-center justify-center overflow-hidden">
								<img src={icon} alt={title} className="w-9 h-9 border-none" />
							</div>

							<div className="flex-1 min-w-0">
								<h1 className="text-[clamp(28px,4vw,40px)] font-bold tracking-[-0.025em] leading-[1.1] text-cs-ink m-0 mb-3">
									{title}
								</h1>
								<p className="text-base text-cs-ink-dim leading-[1.65] max-w-[640px] m-0 mb-6">{description}</p>

								<div className="flex gap-[10px] flex-wrap">
									{heroButtons.map((btn) =>
										btn.variant === "outline" ? (
											<a
												key={btn.label}
												href={btn.link}
												className="py-[9px] px-5 rounded-lg border border-cs-border-hi bg-transparent text-cs-ink-dim text-sm font-semibold no-underline transition-[border-color,color] duration-150 hover:border-cs-orange hover:text-cs-orange"
											>
												{btn.label}
											</a>
										) : (
											<a
												key={btn.label}
												href={btn.link}
												className="py-[9px] px-5 rounded-lg bg-cs-orange text-cs-btn-text text-sm font-semibold no-underline transition-opacity duration-150 hover:opacity-[0.88] shadow-[0_4px_16px_color-mix(in_srgb,var(--cs-orange)_28%,transparent)]"
											>
												{btn.label}
											</a>
										)
									)}
								</div>
							</div>
						</div>
					</div>
				</section>

				{children}

				{/* ── Help Section ── */}
				<section
					className="py-12 px-6 border-t border-cs-border"
					style={{ background: "color-mix(in srgb, var(--cs-orange) 4%, var(--cs-bg))" }}
				>
					<div className="max-w-[600px] mx-auto text-center">
						<h2 className="text-[22px] font-bold tracking-[-0.01em] text-cs-ink m-0 mb-[10px]">{helpTitle}</h2>
						{helpDescription && <p className="text-[14.5px] text-cs-ink-dim m-0 mb-[22px] leading-[1.6]">{helpDescription}</p>}
						<div className="flex gap-[10px] justify-center flex-wrap">
							{helpButtons.map((btn) => (
								<a
									key={btn.label}
									href={btn.link}
									className="py-[9px] px-5 rounded-lg border border-cs-border-hi bg-cs-surface text-cs-ink-dim text-sm font-semibold no-underline transition-[border-color,color] duration-150 hover:border-cs-orange hover:text-cs-orange"
								>
									{btn.label}
								</a>
							))}
						</div>
					</div>
				</section>
			</main>
		</Layout>
	);
};
