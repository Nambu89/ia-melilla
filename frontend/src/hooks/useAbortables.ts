import { useCallback, useEffect, useRef } from "react";

/**
 * Lleva la cuenta de TODAS las peticiones en vuelo y las corta al desmontar.
 *
 * Un solo `useRef` con el último `AbortController` no vale cuando puede haber
 * varias a la vez —diez contestaciones del test, la carga de temas y una
 * generación—: guardar solo la última deja las demás corriendo, y algunas
 * cuestan una llamada al modelo.
 *
 * `montado` se expone para que quien resuelva después del desmontaje no toque
 * el estado: abortar corta la petición, pero una que ya había respondido sigue
 * su camino hasta el `then`.
 */
export function useAbortables() {
	const enVuelo = useRef(new Set<AbortController>());
	const montado = useRef(true);

	useEffect(() => {
		montado.current = true;
		const conjunto = enVuelo.current;
		return () => {
			montado.current = false;
			conjunto.forEach((controlador) => controlador.abort());
			conjunto.clear();
		};
	}, []);

	const nuevo = useCallback(() => {
		const controlador = new AbortController();
		// Si ya se desmontó, el controlador nace abortado: una petición encolada
		// puede pedir el suyo DESPUÉS de la limpieza, y uno nuevo y sano se
		// escaparía de la red que acabamos de recoger.
		if (!montado.current) {
			controlador.abort();
			return controlador;
		}
		enVuelo.current.add(controlador);
		return controlador;
	}, []);

	const soltar = useCallback((controlador: AbortController) => {
		enVuelo.current.delete(controlador);
	}, []);

	return { nuevo, soltar, montado };
}
