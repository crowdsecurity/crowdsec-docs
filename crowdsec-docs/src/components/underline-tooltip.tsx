import { HybridTooltip, HybridTooltipContent, HybridTooltipTrigger, TouchProvider } from "@site/src/ui/hybridtooltip";
import React from "react";

export default function UnderlineTooltip({ children, tooltip }): React.JSX.Element {
	return (
		<TouchProvider>
			<HybridTooltip delayDuration={300}>
				<HybridTooltipTrigger asChild>
					<span className="underline decoration-dashed decoration-1 duration-300 decoration-border dark:decoration-foreground cursor-help hover:decoration-foreground/80 underline-offset-2">
						{children}
					</span>
				</HybridTooltipTrigger>
				<HybridTooltipContent>{tooltip}</HybridTooltipContent>
			</HybridTooltip>
		</TouchProvider>
	);
}
