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
				label:
					"He leído y acepto la Política de Privacidad y el Aviso Legal de iamelilla.com.",
				required: true,
			},
			marketing: {
				label:
					"Acepto recibir comunicaciones comerciales sobre servicios, novedades y demos de IA Melilla por email o WhatsApp. Puedo revocar este consentimiento en cualquier momento.",
				required: false,
			},
		},
		legalInfo: {
			responsable: "Joaquín Gorge Lucianez (IA Melilla)",
			finalidad:
				"Atender tu consulta y, si lo autorizas, enviarte comunicaciones comerciales.",
			legitimacion: "Tu consentimiento expreso.",
			destinatarios:
				"No se cederán datos a terceros, salvo obligación legal.",
			derechos:
				"Acceso, rectificación, supresión, oposición, portabilidad y limitación.",
		},
		submitLabel: "Enviar consulta →",
		successMessage:
			"Gracias. Hemos recibido tu consulta. Te respondemos en menos de 24 horas laborables.",
		errorMessage:
			"Algo no salió bien. Inténtalo de nuevo o escríbenos directamente por WhatsApp.",
	},
} as const;
