import { lazy, Suspense } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

const Aurora = lazy(() => import("@/components/reactbits/Aurora"));

interface AuroraBackgroundProps {
	className?: string;
}

const DARK_COLOR_STOPS = ["#005EC4", "#2A78D8", "#0A0A0A"];

function StaticFallback({
	className,
	light,
}: {
	className?: string;
	light: boolean;
}) {
	const intensity = light ? 0.08 : 0.22;
	const secondaryIntensity = light ? 0.04 : 0.1;
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
					background: `radial-gradient(circle at center, rgba(0,94,196,${intensity}) 0%, rgba(0,94,196,${secondaryIntensity}) 50%, transparent 75%)`,
				}}
			/>
			<div
				className="absolute top-1/3 right-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/3 rounded-full blur-3xl"
				style={{
					background: `radial-gradient(circle at center, rgba(42,120,216,${secondaryIntensity * 1.5}) 0%, transparent 70%)`,
				}}
			/>
		</div>
	);
}

export default function AuroraBackground({ className }: AuroraBackgroundProps) {
	const { resolvedTheme } = useTheme();
	const reduced = useReducedMotion();
	const isLight = resolvedTheme === "light";

	if (isLight || reduced) {
		return <StaticFallback className={className} light={isLight} />;
	}

	return (
		<div
			aria-hidden
			className={cn(
				"pointer-events-none absolute inset-0 overflow-hidden",
				className,
			)}
			style={{ opacity: 0.7 }}
		>
			<Suspense fallback={<StaticFallback light={false} />}>
				<Aurora
					colorStops={DARK_COLOR_STOPS}
					amplitude={0.9}
					blend={0.45}
					speed={0.6}
				/>
			</Suspense>
		</div>
	);
}
