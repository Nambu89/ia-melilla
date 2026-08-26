import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center p-8 gap-4">
			{/*
			 * Sin noindex, cualquier URL inventada devuelve 200 con esta página:
			 * el servidor no puede saber que la ruta no existe porque el
			 * enrutado es del cliente. Eso es un soft 404, y el sitemap de
			 * producción llegó a anunciar dos (/particulares y /portafolio),
			 * así que hay buscadores que ya las conocen y las seguirán
			 * pidiendo. La meta las saca del índice aunque el código sea 200.
			 */}
			<Helmet>
				<title>Página no encontrada — IA Melilla</title>
				<meta name="robots" content="noindex, follow" />
			</Helmet>
			<h1 className="text-display-md font-bold">404</h1>
			<p className="text-body-lg text-on-surface-variant">Página no encontrada.</p>
			<Link to="/" className="text-primary underline">
				Volver al inicio
			</Link>
		</main>
	);
}
