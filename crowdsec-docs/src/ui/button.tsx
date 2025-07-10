import { Slot } from "@radix-ui/react-slot";
import { cn } from "@site/src/utils/index";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
	"border-0 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
	{
		variants: {
			variant: {
				default: "bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90",
				destructive: "bg-red-500 text-gray-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-gray-50 dark:hover:bg-red-900/90",
				outline:
					"border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-transparent dark:hover:bg-gray-800 dark:hover:text-gray-50",
				secondary: "bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
				ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
				link: "text-foreground dark:text-foreground bg-transparent hover:bg-gray-200 dark:hover:bg-gray-300 active:bg-gray-100 dark:active:bg-gray-400",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
			},
			color: {
				default: "",
				primary:
					"bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 dark:hover:bg-secondary",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			color: "default",
		},
	}
);

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">, VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, color, ...props }, ref) => {
	const Comp = asChild ? Slot : "button";
	return <Comp className={cn(buttonVariants({ variant, size, className, color }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
