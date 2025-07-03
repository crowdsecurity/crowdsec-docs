import React from 'react';
import { TouchProvider, HybridTooltip, HybridTooltipTrigger, HybridTooltipContent } from '@site/src/ui/hybridtooltip';

export default function UnderlineTooltip({ children, tooltip }) {
    return (
        <TouchProvider>
            <HybridTooltip delayDuration={300}>
                <HybridTooltipTrigger asChild>
                    <span className="tw-underline tw-decoration-dashed tw-decoration-1 tw-decoration-gray-700 tw-cursor-help hover:tw-decoration-gray-900 dark:tw-decoration-gray-300 dark:hover:tw-decoration-gray-100 tw-underline-offset-2">
                        {children}
                    </span>
                </HybridTooltipTrigger>
                <HybridTooltipContent>
                    <p>{tooltip}</p>
                </HybridTooltipContent>
            </HybridTooltip>
        </TouchProvider>
    );
}