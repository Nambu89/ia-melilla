import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/cn";

interface AuroraBackgroundProps {
	className?: string;
}

export default function AuroraBackground({ className }: AuroraBackgroundProps) {
	const { resolvedTheme } = useTheme();
	if (resolvedTheme === "light") return null;

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
						"radial-gradient(circle at center, rgba(16,185,129,0.18) 0%, rgba(5,150,105,0.10) 40%, transparent 70%)",
					mixBlendMode: "screen",
				}}
			/>
			<div
				className="absolute top-1/3 right-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/3 rounded-full blur-3xl animate-aurora-pulse"
				style={{
					background:
						"radial-gradient(circle at center, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.06) 50%, transparent 75%)",
					mixBlendMode: "screen",
					animationDelay: "-7s",
				}}
			/>
			<div
				className="absolute -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full blur-3xl animate-aurora-pulse"
				style={{
					background:
						"radial-gradient(circle at center, rgba(52,211,153,0.10) 0%, transparent 70%)",
					mixBlendMode: "screen",
					animationDelay: "-13s",
				}}
			/>
		</div>
	);
}
