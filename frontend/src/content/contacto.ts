export const contactoContent = {
	hero: {
		eyebrow: "CONTACTO",
		headline: "¿Cómo podemos ayudarte?",
		subheadline:
			"Cuéntanos tu caso. Respondemos el mismo día laborable. Si urge, escríbenos por WhatsApp.",
	},
	form: {
		fields: {
			nombre: { label: "Nombre", required: true },
			email: { label: "Email", required: true },
			telefono: { label: "Teléfono (opcional)", required: false },
			audience: {
				label: "Soy",
				required: true,
				options: [
					{ value: "empresa", label: "Empresa o autónomo" },
					{ value: "particular", label: "Particular" },
				],
			},
			mensaje: {
				label: "Cuéntanos",
				required: true,
				placeholder: "Qué problema te gustaría resolver con IA, o qué duda tienes",
			},
			consent: {
				label: "He leído y acepto la política de privacidad",
				required: true,
			},
		},
		submitLabel: "Enviar consulta →",
		successMessage:
			"Gracias. Hemos recibido tu consulta. Te respondemos en menos de 24 horas laborables.",
		errorMessage:
			"Algo no salió bien. Inténtalo de nuevo o escríbenos directamente por WhatsApp.",
	},
} as const;
