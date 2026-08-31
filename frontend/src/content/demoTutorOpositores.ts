export const demoTutorOpositoresContent = {
	hero: {
		eyebrow: "DEMO 2 · TUTOR IA PARA OPOSITORES",
		headline: "Un profesor particular que se ha leído el temario.",
		subheadline:
			"Asistente IA anclado al temario publicado de la oposición. Resuelve dudas citando el fragmento del que sale cada respuesta, te pone un test de diez preguntas y te lo corrige explicándote cada fallo.",
	},
	/**
	 * Las cuatro preguntas de ejemplo. Son el camino que recorre TODO el que
	 * entra, asi que se eligen por que funcionan contra el temario y NO por lo
	 * que miden ni por lo bien que suenan.
	 *
	 * El criterio, aprendido de una que se rechazo: usar el vocabulario que el
	 * corpus usa de verdad —"forma politica", "Estado espanol"— y NO pedir
	 * definiciones de terminos que el temario menciona pero no define, ni
	 * comparaciones entre dos cosas que ningun fragmento pone juntas. La valla
	 * del backend mide distancia a un fragmento: si no hay ninguno cerca,
	 * rechaza, y hace bien.
	 *
	 * ANTES DE TOCAR ESTA LISTA: probar la pregunta contra el backend real y
	 * comprobar que devuelve 200. Un 400 aqui es un "no lo se" en la primera
	 * pantalla de la demo.
	 */
	preguntasSugeridas: [
		// Comprobada contra el backend real: 200, con 3 fuentes.
		"¿Qué forma política tiene el Estado español según la Constitución?",
		"¿Cuáles son los derechos fundamentales y libertades públicas?",
		"¿Qué plazo hay para interponer un recurso de alzada?",
		"¿Qué dice la Constitución sobre la organización territorial del Estado?",
	],
	comoFunciona: {
		eyebrow: "POR QUÉ NO ES UN CHATGPT CON OTRO NOMBRE",
		headline: "Todo lo que dice viene del temario, y te lo enseña.",
		body: [
			"Un modelo de propósito general contesta a cualquier cosa con la misma seguridad, acierte o no. En una oposición eso no vale: una respuesta inventada te la aprendes igual de bien que una correcta, y te enteras en el examen.",
			"Este tutor busca primero en el temario publicado, y solo redacta con los fragmentos que ha encontrado. Cada respuesta lleva sus citas al lado para que compruebes de dónde sale. Si la pregunta no está en el temario, lo dice y no contesta: preferimos un «no lo sé» a un párrafo bien escrito y falso.",
			"Lo mismo con las preguntas de test: no se las inventa. Las construye a partir de un fragmento concreto del temario y te enseña ese fragmento junto a la pregunta.",
		],
		/**
		 * `temasIndexados` es el respaldo: la página pregunta el número real a
		 * `/temas` al cargar y solo cae aquí si el backend no contesta. Un dato
		 * escrito a mano en una demo envejece sin que nadie se entere.
		 */
		temasIndexados: 23,
		stats: [
			{ value: 10, label: "Preguntas por test", hint: "con corrección explicada" },
			{ value: 3, label: "Herramientas", hint: "abiertas en esta demo" },
		],
	},
	cierre: {
		eyebrow: "¿TIENES UNA ACADEMIA O UN TEMARIO PROPIO?",
		headline:
			"El mismo motor, con tu temario y tu marca dentro.",
		body: "Lo que ves aquí funciona con cualquier corpus de documentos: temarios de otras oposiciones, manuales de formación, normativa interna. Cuéntanos qué material tienes y te decimos qué se puede montar con él.",
	},
} as const;
