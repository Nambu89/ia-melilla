import { cn } from "@/lib/cn";

interface SkeletonProps {
	className?: string;
	width?: string | number;
	height?: string | number;
}

/**
 * Loading placeholder con animate-pulse.
 * Acepta w/h como clases tailwind via className, o width/height como style.
 */
export default function Skeleton({ className, width, height }: SkeletonProps) {
	return (
		<div
			className={cn(
				"animate-pulse rounded-md bg-surface-container-high",
				className,
			)}
			style={{ width, height }}
			aria-hidden="true"
			role="status"
		/>
	);
}
