import { ToolTipArrow, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@site/src/ui/tooltip";
import { clsx } from "clsx";
import React from "react";

type RemediationSupportBadgesProps = {
	Prometheus: boolean; // Prometheus is a boolean that controls the color of the Prometheus bubble
	MTLS: boolean; // MTLS is a boolean that controls the color of the MTLS bubble
	Mode: boolean; // Mode is a boolean that controls the color of the Mode bubble
	Metrics: boolean; // Metrics is a boolean that controls the color of the Metrics bubble
	Appsec?: boolean; // Appsec is a boolean that controls the color of the AppSec bubble
};

const RemediationSupportBadge = ({ title, description, support }: { title: string; description: string; support: string }) => {
	//ugly, for test
	const colorClass = support === "Unsupported" ? "bg-red-400" : "bg-green-400";
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="border rounded-full flex text-black">
						<span className="bg-slate-400 px-2 rounded-l-lg">{title}</span>
						<span className={clsx("rounded-r-lg px-2", colorClass)}>{support}</span>
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p>{description}</p>
					<ToolTipArrow className="dark:fill-white" />
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default function RemediationSupportBadges({
	MTLS,
	Metrics,
	Prometheus,
	Mode,
	Appsec,
}: Readonly<RemediationSupportBadgesProps>): React.JSX.Element {
	const mtlsSupport = MTLS ? "Supported" : "Unsupported";
	const metricsSupport = Metrics ? "Supported" : "Unsupported";
	const prometheusSupport = Prometheus ? "Supported" : "Unsupported";
	const modeSupport = Mode ? "Live & Stream" : "Stream only";
	const appsecSupport = Appsec !== undefined && Appsec ? "Supported" : "Unsupported";

	return (
		<div className="flex justify-center flex-wrap mb-4 gap-2">
			{Appsec !== undefined && (
				<RemediationSupportBadge
					title="AppSec"
					description="Can forward HTTP requests to the AppSec Component"
					support={appsecSupport}
				/>
			)}
			<RemediationSupportBadge
				title="Mode"
				description="Can be configured in different modes, typically live or stream"
				support={modeSupport}
			/>
			<RemediationSupportBadge title="Metrics" description="Can send detailed metrics to LAPI" support={metricsSupport} />
			<RemediationSupportBadge title="MTLS" description="Can do mutual TLS authentication to LAPI" support={mtlsSupport} />
			<RemediationSupportBadge title="Prometheus" description="Can expose metrics to Prometheus" support={prometheusSupport} />
		</div>
	);
}
