import React from "react";
import styles from "./index.module.css";

export type PromoVariant = "console" | "cti" | "engine";

type PerkDef = { label: string; icon: React.ReactNode };
type PromoData = {
	eyebrow: string;
	title: string;
	desc: string;
	color: string;
	perks: PerkDef[];
	ctaLabel: string;
	ctaHref: string;
};

function FeedIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="6" cy="18" r="2" />
			<path d="M4 4a16 16 0 0 1 16 16" />
			<path d="M4 11a9 9 0 0 1 9 9" />
		</svg>
	);
}
function BellIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16z" />
			<path d="M10 21h4" />
		</svg>
	);
}
function GaugeIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M3 14a9 9 0 0 1 18 0" />
			<path d="M12 14l4-4" />
			<circle cx="12" cy="14" r="1.5" />
		</svg>
	);
}
function GlobeIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="9" />
			<path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
		</svg>
	);
}
function ShieldIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6l8-3z" />
		</svg>
	);
}

const PROMO_DATA: Record<PromoVariant, PromoData> = {
	console: {
		eyebrow: "CrowdSec",
		title: "Console",
		desc: "Centralized, real-time visibility across all your engines.",
		color: "var(--cs-orange)",
		perks: [
			{ label: "Free 3rd-party Blocklists", icon: <FeedIcon /> },
			{ label: "Additional Alert Context", icon: <BellIcon /> },
			{ label: "Stack-wide health metrics", icon: <GaugeIcon /> },
		],
		ctaLabel: "Sign up for free",
		ctaHref: "https://app.crowdsec.net/signup?mtm_campaign=Console&mtm_source=docs&mtm_medium=tocAd",
	},
	cti: {
		eyebrow: "CrowdSec",
		title: "IP Reputation & CTI",
		desc: "Query 13B+ observed IPs for behavioral context, CVEs, and threat intel.",
		color: "var(--cs-violet)",
		perks: [
			{ label: "Real-time IP reputation scoring", icon: <GlobeIcon /> },
			{ label: "Threat intelligence feeds", icon: <FeedIcon /> },
			{ label: "REST API · generous free tier", icon: <GaugeIcon /> },
		],
		ctaLabel: "CTI API docs",
		ctaHref: "/u/cti_api/intro",
	},
	engine: {
		eyebrow: "CrowdSec",
		title: "Security Engine",
		desc: "Open-source log-based threat detection that shares intel with the community.",
		color: "var(--cs-teal)",
		perks: [
			{ label: "Detects attacks from your own logs", icon: <ShieldIcon /> },
			{ label: "Shares blocklists with the community", icon: <FeedIcon /> },
			{ label: "Installs in minutes on any system", icon: <GaugeIcon /> },
		],
		ctaLabel: "Get started",
		ctaHref: "/u/getting_started/installation/linux",
	},
};

function SparklineBox({ color }: { color: string }) {
	return (
		<div className={styles.sparkBox}>
			{/* Horizontal grid lines */}
			<div className={styles.sparkGrid} aria-hidden="true" />
			<svg className={styles.sparkSvg} viewBox="0 0 200 70" preserveAspectRatio="none" aria-hidden="true">
				<defs>
					<linearGradient id={`pg-fill-${color.replace(/[^a-z]/gi, "")}`} x1="0" x2="0" y1="0" y2="1">
						<stop offset="0%" stopColor={color} stopOpacity="0.45" />
						<stop offset="100%" stopColor={color} stopOpacity="0" />
					</linearGradient>
				</defs>
				<path
					d="M0 50 L20 42 L40 46 L60 30 L80 36 L100 22 L120 28 L140 14 L160 20 L180 8 L200 16 L200 70 L0 70 Z"
					fill={`url(#pg-fill-${color.replace(/[^a-z]/gi, "")})`}
				/>
				<path
					d="M0 50 L20 42 L40 46 L60 30 L80 36 L100 22 L120 28 L140 14 L160 20 L180 8 L200 16"
					fill="none"
					stroke={color}
					strokeWidth="1.8"
				/>
			</svg>
		</div>
	);
}

type Props = { variant?: PromoVariant };

export default function PromoCard({ variant = "console" }: Props) {
	const data = PROMO_DATA[variant];
	if (!data) return null;
	const mix = (pct: number) => `color-mix(in srgb, ${data.color} ${pct}%, transparent)`;

	return (
		<div className={styles.card}>
			{/* Corner glow */}
			<div className={styles.glow} style={{ background: data.color }} aria-hidden="true" />

			<div className={styles.inner}>
				<div className={styles.eyebrow} style={{ color: data.color }}>
					{data.eyebrow}
				</div>
				<div className={styles.title}>{data.title}</div>
				<div className={styles.desc}>{data.desc}</div>

				<SparklineBox color={data.color} />

				<div className={styles.perks}>
					{data.perks.map((p) => (
						<div key={p.label} className={styles.perk}>
							<span
								className={styles.perkIcon}
								style={{
									background: mix(14),
									color: data.color,
									border: `1px solid ${mix(25)}`,
								}}
							>
								{p.icon}
							</span>
							<span>{p.label}</span>
						</div>
					))}
				</div>

				<a href={data.ctaHref} className={styles.cta} style={{ background: data.color, color: "var(--cs-btn-text)" }}>
					{data.ctaLabel} →
				</a>
			</div>
		</div>
	);
}
