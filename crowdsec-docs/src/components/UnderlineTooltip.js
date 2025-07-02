import React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@site/src/ui/tooltip';

export default function UnderlineTooltip({ children, tooltip }) {
    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="tw-underline tw-decoration-dashed tw-decoration-1 tw-decoration-gray-700 tw-cursor-help hover:tw-decoration-gray-900 dark:tw-decoration-gray-300 dark:hover:tw-decoration-gray-100 tw-underline-offset-2">
                        {children}
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}