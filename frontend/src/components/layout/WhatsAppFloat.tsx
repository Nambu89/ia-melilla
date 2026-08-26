import { MessageCircle } from "lucide-react";
import { business } from "@/content/shared";

/**
 * `stacked`: súbelo un piso para dejar sitio al chatbot, que ocupa la misma
 * esquina. Sólo lo usa `FloatingCta` cuando los dos conviven.
 */
export function WhatsAppFloat({ stacked = false }: { stacked?: boolean }) {
	return (
		<a
			href={business.whatsappUrl}
			target="_blank"
			rel="noreferrer"
			aria-label="Escríbenos por WhatsApp"
			className={`fixed ${stacked ? "bottom-24" : "bottom-5"} right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface`}
			style={{ backgroundColor: "#075E54" }}
		>
			<MessageCircle className="h-6 w-6" />
		</a>
	);
}
