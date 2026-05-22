import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Nav } from "../Nav";

describe("Nav", () => {
	it("renders all nav links", () => {
		render(
			<MemoryRouter>
				<Nav />
			</MemoryRouter>,
		);
		expect(screen.getByText("Empresas")).toBeInTheDocument();
		expect(screen.getByText("Particulares")).toBeInTheDocument();
		expect(screen.getByText("Demos")).toBeInTheDocument();
		expect(screen.getByText("Contacto")).toBeInTheDocument();
		expect(screen.getByText("Blog")).toBeInTheDocument();
	});

	it("renders the CTA button", () => {
		render(
			<MemoryRouter>
				<Nav />
			</MemoryRouter>,
		);
		expect(screen.getByText("Probar IA Fiscal")).toBeInTheDocument();
	});

	it("renders the logo as link to home", () => {
		render(
			<MemoryRouter>
				<Nav />
			</MemoryRouter>,
		);
		const logo = screen.getByText("IA Melilla");
		expect(logo.closest("a")).toHaveAttribute("href", "/");
	});
});
