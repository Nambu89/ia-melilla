import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center p-8 gap-4">
			<h1 className="text-display-md font-bold">404</h1>
			<p className="text-body-lg text-on-surface-variant">Pagina no encontrada.</p>
			<Link to="/" className="text-primary underline">
				Volver al inicio
			</Link>
		</main>
	);
}
