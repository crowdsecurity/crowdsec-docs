import useBaseUrl from "@docusaurus/useBaseUrl";
import { ToolTipArrow, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@site/src/ui/tooltip";
import { clsx } from "clsx";
import React from "react";

type BouncerHeaderProps = {
	title: string;
	imgSrc: string;
	description: string;
	// Badge props
	MTLS?: boolean;
	Prometheus?: boolean;
	Metrics?: boolean;
	Mode?: boolean;
	Appsec?: boolean;
};

const SupportBadge = ({ label, supported, tooltip }: { label: string; supported: boolean | string; tooltip: string }) => {
	const displayText = typeof supported === "string" ? supported : supported ? "Supported" : "Unsupported";
	const isPositive = displayText !== "Unsupported";

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="rounded-full flex text-xs font-medium shadow-sm cursor-help overflow-hidden whitespace-nowrap">
						<span className="bg-slate-700 dark:bg-slate-600 text-white px-2.5 py-1">{label}</span>
						<span
							className={clsx(
								"px-2.5 py-1",
								isPositive ? "bg-emerald-700 dark:bg-emerald-600 text-white" : "bg-red-700 dark:bg-red-500 text-white"
							)}
						>
							{displayText}
						</span>
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p>{tooltip}</p>
					<ToolTipArrow className="dark:fill-white" />
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default function BouncerHeader({
	title,
	imgSrc,
	description,
	MTLS,
	Prometheus,
	Metrics,
	Mode,
	Appsec,
}: Readonly<BouncerHeaderProps>): React.JSX.Element {
	const resolvedImg = useBaseUrl(imgSrc);

	return (
		<div
			className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 mb-6"
		>
			{/* Icon */}
			<div
				className="flex-shrink-0 rounded-lg flex items-center justify-center"
				style={{ width: 104, height: 104, background: "var(--ifm-color-emphasis-100)" }}
			>
				<img
					src={resolvedImg}
					alt={`${title} logo`}
					style={{ width: 100, height: 100, objectFit: "contain" }}
				/>
			</div>

			{/* Title + description */}
			<div className="flex flex-col gap-1 flex-1 min-w-0">
				<div className="flex items-center gap-2 flex-wrap">
					<span style={{ fontWeight: 700, fontSize: "2.1rem" }}>{title}</span>
				</div>
				<span style={{ fontSize: "0.875rem", color: "var(--ifm-color-emphasis-700)", lineHeight: 1.4 }}>{description}</span>
			</div>

			{/* Badges */}
			<div className="flex flex-row flex-wrap gap-1.5 sm:flex-col sm:items-end sm:gap-1.5">
				{Appsec !== undefined && (
					<SupportBadge
						label="AppSec"
						supported={Appsec ? "Supported" : "Unsupported"}
						tooltip="Can forward HTTP requests to the AppSec Component"
					/>
				)}
				{Mode !== undefined && (
					<SupportBadge
						label="Mode"
						supported={Mode ? "Live & Stream" : "Stream only"}
						tooltip="Can be configured in different modes, typically live or stream"
					/>
				)}
				{Metrics !== undefined && (
					<SupportBadge label="Metrics" supported={Metrics} tooltip="Can send detailed metrics to LAPI" />
				)}
				{MTLS !== undefined && (
					<SupportBadge label="MTLS" supported={MTLS} tooltip="Can do mutual TLS authentication to LAPI" />
				)}
				{Prometheus !== undefined && (
					<SupportBadge label="Prometheus" supported={Prometheus} tooltip="Can expose metrics to Prometheus" />
				)}
			</div>
		</div>
	);
}
