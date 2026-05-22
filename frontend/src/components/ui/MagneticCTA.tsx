import { useRef } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { Button, type ButtonProps } from "@/components/ui/button";

interface MagneticCTAProps extends ButtonProps {
	magnetic?: boolean;
}

/**
 * Button con efecto magnético al hover (desktop only, pointer fine).
 * Pasa todas las props al Button subyacente.
 */
export default function MagneticCTA({
	magnetic = true,
	...props
}: MagneticCTAProps) {
	const ref = useRef<HTMLButtonElement>(null);

	useMagnetic(magnetic ? ref : { current: null }, {
		strength: 0.3,
		radius: 120,
	});

	return <Button ref={ref} {...props} />;
}
