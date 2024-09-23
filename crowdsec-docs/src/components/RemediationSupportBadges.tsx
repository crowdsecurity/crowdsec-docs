import React from 'react';
import { clsx } from 'clsx';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    ToolTipArrow
} from "@site/src/ui/tooltip"


type RemediationSupportBadgesProps = {
    Prometheus: boolean; // Prometheus is a boolean that controls the color of the Prometheus bubble
    MTLS: boolean; // MTLS is a boolean that controls the color of the MTLS bubble
    Mode: boolean; // Mode is a boolean that controls the color of the Mode bubble
    Metrics: boolean; // Metrics is a boolean that controls the color of the Metrics bubble
    Appsec?: boolean; // Appsec is a boolean that controls the color of the AppSec bubble
}

const RemediationSupportBadge = ({ title, description, supported }: { title: string, description: string, supported: boolean }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className='tw-border tw-rounded-full tw-flex tw-text-black'>
                        <span className='tw-bg-slate-400 tw-px-2 tw-rounded-l-lg'>{title}</span>
                        <span className={clsx('tw-rounded-r-lg tw-px-2', { 'tw-bg-green-400': supported, 'tw-bg-red-400': !supported })}>{supported ? 'Supported' : 'Unsupported'}</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{description}</p>
                    <ToolTipArrow className='dark:tw-fill-white'/>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default function RemediationSupportBadges({ MTLS, Metrics, Prometheus, Mode, Appsec }: RemediationSupportBadgesProps): React.JSX.Element {
    return (
        <div className='tw-flex tw-justify-center tw-flex-wrap tw-mb-4 tw-gap-2'>
            {Appsec !== undefined && (
                <RemediationSupportBadge title='AppSec' description='Can forward HTTP requests to the AppSec Component' supported={Appsec} />
            )}
            <RemediationSupportBadge title='Mode' description='Can be configured in different modes, typically live or stream' supported={Mode} />
            <RemediationSupportBadge title='Metrics' description='Can send detailed metrics to LAPI' supported={Metrics} />
            <RemediationSupportBadge title='MTLS' description='Can do mutual TLS authentication to LAPI' supported={MTLS} />
            <RemediationSupportBadge title='Prometheus' description='Can expose metrics to Prometheus' supported={Prometheus} />
        </div>
    );
}