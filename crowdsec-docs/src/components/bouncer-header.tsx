import useBaseUrl from "@docusaurus/useBaseUrl";
import React from "react";

type FeatureKey = "waf" | "challenge" | "mtls" | "metrics" | "prometheus" | "livemode" | "streammode";
type BadgeKey = "waf" | "mtls" | "metrics" | "prometheus" | "updatemode" | "challenge";

type BouncerHeaderProps = {
	title: string;
	imgSrc: string;
	description: string;
	/**
	 * Comma-separated list of supported features (case-insensitive).
	 * Known keys: waf, challenge, mtls, metrics, prometheus, livemode, streammode
	 * Features absent from this string are shown as unsupported.
	 * livemode / streammode are merged into a single "Update Mode" chip.
	 * Example: featuresSupport="waf, mtls, livemode, streammode"
	 */
	featuresSupport?: string;
	/** GitHub repository URL. */
	githubUrl?: string;
	/** CrowdSec Hub page URL. */
	hubUrl?: string;
	/** Muted label shown next to the title. Defaults to "". */
	typeLabel?: string;
};

// ---------------------------------------------------------------------------
// Feature catalogue
// ---------------------------------------------------------------------------

const BADGE_ORDER: BadgeKey[] = ["updatemode", "waf", "challenge", "metrics", "mtls", "prometheus"];

const BADGE_LABELS: Record<BadgeKey, string> = {
	updatemode: "Update Mode",
	waf: "WAF / AppSec",
	challenge: "Challenge",
	metrics: "Remediation Metrics",
	mtls: "mTLS",
	prometheus: "Prometheus",
};

const BADGE_TOOLTIPS: Record<BadgeKey, string> = {
	updatemode: "Decision polling mode(s) supported by this bouncer",
	waf: "Supports CrowdSec WAF / AppSec capabilities",
	challenge: "Can present challenges to users as an alternative to blocking",
	metrics: "Send detailed metrics about remediations. Visible in cscli and CrowdSec Console",
	mtls: "Can do mutual TLS authentication to LAPI",
	prometheus: "Can expose metrics to Prometheus",
};

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

function parseFeatures(featuresSupport: string | undefined): Set<FeatureKey> {
	const set = new Set<FeatureKey>();
	if (!featuresSupport) return set;
	const valid = new Set<FeatureKey>(["waf", "challenge", "mtls", "metrics", "prometheus", "livemode", "streammode"]);
	for (const token of featuresSupport.split(",")) {
		const key = token.trim().toLowerCase() as FeatureKey;
		if (valid.has(key)) set.add(key);
	}
	return set;
}

function extrapolateModeLabel(features: Set<FeatureKey>): string | null {
	const parts: string[] = [];
	if (features.has("livemode")) parts.push("Live");
	if (features.has("streammode")) parts.push("Stream");
	return parts.length ? parts.join(" | ") : null;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = {
	root: {
		display: "flex",
		alignItems: "flex-start",
		gap: "14px",
		padding: "14px 0",
		borderBottom: "1px solid var(--ifm-color-emphasis-200)",
		marginBottom: "1.5rem",
	},
	logo: {
		flexShrink: 0,
		width: 90,
		height: 90,
		borderRadius: 8,
		border: "1px solid var(--ifm-color-emphasis-200)",
		background: "var(--ifm-background-surface-color)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
	logoImg: {
		width: 90,
		height: 90,
		objectFit: "contain" as const,
	},
	body: {
		display: "flex",
		flexDirection: "column" as const,
		gap: 5,
		minWidth: 0,
		flex: 1,
	},
	titleRow: {
		display: "flex",
		alignItems: "baseline",
		gap: 8,
		flexWrap: "wrap" as const,
	},
	title: {
		fontSize: "2.25rem",
		fontWeight: 600,
		lineHeight: 1.2,
		margin: 0,
	},
	typeLabel: {
		fontSize: "0.72rem",
		fontWeight: 500,
		color: "var(--ifm-color-emphasis-600)",
		letterSpacing: "0.02em",
		whiteSpace: "nowrap" as const,
	},
	description: {
		fontSize: "0.84rem",
		color: "var(--ifm-color-emphasis-700)",
		lineHeight: 1.5,
		margin: 0,
	},
	strip: {
		display: "flex",
		flexWrap: "wrap" as const,
		alignItems: "center",
		gap: "0 16px",
		rowGap: 6,
		fontSize: "0.78rem",
		lineHeight: 1,
		margin: 0,
		padding: 0,
		listStyle: "none",
	},
	divider: {
		display: "inline-block",
		width: 1,
		height: 12,
		background: "var(--ifm-color-emphasis-300)",
		verticalAlign: "middle",
		flexShrink: 0,
	},
	link: {
		color: "var(--ifm-color-emphasis-600)",
		textDecoration: "none",
		fontWeight: 500,
	},
} satisfies Record<string, React.CSSProperties>;

// ---------------------------------------------------------------------------
// Chip
// ---------------------------------------------------------------------------

type ChipVariant = "supported" | "unsupported" | "mode";

const GLYPH: Record<ChipVariant, string> = {
	supported: "✓",
	unsupported: "×",
	mode: "●",
};

const GLYPH_COLOR: Record<ChipVariant, string> = {
	supported: "var(--ifm-color-success)",
	unsupported: "var(--ifm-color-emphasis-300)",
	mode: "var(--ifm-color-info)",
};

const LABEL_COLOR: Record<ChipVariant, string> = {
	supported: "var(--ifm-font-color-base)",
	unsupported: "var(--ifm-color-emphasis-300)",
	mode: "var(--ifm-font-color-base)",
};

function Chip({ variant, label, title }: { variant: ChipVariant; label: string; title: string }) {
	return (
		<li style={{ display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }} title={title}>
			<span
				style={{ fontSize: "0.7rem", fontWeight: 700, color: GLYPH_COLOR[variant], lineHeight: 1, width: 10, textAlign: "center" }}
			>
				{GLYPH[variant]}
			</span>
			<span style={{ fontWeight: 500, color: LABEL_COLOR[variant] }}>{label}</span>
		</li>
	);
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const PLACEHOLDER_GITHUB = "https://github.com/orgs/crowdsecurity/repositories";

export default function BouncerHeader({
	title,
	imgSrc,
	description,
	featuresSupport,
	githubUrl,
	hubUrl,
	typeLabel = "",
}: Readonly<BouncerHeaderProps>): React.JSX.Element {
	const resolvedImg = useBaseUrl(imgSrc);
	const features = parseFeatures(featuresSupport);
	const modeLabel = extrapolateModeLabel(features);

	return (
		<div style={styles.root}>
			{/* Logo */}
			<div style={styles.logo}>
				<img src={resolvedImg} alt={`${title} logo`} style={styles.logoImg} />
			</div>

			<div style={styles.body}>
				{/* Title row */}
				<div style={styles.titleRow}>
					<span style={styles.title}>{title}</span>
					<span style={styles.typeLabel}>{typeLabel}</span>
				</div>

				{/* Description */}
				<p style={styles.description}>{description}</p>

				{/* Badges */}
				<ul style={styles.strip}>
					{BADGE_ORDER.map((badge) => {
						if (badge === "updatemode") {
							return (
								<React.Fragment key="updatemode">
									<Chip
										variant={modeLabel ? "mode" : "unsupported"}
										label={modeLabel ?? "No pull mode"}
										title={BADGE_TOOLTIPS.updatemode}
									/>
									<li style={{ display: "inline-flex", alignItems: "center" }}>
										<span style={styles.divider} />
									</li>
								</React.Fragment>
							);
						}
						return (
							<Chip
								key={badge}
								variant={features.has(badge) ? "supported" : "unsupported"}
								label={BADGE_LABELS[badge]}
								title={BADGE_TOOLTIPS[badge]}
							/>
						);
					})}
					{/* Divider + links */}
					<li style={{ display: "inline-flex", alignItems: "center" }}>
						<span style={styles.divider} />
					</li>
					<li style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
						<a
							href={githubUrl ?? PLACEHOLDER_GITHUB}
							target="_blank"
							rel="noopener noreferrer"
							style={styles.link}
							title="GitHub repository"
						>
							GitHub
						</a>
						{hubUrl && (
							<>
								<span style={{ color: "var(--ifm-color-emphasis-300)" }}>·</span>
								<a href={hubUrl} target="_blank" rel="noopener noreferrer" style={styles.link} title="CrowdSec Hub page">
									Hub
								</a>
							</>
						)}
					</li>
				</ul>
			</div>
		</div>
	);
}
