import * as Tooltip from "@radix-ui/react-tooltip";
import { Monitor, Sun, Moon } from "lucide-react";
import { useTheme, type ThemeValue } from "@/hooks/useTheme";
import { cn } from "@/lib/cn";

const CYCLE: ThemeValue[] = ["system", "dark", "light"];

const ICONS = {
	system: Monitor,
	dark: Moon,
	light: Sun,
} as const;

const LABELS = {
	system: "Sistema (automático)",
	dark: "Modo oscuro",
	light: "Modo claro",
} as const;

/**
 * Botón icon-only que cicla system → dark → light → system.
 * Tooltip Radix muestra el estado actual.
 */
export default function ThemeToggle({ className }: { className?: string }) {
	const { theme, setTheme } = useTheme();

	const handleClick = () => {
		const idx = CYCLE.indexOf(theme);
		const next = CYCLE[(idx + 1) % CYCLE.length];
		setTheme(next);
	};

	const Icon = ICONS[theme];

	return (
		<Tooltip.Provider delayDuration={400}>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<button
						onClick={handleClick}
						aria-label={`Tema actual: ${LABELS[theme]}. Haz clic para cambiar.`}
						className={cn(
							"flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors duration-150 hover:bg-surface-container-high hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
							className,
						)}
					>
						<Icon size={18} aria-hidden="true" />
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						sideOffset={6}
						className="z-50 rounded-lg bg-surface-container-high px-3 py-1.5 text-label-md text-on-surface shadow-md"
					>
						{LABELS[theme]}
						<Tooltip.Arrow className="fill-surface-container-high" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
