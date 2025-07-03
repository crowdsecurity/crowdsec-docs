'use client';

import React from 'react';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { TooltipContentProps, TooltipProps, TooltipTriggerProps } from '@radix-ui/react-tooltip';
import { PopoverContentProps, PopoverProps, PopoverTriggerProps } from '@radix-ui/react-popover';

const TouchContext = createContext<boolean | undefined>(undefined);
const useTouch = () => useContext(TouchContext);

export const TouchProvider = (props: PropsWithChildren) => {
  const [isTouch, setTouch] = useState<boolean>();

  useEffect(() => {
    setTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  // Conditionally provide the appropriate provider
  return (
    <TouchContext.Provider value={isTouch}>
      {isTouch ? (
        // Popover doesn't need a provider
        <>{props.children}</>
      ) : (
        // Tooltip needs TooltipProvider
        <TooltipProvider delayDuration={300}>
          {props.children}
        </TooltipProvider>
      )}
    </TouchContext.Provider>
  );
};

export const HybridTooltip = (props: TooltipProps & PopoverProps) => {
  const isTouch = useTouch();

  return isTouch ? <Popover {...props} /> : <Tooltip {...props} />;
};

export const HybridTooltipTrigger = (props: TooltipTriggerProps & PopoverTriggerProps) => {
  const isTouch = useTouch();

  return isTouch ? <PopoverTrigger {...props} /> : <TooltipTrigger {...props} />;
};

export const HybridTooltipContent = (props: TooltipContentProps & PopoverContentProps) => {
  const isTouch = useTouch();

  return isTouch ? <PopoverContent {...props} /> : <TooltipContent {...props} />;
};
