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

const RemediationSupportBadge = ({ title, description, support }: { title: string, description: string, support: string }) => {
    //ugly, for test
    const colorClass = support === 'Unsupported' ? 'tw-bg-red-400' : 'tw-bg-green-400';    
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className='tw-border tw-rounded-full tw-flex tw-text-black'>
                        <span className='tw-bg-slate-400 tw-px-2 tw-rounded-l-lg'>{title}</span>
                        <span className={clsx('tw-rounded-r-lg tw-px-2', colorClass)}>{support}</span>
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
    const mtlsSupport = MTLS ? 'Supported' : 'Unsupported';
    const metricsSupport = Metrics ? 'Supported' : 'Unsupported';
    const prometheusSupport = Prometheus ? 'Supported' : 'Unsupported';
    const modeSupport = Mode ? 'Live & Stream' : 'Live only';
    const appsecSupport = (Appsec !== undefined && Appsec) ? 'Supported' : 'Unsupported';

    return (
        <div className='tw-flex tw-justify-center tw-flex-wrap tw-mb-4 tw-gap-2'>
            {Appsec !== undefined && (
                <RemediationSupportBadge title='AppSec' description='Can forward HTTP requests to the AppSec Component' support={appsecSupport} />
            )}
            <RemediationSupportBadge title='Mode' description='Can be configured in different modes, typically live or stream' support={modeSupport} />
            <RemediationSupportBadge title='Metrics' description='Can send detailed metrics to LAPI' support={metricsSupport} />
            <RemediationSupportBadge title='MTLS' description='Can do mutual TLS authentication to LAPI' support={mtlsSupport} />
            <RemediationSupportBadge title='Prometheus' description='Can expose metrics to Prometheus' support={prometheusSupport} />
        </div>
    );
}