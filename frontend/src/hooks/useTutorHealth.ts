import { useEffect, useRef, useState } from "react";
import { consultarSalud, type SaludDelTutor } from "@/lib/tutorApi";

interface EstadoDeSalud {
	salud: SaludDelTutor | null;
	/** El LLM está apagado (sin crédito): nada de lo que se pida va a contestar. */
	desactivado: boolean;
}

/**
 * Consulta `/salud` una vez al montar, para avisar si el tutor está apagado.
 *
 * Solo mira `llm_desactivado`, que es el latch vivo. `llm.chat` NO sirve para
 * esto: la comprobación de arranque gasta un presupuesto de cinco tokens y los
 * modelos que razonan lo agotan pensando, así que puede decir "error" con el
 * tutor funcionando perfectamente. Bloquear la interfaz por ese campo dejaría
 * la demo apagada sin motivo.
 *
 * Si `/salud` falla no se propaga nada: un chequeo caído no puede impedir que
 * alguien use la herramienta, que a lo mejor va bien.
 */
export function useTutorHealth(): EstadoDeSalud {
	const [salud, setSalud] = useState<SaludDelTutor | null>(null);
	const montadoRef = useRef(true);

	useEffect(() => {
		montadoRef.current = true;
		const controlador = new AbortController();
		consultarSalud(controlador.signal)
			.then((datos) => {
				if (montadoRef.current) setSalud(datos);
			})
			.catch(() => {
				// Silencio deliberado: ver la cabecera.
			});
		return () => {
			montadoRef.current = false;
			controlador.abort();
		};
	}, []);

	return { salud, desactivado: salud?.llm_desactivado === true };
}
