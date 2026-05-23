import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/cn";

interface AuroraBackgroundProps {
	className?: string;
}

export default function AuroraBackground({ className }: AuroraBackgroundProps) {
	const { resolvedTheme } = useTheme();

	if (resolvedTheme === "light") {
		return (
			<div
				aria-hidden
				className={cn(
					"pointer-events-none absolute inset-0 overflow-hidden",
					className,
				)}
			>
				<div
					className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full blur-3xl"
					style={{
						background:
							"radial-gradient(circle at center, rgba(0,94,196,0.08) 0%, rgba(0,94,196,0.04) 50%, transparent 75%)",
					}}
				/>
				<div
					className="absolute top-1/3 right-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/3 rounded-full blur-3xl"
					style={{
						background:
							"radial-gradient(circle at center, rgba(0,94,196,0.06) 0%, transparent 70%)",
					}}
				/>
			</div>
		);
	}

	return (
		<div
			aria-hidden
			className={cn(
				"pointer-events-none absolute inset-0 overflow-hidden",
				className,
			)}
		>
			<div
				className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full blur-3xl animate-aurora-pulse"
				style={{
					background:
						"radial-gradient(circle at center, rgba(0,94,196,0.22) 0%, rgba(0,94,196,0.10) 40%, transparent 70%)",
					mixBlendMode: "screen",
				}}
			/>
			<div
				className="absolute top-1/3 right-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/3 rounded-full blur-3xl animate-aurora-pulse"
				style={{
					background:
						"radial-gradient(circle at center, rgba(42,120,216,0.14) 0%, rgba(0,94,196,0.06) 50%, transparent 75%)",
					mixBlendMode: "screen",
					animationDelay: "-7s",
				}}
			/>
			<div
				className="absolute -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full blur-3xl animate-aurora-pulse"
				style={{
					background:
						"radial-gradient(circle at center, rgba(82,148,232,0.12) 0%, transparent 70%)",
					mixBlendMode: "screen",
					animationDelay: "-13s",
				}}
			/>
		</div>
	);
}
