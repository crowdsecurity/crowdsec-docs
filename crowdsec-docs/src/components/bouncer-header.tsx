import useBaseUrl from "@docusaurus/useBaseUrl";
import { ToolTipArrow, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@site/src/ui/tooltip";
import { clsx } from "clsx";
import React from "react";

type BouncerHeaderProps = {
	title: string;
	imgSrc: string;
	description: string;
	/**
	 * Comma-separated list of supported features (case-insensitive).
	 * Known keys: appsec, mtls, metrics, prometheus, livemode, streammode, apimode
	 * Prefix with "!" to explicitly mark as unsupported (e.g. "!appsec").
	 * All features are always shown — ones absent default to unsupported.
	 * livemode and streammode are merged into a single "Update Mode" badge.
	 * Example: featuresSupport="mtls, appsec, livemode, streammode, apimode"
	 */
	featuresSupport?: string;
};

type FeatureKey = "waf" | "mtls" | "metrics" | "prometheus" | "livemode" | "streammode";
type BadgeKey = "waf" | "metrics" | "mtls" | "prometheus" | "updatemode";

type FeatureDef = {
	label: string;
	displayText: (positive: boolean) => string;
	/**
	 * Optional forced Tailwind bg color classes for the value half, overriding the default green/red.
	 * Provide both light and dark variants, e.g. "bg-amber-600 dark:bg-amber-500".
	 * When undefined, defaults to green (positive) or red (negative).
	 */
	color?: (positive: boolean) => string | undefined;
};

type FeatureBadgeDef = {
	label: string;
	tooltip: string;
	linkedFeatures: FeatureKey[];
	displayText: (bouncerSupportedFeatures: Record<FeatureKey, FeatureDef>) => string;
	//display color is optional, if not provided the default color will be calculated by the presence of 
	displayColor?: (bouncerSupportedFeatures: Record<FeatureKey, FeatureDef>) => string | undefined;
};

const BADGE_DEFS: Record<BadgeKey, FeatureBadgeDef> = {
	updatemode: {
		label: "Update Mode",
		tooltip: "Supported decisions update mode",
		linkedFeatures: ["livemode", "streammode"] as FeatureKey[],
		displayText: (bouncerSupportedFeatures: Record<FeatureKey, FeatureDef>) => {
			//aggregate the display text of linked features separated by "|" , if they are present only
			let modes: string[] = [];
			if (bouncerSupportedFeatures.livemode) {
				modes.push(FEATURE_DEFS.livemode.displayText(true));
			}
			if (bouncerSupportedFeatures.streammode) {
				modes.push(FEATURE_DEFS.streammode.displayText(true));
			}

			return modes.join(" | ");
		},
	},
	waf: {
		label: "WAF",
		tooltip: "Supports Web Application Firewall (WAF) functionality",
		linkedFeatures: ["waf"] as FeatureKey[],
		displayText: (bouncerSupportedFeatures: Record<FeatureKey, FeatureDef>) => (bouncerSupportedFeatures.waf ? FEATURE_DEFS.waf.displayText(true) : FEATURE_DEFS.waf.displayText(false)),
	},
	metrics: {
		label: "Metrics",
		tooltip: "Can send detailed metrics to LAPI",
		linkedFeatures: ["metrics"] as FeatureKey[],
		displayText: (bouncerSupportedFeatures: Record<FeatureKey, FeatureDef>) => (bouncerSupportedFeatures.metrics ? "Supported" : "Unsupported"),
	},
	mtls: {
		label: "MTLS",
		tooltip: "Can do mutual TLS authentication to LAPI",
		linkedFeatures: ["mtls"] as FeatureKey[],
		displayText: (bouncerSupportedFeatures: Record<FeatureKey, FeatureDef>) => (bouncerSupportedFeatures.mtls ? "Supported" : "Unsupported"),
	},
	prometheus: {
		label: "Prometheus",
		tooltip: "Can expose metrics to Prometheus",
		linkedFeatures: ["prometheus"] as FeatureKey[],
		displayText: (bouncerSupportedFeatures: Record<FeatureKey, FeatureDef>) => (bouncerSupportedFeatures.prometheus ? "Supported" : "Unsupported"),
	},
};

const FEATURE_DEFS: Record<FeatureKey, FeatureDef> = {
	waf: {
		label: "WAF",
		displayText: (supported: boolean) => (supported ? "Supported" : "Unsupported"),
	},
	metrics: {
		label: "Remediation Metrics",
		displayText: (supported: boolean) => (supported ? "Supported" : "Unsupported"),
	},
	mtls: {
		label: "MTLS",
		displayText: (supported: boolean) => (supported ? "Supported" : "Unsupported"),
	},
	prometheus: {
		label: "Prometheus",
		displayText: (supported: boolean) => (supported ? "Supported" : "Unsupported"),
	},
	// livemode and streammode are only used for parsing — they never render individually.
	// The "Update Mode" composite badge is rendered by BADGE_ORDER below.
	livemode: {
		label: "Live Mode",
		displayText: (supported: boolean) => "Live",
	},
	streammode: {
		label: "Stream Mode",
		displayText: (supported: boolean) => "Stream",
	},
};

// ----- Update Mode composite logic -----

function getColorForBadge(bouncerSupportedFeatures: Record<FeatureKey, FeatureDef>, badgeLinkedFeatures: FeatureKey[]): string | undefined {
	// Example logic for determining color based on linked features
	for (const featureKey of badgeLinkedFeatures) {
		if (bouncerSupportedFeatures[featureKey]) {
			return "bg-emerald-700 dark:bg-emerald-60";
		}
	}
	return "bg-red-700 dark:bg-red-500"; // default to red if none are supported
}

// ----- Badge component -----

const SupportBadge = ({
	label,
	displayText,
	tooltip,
	color,
}: {
	label: string;
	displayText: string;
	tooltip: string;
	color?: string;
}) => {
	const colorClass = color ?? "bg-emerald-700 dark:bg-emerald-600";

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="rounded-full flex text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-shadow cursor-help overflow-hidden">
						<span className="bg-slate-700 dark:bg-slate-600 text-white px-2.5 sm:px-4 py-1 sm:py-1.5">{label}</span>
						<span className={clsx("px-2.5 sm:px-4 py-1 sm:py-1.5 text-white", colorClass)}>{displayText}</span>
					</div>
				</TooltipTrigger>
				<TooltipContent side="bottom">
					<p>{tooltip}</p>
					<ToolTipArrow className="dark:fill-white" />
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

// ----- Parsing -----

function parseFeaturesSupport(featuresSupport: string | undefined): Map<FeatureKey, FeatureDef> {
	// create a map of featureDefs for the featuresSupport string, 
	const supportedFeaturesMap = new Map<FeatureKey, FeatureDef>();
	if (!featuresSupport) return supportedFeaturesMap;

	for (let featureKey of featuresSupport.split(",")) {
		featureKey = featureKey.trim();
		const featureDef: FeatureDef = FEATURE_DEFS[featureKey.toLowerCase() as FeatureKey];
		if (!featureDef) continue;
		supportedFeaturesMap.set(featureKey as FeatureKey, featureDef);
	}

	return supportedFeaturesMap;
}

// ----- Main component -----

export default function BouncerHeader({ title, imgSrc, description, featuresSupport }: Readonly<BouncerHeaderProps>): React.JSX.Element {
	const resolvedImg = useBaseUrl(imgSrc);
	const bouncerSupportedFeatures = parseFeaturesSupport(featuresSupport);

	return (
		<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 mb-6">
			{/* Icon */}
			<div
				className="flex-shrink-0 rounded-lg flex items-center justify-center"
				style={{ width: 104, height: 104, background: "var(--ifm-color-emphasis-100)" }}
			>
				<img src={resolvedImg} alt={`${title} logo`} style={{ width: 100, height: 100, objectFit: "contain" }} />
			</div>

			{/* Title + description */}
			<div className="flex flex-col gap-1 flex-1 min-w-0">
				<span style={{ fontWeight: 700, fontSize: "2.1rem" }}>{title}</span>
				<span style={{ fontSize: "0.875rem", color: "var(--ifm-color-emphasis-700)", lineHeight: 1.4 }}>{description}</span>
			</div>

			{/* Badges */}
			<div className="flex flex-row flex-wrap gap-1.5 sm:flex-col sm:items-end sm:gap-1.5">
				{/* for each BADGE_DEFS key,value create the badge */}
				{Object.entries(BADGE_DEFS).map(([key, badge]) => {
					const badgeDef = badge as FeatureBadgeDef;
					return (
						<SupportBadge
							key={key.toString()}
							label={badgeDef.label}
							displayText={badgeDef.displayText(Object.fromEntries(bouncerSupportedFeatures) as Record<FeatureKey, FeatureDef>)}
							tooltip={badgeDef.tooltip}
							//color is badgedef displayColor if provided, otherwise calculate  wit getColorForBadge
							color= {badgeDef.displayColor ? badgeDef.displayColor(Object.fromEntries(bouncerSupportedFeatures) as Record<FeatureKey, FeatureDef>) : getColorForBadge(Object.fromEntries(bouncerSupportedFeatures) as Record<FeatureKey, FeatureDef>, badgeDef.linkedFeatures)}
						/>
					);
				})}
			</div>
		</div>
	);
}
