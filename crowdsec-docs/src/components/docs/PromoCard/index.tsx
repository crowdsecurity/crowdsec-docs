import { CIcon } from "@coreui/icons-react";
import { cilRss, cilBell, cilSpeedometer, cilGlobeAlt, cilShieldAlt, cilArrowRight } from "@coreui/icons";
import React from "react";
import styles from "./index.module.css";

export type PromoVariant = "console" | "cti" | "engine";

type PerkDef = { label: string; icon: object };
type PromoData = {
	eyebrow: string;
	title: string;
	desc: string;
	color: string;
	perks: PerkDef[];
	ctaLabel: string;
	ctaHref: string;
};

const PROMO_DATA: Record<PromoVariant, PromoData> = {
	console: {
		eyebrow: "CrowdSec",
		title: "Console",
		desc: "Centralized, real-time visibility across all your engines.",
		color: "var(--cs-orange)",
		perks: [
			{ label: "Free 3rd-party Blocklists", icon: cilRss },
			{ label: "Additional Alert Context", icon: cilBell },
			{ label: "Stack-wide health metrics", icon: cilSpeedometer },
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
			{ label: "Real-time IP reputation scoring", icon: cilGlobeAlt },
			{ label: "Threat intelligence feeds", icon: cilRss },
			{ label: "REST API · generous free tier", icon: cilSpeedometer },
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
			{ label: "Detects attacks from your own logs", icon: cilShieldAlt },
			{ label: "Shares blocklists with the community", icon: cilRss },
			{ label: "Installs in minutes on any system", icon: cilSpeedometer },
		],
		ctaLabel: "Get started",
		ctaHref: "/u/getting_started/installation/linux",
	},
};

function SparklineBox({ color }: { color: string }) {
	return (
		<div className={styles.sparkBox}>
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
								style={{ background: mix(14), color: data.color, border: `1px solid ${mix(25)}` }}
							>
								<CIcon icon={p.icon as Parameters<typeof CIcon>[0]["icon"]} aria-hidden="true" />
							</span>
							<span>{p.label}</span>
						</div>
					))}
				</div>
				<a href={data.ctaHref} className={styles.cta} style={{ background: data.color, color: "var(--cs-btn-text)" }}>
					{data.ctaLabel}{" "}
					<CIcon icon={cilArrowRight} style={{ width: 13, height: 13 }} aria-hidden="true" />
				</a>
			</div>
		</div>
	);
}
