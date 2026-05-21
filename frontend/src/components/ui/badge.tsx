import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const badgeVariants = cva("inline-flex items-center text-label-caps rounded-full px-3 py-1", {
	variants: {
		variant: {
			default: "bg-surface-container-high text-on-surface",
			primary: "bg-primary-container text-on-primary-container",
			b2b: "bg-tertiary-container text-on-tertiary-container",
			b2c: "bg-secondary-container text-on-secondary-container",
			success: "bg-success-container text-on-success-container",
		},
	},
	defaultVariants: { variant: "default" },
});

export interface BadgeProps
	extends HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
	return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
