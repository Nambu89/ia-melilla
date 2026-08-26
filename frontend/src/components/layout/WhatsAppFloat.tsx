import { MessageCircle } from "lucide-react";
import { business } from "@/content/shared";

/**
 * `stacked`: súbelo un piso para dejar sitio al chatbot, que ocupa la misma
 * esquina. Sólo lo usa `FloatingCta` cuando los dos conviven.
 *
 * El `min(...)` con `--cookie-banner-height` lo aparta por encima del banner de
 * cookies mientras esté a la vista (ver `components/cookies/CookieBanner.tsx`),
 * pero sin subir más allá de la cabecera: en pantallas muy bajas —un móvil
 * apaisado, un 320x568— el banner ocupa casi todo el alto, y apartarse del todo
 * sacaría el botón de la ventana o lo pondría encima del menú. El tope son
 * 9rem: 5 de cabecera, 3,5 de botón y media de aire. Cuando ese tope actúa, el
 * botón acaba sobre el banner, que es el orden correcto —el botón es acción y
 * el banner informativo— y para eso lleva `z-[65]`, por encima del banner (60).
 */
export function WhatsAppFloat({ stacked = false }: { stacked?: boolean }) {
	return (
		<a
			href={business.whatsappUrl}
			target="_blank"
			rel="noreferrer"
			aria-label="Escríbenos por WhatsApp"
			className={`fixed ${
				stacked
					? "bottom-[min(calc(6rem+var(--cookie-banner-height,0px)),calc(100dvh-9rem))] [html[data-cookie-banner]_&]:hidden"
					: "bottom-[min(calc(1.25rem+var(--cookie-banner-height,0px)),calc(100dvh-9rem))]"
			} right-5 z-[65] flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface`}
			style={{ backgroundColor: "#075E54" }}
		>
			<MessageCircle className="h-6 w-6" />
		</a>
	);
}
