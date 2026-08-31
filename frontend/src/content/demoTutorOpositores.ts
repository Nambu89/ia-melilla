export const demoTutorOpositoresContent = {
	hero: {
		eyebrow: "DEMO 2 · TUTOR IA PARA OPOSITORES",
		headline: "Un profesor particular que se ha leído el temario.",
		subheadline:
			"Asistente IA anclado al temario publicado de la oposición. Resuelve dudas citando el fragmento del que sale cada respuesta, te pone un test de diez preguntas y te lo corrige explicándote cada fallo.",
	},
	preguntasSugeridas: [
		"¿Qué es la Monarquía parlamentaria?",
		"¿Cuáles son los derechos fundamentales y libertades públicas?",
		"Explícame la diferencia entre las Cortes Generales y el Gobierno.",
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
