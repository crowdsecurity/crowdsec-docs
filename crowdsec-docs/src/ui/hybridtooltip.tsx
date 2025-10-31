"use client";

import { PopoverContentProps, PopoverProps, PopoverTriggerProps } from "@radix-ui/react-popover";
import { TooltipContentProps, TooltipProps, TooltipTriggerProps } from "@radix-ui/react-tooltip";
import clsx from "clsx";
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const TouchContext = createContext<boolean | undefined>(undefined);
const useTouch = () => useContext(TouchContext);

export const TouchProvider = (props: PropsWithChildren): React.JSX.Element => {
	const [isTouch, setIsTouch] = useState<boolean>();

	useEffect(() => {
		setIsTouch(window.matchMedia("(pointer: coarse)").matches);
	}, []);

	// Conditionally provide the appropriate provider
	return (
		<TouchContext.Provider value={isTouch}>
			{isTouch ? (
				// Popover doesn't need a provider
				props.children
			) : (
				// Tooltip needs TooltipProvider
				<TooltipProvider delayDuration={300}>{props.children}</TooltipProvider>
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

	const newClassName = clsx(
		props.className,
		"bg-background dark:bg-gray-50 border border-border/40 dark:border-border border-solid rounded-md px-2 text-sm dark:font-medium"
	);

	return isTouch ? <PopoverContent {...props} className={newClassName} /> : <TooltipContent {...props} className={newClassName} />;
};
