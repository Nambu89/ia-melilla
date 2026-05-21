import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
	({ className, ...props }, ref) => (
		<input
			ref={ref}
			className={cn(
				"h-11 w-full bg-surface-container-low text-on-surface text-body-md rounded-md px-4 py-3 placeholder:text-on-surface-muted focus:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed",
				className,
			)}
			{...props}
		/>
	),
);
Input.displayName = "Input";
