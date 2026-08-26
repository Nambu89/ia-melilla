import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import NotFound from "../NotFound";
import SobreNosotros from "../SobreNosotros";
import Terminos from "../Terminos";

/**
 * El enrutado es del cliente, así que nginx devuelve 200 con el index.html
 * para cualquier ruta que no exista. Sin la meta robots eso es un soft 404:
 * el buscador pide /particulares, recibe 200 y una página de error, y la
 * indexa. La meta es lo único que lo impide, de ahí que esté cubierta.
 */
function renderPage(ui: React.ReactElement) {
	return render(
		<HelmetProvider>
			<MemoryRouter>{ui}</MemoryRouter>
		</HelmetProvider>,
	);
}

const robotsContent = () =>
	document.head.querySelector('meta[name="robots"]')?.getAttribute("content");

describe("noindex", () => {
	it("la página 404 se declara noindex", async () => {
		renderPage(<NotFound />);
		await waitFor(() => expect(robotsContent()).toBe("noindex, follow"));
	});

	it("sobre-nosotros se declara noindex mientras esté en construcción", async () => {
		renderPage(<SobreNosotros />);
		await waitFor(() => expect(robotsContent()).toBe("noindex, follow"));
	});

	// Va después de los dos anteriores a propósito: si Helmet se dejara la meta
	// pegada al desmontar, este caso la encontraría y fallaría. Cubre de paso
	// que nadie marque noindex una página que sí queremos en el índice.
	it("una página indexable no lleva meta robots", async () => {
		const { container } = renderPage(<Terminos />);
		await waitFor(() => expect(container).not.toBeEmptyDOMElement());
		expect(robotsContent()).toBeUndefined();
	});

	// El caso que de verdad puede morder en producción: navegar dentro de la
	// misma SPA, sin recargar y sin desmontar el HelmetProvider. Si Helmet no
	// retirase la meta al cambiar de página, bastaría con que un visitante
	// pasara por la 404 para que la siguiente página se sirviera noindex.
	it("la meta desaparece al navegar de una página noindex a una indexable", async () => {
		render(
			<HelmetProvider>
				<MemoryRouter initialEntries={["/sobre-nosotros"]}>
					<Link to="/terminos">Ir a términos</Link>
					<Routes>
						<Route path="/sobre-nosotros" element={<SobreNosotros />} />
						<Route path="/terminos" element={<Terminos />} />
					</Routes>
				</MemoryRouter>
			</HelmetProvider>,
		);
		await waitFor(() => expect(robotsContent()).toBe("noindex, follow"));

		fireEvent.click(screen.getByRole("link", { name: "Ir a términos" }));
		await waitFor(() => expect(robotsContent()).toBeUndefined());
	});
});
