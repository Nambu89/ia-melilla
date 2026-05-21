import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
	"inline-flex items-center justify-center font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:pointer-events-none rounded-md",
	{
		variants: {
			variant: {
				primary: "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active",
				secondary:
					"bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
				ghost: "bg-transparent text-on-surface hover:bg-surface-container-low",
				outline:
					"bg-transparent text-on-surface border border-outline hover:bg-surface-container-low",
				b2b: "bg-tertiary-container text-on-tertiary-container hover:opacity-90",
				b2c: "bg-secondary-container text-on-secondary-container hover:opacity-90",
			},
			size: {
				sm: "h-9 px-4 text-label-md",
				md: "h-11 px-6 text-label-lg",
				lg: "h-14 px-8 text-label-lg",
			},
		},
		defaultVariants: { variant: "primary", size: "md" },
	},
);

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
		);
	},
);
Button.displayName = "Button";

export { buttonVariants };
