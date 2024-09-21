import React from 'react';
import { clsx } from 'clsx';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    ToolTipArrow
} from "@site/src/ui/tooltip"


type RemediationSupportTableProps = {
    Prometheus: boolean;
    MTLS: boolean;
    Stream: boolean;
    Live: boolean;
    Metrics: boolean;
}

const RemediationSupportItem = ({ title, description, supported }: { title: string, description: string, supported: boolean }) => {
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

export default function RemediationSupportTable({ MTLS, Metrics, Prometheus, Live, Stream }: RemediationSupportTableProps): React.JSX.Element {
    return (
        <div className='tw-flex tw-justify-center tw-flex-wrap tw-mb-4 tw-gap-2'>
            <RemediationSupportItem title='Metrics' description='Can send detailed metrics to LAPI' supported={Metrics} />
            <RemediationSupportItem title='MTLS' description='Can do mutual TLS authentication to LAPI' supported={MTLS} />
            <RemediationSupportItem title='Prometheus' description='Can expose metrics to Prometheus' supported={Prometheus} />
            <RemediationSupportItem title='Live' description='Can use live endpoint on LAPI' supported={Live} />
            <RemediationSupportItem title='Stream' description='Can use stream endpoint on LAPI' supported={Stream} />
        </div>
    );
}