export const demoTutorOpositoresContent = {
	hero: {
		eyebrow: "DEMO 2 · TUTOR IA PARA OPOSITORES",
		headline: "Un profesor particular que se ha leído el temario.",
		subheadline:
			"Asistente IA anclado al temario publicado de la oposición. Resuelve dudas citando el fragmento del que sale cada respuesta, te pone un test de diez preguntas y te lo corrige explicándote cada fallo.",
	},
	/**
	 * Las cuatro preguntas de ejemplo. Son el camino que recorre TODO el que
	 * entra, asi que se eligen porque funcionan contra el temario y NO por lo
	 * que miden ni por lo bien que suenan.
	 *
	 * LA REGLA, y es la unica que manda: **probar la pregunta contra el backend
	 * real y ver que devuelve 200 antes de dejarla aqui**. Un 400 en esta lista
	 * es un "no lo se" en la primera pantalla de la demo.
	 *
	 * Lo que si se sabe del rechazo, de un caso real: se cayo
	 * "¿Que es la Monarquia parlamentaria?" con "la consulta no parece estar del
	 * temario publicado". Pedia la DEFINICION de un termino que el temario
	 * menciona pero no define, asi que ningun fragmento quedo bajo el umbral. Y
	 * la que si funciona usa el vocabulario que el corpus usa de verdad: "forma
	 * politica", "Estado espanol", "Constitucion".
	 *
	 * Lo que NO vale como criterio, aunque suene razonable: aqui llego a
	 * escribirse que las preguntas COMPARATIVAS fallaban por el mismo motivo, y
	 * con eso se retiro "Explicame la diferencia entre las Cortes Generales y el
	 * Gobierno". Se probo despues contra el backend: **200, con tres fuentes**.
	 * La busqueda trae VARIOS fragmentos y el modelo compara entre ellos. La
	 * prediccion era plausible, salia de un caso real y era falsa; queda escrita
	 * para que nadie vuelva a descartar preguntas buenas con ella.
	 *
	 * Moraleja de las dos cosas juntas: el criterio orienta la busqueda, no
	 * sustituye a la llamada.
	 */
	preguntasSugeridas: [
		// Las cuatro comprobadas contra el backend real: 200 y 3 fuentes cada una.
		"¿Qué forma política tiene el Estado español según la Constitución?",
		"¿Cuáles son los derechos fundamentales y libertades públicas?",
		// De procedimiento administrativo y no de la Constitución a propósito:
		// variar de área enseña más alcance en la demo.
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
