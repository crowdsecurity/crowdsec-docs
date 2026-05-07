import Link from "@docusaurus/Link";
import React, { useState } from "react";

export type FeatureCardProps = {
	title: string;
	description: string;
	link: string;
	icon: string;
};

export const FeatureCard = ({ title, description, link, icon }: FeatureCardProps): React.JSX.Element => {
	const [hover, setHover] = useState(false);
	return (
		<Link href={link} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
			<div
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				style={{
					height: '100%',
					border: `1px solid ${hover ? 'color-mix(in srgb, var(--cs-orange) 40%, transparent)' : 'var(--cs-border)'}`,
					borderRadius: 12,
					padding: '18px 18px 20px',
					background: hover ? 'var(--cs-surface-2)' : 'var(--cs-surface)',
					transition: 'border-color 0.15s, background 0.15s',
					cursor: 'pointer',
					boxSizing: 'border-box',
				}}
			>
				<div style={{ fontSize: 28, marginBottom: 12, lineHeight: 1 }}>
					{icon.startsWith("/")
						? <img src={icon} alt={title} style={{ height: 32, width: 32, border: 'none' }} />
						: icon}
				</div>
				<div style={{
					fontSize: 14.5, fontWeight: 600, marginBottom: 6,
					color: hover ? 'var(--cs-orange)' : 'var(--cs-ink)',
					transition: 'color 0.15s',
				}}>
					{title}
				</div>
				<p style={{ fontSize: 13, color: 'var(--cs-ink-dim)', margin: 0, lineHeight: 1.55 }}>
					{description}
				</p>
			</div>
		</Link>
	);
};

export type IntegrationCardProps = {
	title: string;
	description: string;
	link: string;
	icon: React.ReactNode;
};

export const IntegrationCard = ({ title, description, link, icon }: IntegrationCardProps): React.JSX.Element => {
	const [hover, setHover] = useState(false);
	return (
		<Link href={link} style={{ textDecoration: 'none', display: 'block' }}>
			<div
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				style={{
					border: `1px solid ${hover ? 'color-mix(in srgb, var(--cs-orange) 40%, transparent)' : 'var(--cs-border)'}`,
					borderRadius: 12,
					padding: '14px 16px',
					background: hover ? 'var(--cs-surface-2)' : 'var(--cs-surface)',
					transition: 'border-color 0.15s, background 0.15s',
					display: 'flex', alignItems: 'center', gap: 14,
					cursor: 'pointer',
				}}
			>
				<div style={{
					width: 44, height: 44, borderRadius: 10, flexShrink: 0,
					background: 'color-mix(in srgb, var(--cs-orange) 12%, transparent)',
					border: '1px solid color-mix(in srgb, var(--cs-orange) 22%, transparent)',
					display: 'flex', alignItems: 'center', justifyContent: 'center',
					color: 'var(--cs-orange)',
				}}>
					{icon}
				</div>
				<div>
					<div style={{
						fontSize: 14.5, fontWeight: 600, marginBottom: 3,
						color: hover ? 'var(--cs-orange)' : 'var(--cs-ink)',
						transition: 'color 0.15s',
					}}>
						{title}
					</div>
					<p style={{ fontSize: 13, color: 'var(--cs-ink-dim)', margin: 0 }}>{description}</p>
				</div>
			</div>
		</Link>
	);
};

export type IntegrationItemProps = {
	title: string;
	link: string;
};

export const IntegrationItem = ({ title, link }: IntegrationItemProps): React.JSX.Element => {
	const [hover, setHover] = useState(false);
	return (
		<Link href={link} style={{ textDecoration: 'none', display: 'block' }}>
			<div
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				style={{
					border: `1px solid ${hover ? 'color-mix(in srgb, var(--cs-orange) 40%, transparent)' : 'var(--cs-border)'}`,
					borderRadius: 8,
					padding: '10px 14px',
					background: hover ? 'var(--cs-surface-2)' : 'var(--cs-surface)',
					transition: 'border-color 0.15s, background 0.15s',
					cursor: 'pointer',
				}}
			>
				<span style={{
					fontSize: 13.5, fontWeight: 500,
					color: hover ? 'var(--cs-orange)' : 'var(--cs-ink)',
					transition: 'color 0.15s',
				}}>
					{title}
				</span>
			</div>
		</Link>
	);
};
