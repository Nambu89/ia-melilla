import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	/** Se avisa una vez para que el padre pueda ofrecer otra vía de contacto. */
	onCrash?: () => void;
}

interface State {
	crashed: boolean;
}

/**
 * Aísla al chatbot del resto de la página.
 *
 * El widget se pinta en `PageShell`, es decir en TODAS las rutas del sitio. Sin
 * esta frontera, cualquier excepción al renderizarlo desmontaría el árbol entero
 * y dejaría la web en blanco. Con ella, lo que se cae es sólo el botón flotante.
 *
 * No pinta ningún reemplazo: de eso se encarga el padre por `onCrash`, que sabe
 * si puede volver a enseñar WhatsApp. Aquí no se ofrece reintento a propósito —
 * si el widget se rompió al renderizar, volver a montarlo se rompería igual.
 */
export class ChatWidgetBoundary extends Component<Props, State> {
	state: State = { crashed: false };

	static getDerivedStateFromError(): State {
		return { crashed: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error(
			"[chat-widget] error al renderizar:",
			error,
			info.componentStack,
		);
		this.props.onCrash?.();
	}

	render() {
		if (this.state.crashed) return null;
		return this.props.children;
	}
}
