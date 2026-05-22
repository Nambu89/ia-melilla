import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FormFieldProps {
	label: string;
	htmlFor: string;
	hint?: string;
	error?: string;
	required?: boolean;
	className?: string;
	children: ReactNode;
}

export function FormField({
	label,
	htmlFor,
	hint,
	error,
	required,
	className,
	children,
}: FormFieldProps) {
	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<label
				htmlFor={htmlFor}
				className="text-label-lg font-medium text-on-surface"
			>
				{label}
				{required && (
					<span className="ml-1 text-primary" aria-hidden>
						*
					</span>
				)}
			</label>
			{children}
			{hint && !error && (
				<p className="text-body-sm text-on-surface-muted">{hint}</p>
			)}
			{error && (
				<p className="text-body-sm text-error" role="alert">
					{error}
				</p>
			)}
		</div>
	);
}
