import { cilArrowRight, cilBell, cilGlobeAlt, cilRss, cilShieldAlt, cilSpeedometer } from "@coreui/icons";
import { CIcon } from "@coreui/icons-react";

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
		<div className="my-1 h-[76px] rounded-lg bg-cs-bg border border-cs-border relative overflow-hidden">
			<div
				className="absolute inset-0 opacity-50"
				style={{
					backgroundImage: "linear-gradient(var(--cs-border-hi) 1px, transparent 1px)",
					backgroundSize: "100% 18px",
				}}
				aria-hidden="true"
			/>
			<svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 70" preserveAspectRatio="none" aria-hidden="true">
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
		<div className="mt-6 bg-cs-surface border border-cs-border-hi rounded-[14px] overflow-hidden relative">
			<div
				className="absolute -top-[50px] -right-[50px] w-40 h-40 rounded-full blur-[56px] opacity-[0.18] pointer-events-none"
				style={{ background: data.color }}
				aria-hidden="true"
			/>
			<div className="relative p-[18px] flex flex-col gap-[10px]">
				<div className="font-cs-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: data.color }}>
					{data.eyebrow}
				</div>
				<div className="text-xl font-bold text-cs-ink tracking-[-0.01em] leading-[1.1] -mt-0.5">{data.title}</div>
				<div className="text-xs text-cs-ink-dim leading-[1.5]">{data.desc}</div>
				<SparklineBox color={data.color} />
				<div className="flex flex-col gap-2">
					{data.perks.map((p) => (
						<div key={p.label} className="flex items-center gap-[9px] text-xs text-cs-ink-dim leading-[1.4]">
							<span
								className="w-[22px] h-[22px] rounded-[5px] flex items-center justify-center shrink-0 [&>svg]:w-3 [&>svg]:h-3"
								style={{ background: mix(14), color: data.color, border: `1px solid ${mix(25)}` }}
							>
								<CIcon icon={p.icon as Parameters<typeof CIcon>[0]["icon"]} aria-hidden="true" />
							</span>
							<span>{p.label}</span>
						</div>
					))}
				</div>
				<a
					href={data.ctaHref}
					className="inline-flex items-center justify-center w-full py-[10px] px-[14px] rounded-lg text-[13px] font-bold no-underline transition-opacity duration-150 mt-1 tracking-[0.01em] hover:opacity-[0.88] hover:no-underline"
					style={{ background: data.color, color: "var(--cs-btn-text)" }}
				>
					{data.ctaLabel} <CIcon icon={cilArrowRight} style={{ width: 13, height: 13 }} aria-hidden="true" />
				</a>
			</div>
		</div>
	);
}
