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
			<main style={{ flex: 1 }}>
				{/* ── Hero ── */}
				<section style={{
					padding: '40px 24px 48px',
					borderBottom: '1px solid var(--cs-border)',
					background: 'var(--cs-bg)',
					position: 'relative',
					overflow: 'hidden',
				}}>
					{/* Subtle radial glow */}
					<div style={{
						position: 'absolute', inset: 0, pointerEvents: 'none',
						background: 'radial-gradient(ellipse 600px 300px at 60% 50%, color-mix(in srgb, var(--cs-orange) 6%, transparent), transparent 70%)',
					}} aria-hidden="true" />

					<div style={{ maxWidth: 960, margin: '0 auto', position: 'relative' }}>
						<Link to="/" style={{
							fontSize: 12,
							fontFamily: 'var(--cs-font-mono)',
							color: 'var(--cs-ink-mute)',
							letterSpacing: '0.06em',
							display: 'inline-flex',
							alignItems: 'center',
							gap: 6,
							marginBottom: 24,
							textDecoration: 'none',
						}}>
							← Back to Documentation
						</Link>

						<div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
							<div style={{
								width: 56, height: 56, borderRadius: 14, flexShrink: 0,
								background: 'color-mix(in srgb, var(--cs-orange) 14%, transparent)',
								border: '1px solid color-mix(in srgb, var(--cs-orange) 25%, transparent)',
								display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
							}}>
								<img src={icon} alt={title} style={{ width: 36, height: 36, border: 'none' }} />
							</div>

							<div style={{ flex: 1, minWidth: 0 }}>
								<h1 style={{
									fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700,
									letterSpacing: '-0.025em', lineHeight: 1.1,
									color: 'var(--cs-ink)', margin: '0 0 12px',
								}}>
									{title}
								</h1>
								<p style={{
									fontSize: 16, color: 'var(--cs-ink-dim)',
									lineHeight: 1.65, maxWidth: 640, margin: '0 0 24px',
								}}>
									{description}
								</p>

								<div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
									{heroButtons.map((btn) => btn.variant === "outline" ? (
										<a key={btn.label} href={btn.link} style={{
											padding: '9px 20px', borderRadius: 8,
											border: '1px solid var(--cs-border-hi)',
											background: 'transparent',
											color: 'var(--cs-ink-dim)',
											fontSize: 14, fontWeight: 600,
											textDecoration: 'none',
											transition: 'border-color 0.15s, color 0.15s',
										}}
										onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--cs-orange)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cs-orange)'; }}
										onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = ''; (e.currentTarget as HTMLAnchorElement).style.color = ''; }}
										>
											{btn.label}
										</a>
									) : (
										<a key={btn.label} href={btn.link} style={{
											padding: '9px 20px', borderRadius: 8,
											background: 'var(--cs-orange)',
											color: 'var(--cs-btn-text)',
											fontSize: 14, fontWeight: 600,
											textDecoration: 'none',
											boxShadow: '0 4px 16px color-mix(in srgb, var(--cs-orange) 28%, transparent)',
											transition: 'opacity 0.15s',
										}}
										onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.88'; }}
										onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = ''; }}
										>
											{btn.label}
										</a>
									))}
								</div>
							</div>
						</div>
					</div>
				</section>

				{children}

				{/* ── Help Section ── */}
				<section style={{
					padding: '48px 24px',
					background: 'color-mix(in srgb, var(--cs-orange) 4%, var(--cs-bg))',
					borderTop: '1px solid var(--cs-border)',
				}}>
					<div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
						<h2 style={{
							fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em',
							color: 'var(--cs-ink)', margin: '0 0 10px',
						}}>
							{helpTitle}
						</h2>
						{helpDescription && (
							<p style={{ fontSize: 14.5, color: 'var(--cs-ink-dim)', margin: '0 0 22px', lineHeight: 1.6 }}>
								{helpDescription}
							</p>
						)}
						<div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
							{helpButtons.map((btn) => (
								<a key={btn.label} href={btn.link} style={{
									padding: '9px 20px', borderRadius: 8,
									border: '1px solid var(--cs-border-hi)',
									background: 'var(--cs-surface)',
									color: 'var(--cs-ink-dim)',
									fontSize: 14, fontWeight: 600,
									textDecoration: 'none',
									transition: 'border-color 0.15s, color 0.15s',
								}}
								onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--cs-orange)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cs-orange)'; }}
								onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = ''; (e.currentTarget as HTMLAnchorElement).style.color = ''; }}
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
