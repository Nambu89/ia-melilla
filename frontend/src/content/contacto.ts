export const contactoContent = {
	hero: {
		eyebrow: "CONTACTO",
		headline: "¿Como podemos ayudarte?",
		subheadline:
			"Cuentanos tu caso. Respondemos el mismo dia laborable. Si urge, escribenos por WhatsApp.",
	},
	form: {
		fields: {
			nombre: { label: "Nombre", required: true },
			email: { label: "Email", required: true },
			telefono: { label: "Telefono (opcional)", required: false },
			audience: {
				label: "Soy",
				required: true,
				options: [
					{ value: "empresa", label: "Empresa o autonomo" },
					{ value: "particular", label: "Particular" },
				],
			},
			mensaje: {
				label: "Cuentanos",
				required: true,
				placeholder: "Que problema te gustaria resolver con IA, o que duda tienes",
			},
			consent: {
				label: "He leido y acepto la politica de privacidad",
				required: true,
			},
		},
		submitLabel: "Enviar consulta →",
		successMessage:
			"Gracias. Hemos recibido tu consulta. Te respondemos en menos de 24 horas laborables.",
		errorMessage: "Algo no fue. Intentalo de nuevo o escribenos directamente por WhatsApp.",
	},
} as const;
