import { useState } from "react";
import { ChatWidget } from "@/components/chat-widget/ChatWidget";
import { ChatWidgetBoundary } from "@/components/chat-widget/ChatWidgetBoundary";
import { WhatsAppFloat } from "./WhatsAppFloat";

type FloatingCtaMode = "whatsapp" | "chat" | "ambos";

/**
 * Qué se pinta en la esquina inferior derecha de todas las páginas.
 *
 * DECISIÓN DE PRODUCTO, pendiente. El chatbot captador de leads nació para
 * SUSTITUIR al botón de WhatsApp, pero no está decidido si se sustituye o si
 * conviven. Para cambiarlo basta con tocar esta constante: es el único sitio
 * donde está escrita la decisión.
 *
 *   "whatsapp" → sólo el enlace a WhatsApp (lo que hay hoy en producción)
 *   "chat"     → sólo el chatbot; sustituye a WhatsApp
 *   "ambos"    → los dos, con WhatsApp apilado justo encima del chat
 *
 * Por qué "whatsapp" de momento: el backend del chatbot (`/api/lead-chat`) no
 * está desplegado en ningún entorno. Vive en la PR #45 de Nambu89/Impuestify,
 * sin mergear, y detrás de `LEADBOT_ENABLED`, que viene apagado. Enseñar hoy el
 * chat sería poner en toda la web un botón que sólo sabe devolver un error.
 */
export const FLOATING_CTA: FloatingCtaMode = "whatsapp";

/**
 * El widget necesita saber contra qué backend hablar. Si el build salió sin
 * `VITE_API_BASE_URL`, `fetch` acabaría pidiendo `undefined/api/lead-chat/start`,
 * así que preferimos no pintarlo y quedarnos con WhatsApp.
 */
function chatWidgetIsUsable(): boolean {
	const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
	return Boolean(baseUrl && baseUrl.trim());
}

export function FloatingCta() {
	const [chatRoto, setChatRoto] = useState(false);

	const showChat =
		FLOATING_CTA !== "whatsapp" && chatWidgetIsUsable() && !chatRoto;
	// WhatsApp es también la red de seguridad: si el chat no se puede pintar —o
	// se ha caído—, el visitante no se queda sin ninguna forma de contactar.
	const showWhatsApp = FLOATING_CTA !== "chat" || !showChat;

	return (
		<>
			{showChat && (
				<ChatWidgetBoundary onCrash={() => setChatRoto(true)}>
					<ChatWidget />
				</ChatWidgetBoundary>
			)}
			{showWhatsApp && <WhatsAppFloat stacked={showChat} />}
		</>
	);
}
