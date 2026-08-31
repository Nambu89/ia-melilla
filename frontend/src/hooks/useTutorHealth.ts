import { useEffect, useRef, useState } from "react";
import { consultarSalud, type SaludDelTutor } from "@/lib/tutorApi";

interface EstadoDeSalud {
	salud: SaludDelTutor | null;
	/** El LLM está apagado (sin crédito): nada de lo que se pida va a contestar. */
	desactivado: boolean;
	/**
	 * No se pudo contactar con `/salud`: red caída, CORS mal puesto o la URL
	 * del backend apuntando a donde no es.
	 *
	 * Es distinto de `desactivado` y no bloquea nada: `/salud` puede no llegar y
	 * el resto funcionar. Lo que sí hace es dar una pista VISIBLE, porque si no
	 * el único sitio donde se ve un fallo de CORS es la consola del navegador, y
	 * aquí no se le pide a nadie que la abra.
	 */
	inalcanzable: boolean;
}

/**
 * `/salud` compartido entre todos los que lo pidan.
 *
 * Cada página del tutor monta dos o tres consumidores a la vez (el aviso y la
 * propia herramienta) y no tiene sentido preguntar lo mismo tres veces. Se
 * cachea SOLO el acierto: si falla, el siguiente montaje vuelve a intentarlo,
 * que un backend que estaba reiniciándose se recupera y no queremos arrastrar
 * el aviso el resto de la sesión.
 */
let cacheDeSalud: SaludDelTutor | null = null;
let peticionEnVuelo: Promise<SaludDelTutor> | null = null;

function saludCompartida(): Promise<SaludDelTutor> {
	if (cacheDeSalud) return Promise.resolve(cacheDeSalud);
	if (peticionEnVuelo) return peticionEnVuelo;
	// Sin `signal` a propósito: es una petición compartida y el desmontaje de
	// uno no puede cancelársela a los demás. `consultarSalud` ya trae su propio
	// tiempo máximo de 15 s.
	peticionEnVuelo = consultarSalud()
		.then((datos) => {
			cacheDeSalud = datos;
			return datos;
		})
		.finally(() => {
			peticionEnVuelo = null;
		});
	return peticionEnVuelo;
}

/** Solo para los tests: olvida lo que se cacheó. */
export function olvidarSaludCacheada(): void {
	cacheDeSalud = null;
	peticionEnVuelo = null;
}

/**
 * Consulta `/salud` al montar y distingue los dos fallos, que no son el mismo.
 *
 * `llm_desactivado` es el latch vivo: el modelo está apagado y no va a
 * contestar. `llm.chat` NO sirve para esto: la comprobación de arranque gasta
 * un presupuesto de cinco tokens y los modelos que razonan lo agotan pensando,
 * así que puede decir "error" con el tutor funcionando perfectamente.
 *
 * Que `/salud` no conteste es otra cosa distinta y tampoco apaga nada: la
 * herramienta puede ir bien aunque el chequeo no llegue.
 */
export function useTutorHealth(): EstadoDeSalud {
	const [salud, setSalud] = useState<SaludDelTutor | null>(cacheDeSalud);
	const [inalcanzable, setInalcanzable] = useState(false);
	const montadoRef = useRef(true);

	useEffect(() => {
		montadoRef.current = true;
		saludCompartida()
			.then((datos) => {
				if (!montadoRef.current) return;
				setSalud(datos);
				setInalcanzable(false);
			})
			.catch(() => {
				if (!montadoRef.current) return;
				setInalcanzable(true);
			});
		return () => {
			montadoRef.current = false;
		};
	}, []);

	return { salud, desactivado: salud?.llm_desactivado === true, inalcanzable };
}
