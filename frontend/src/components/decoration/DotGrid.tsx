import { cn } from "@/lib/cn";

interface DotGridProps {
	className?: string;
	dotColor?: string;
	dotSize?: number;
	gap?: number;
	fadeRadius?: string;
}

export default function DotGrid({
	className,
	dotColor = "rgba(0, 94, 196, 0.18)",
	dotSize = 1,
	gap = 24,
	fadeRadius = "60%",
}: DotGridProps) {
	const backgroundImage = `radial-gradient(circle at center, ${dotColor} ${dotSize}px, transparent ${dotSize + 0.5}px)`;
	const maskImage = `radial-gradient(ellipse at center, #000 0%, transparent ${fadeRadius})`;

	return (
		<div
			aria-hidden
			className={cn(
				"pointer-events-none absolute inset-0 overflow-hidden",
				className,
			)}
			style={{
				backgroundImage,
				backgroundSize: `${gap}px ${gap}px`,
				WebkitMaskImage: maskImage,
				maskImage,
			}}
		/>
	);
}
