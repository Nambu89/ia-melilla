import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AudienceSplit } from "../AudienceSplit";

const cards = [
	{
		audience: "b2b" as const,
		badge: "EMPRESAS",
		title: "Para tu negocio",
		description: "Description B2B",
		bullets: ["Bullet B2B 1", "Bullet B2B 2"],
		cta: { label: "B2B CTA", href: "/empresas" },
	},
	{
		audience: "b2c" as const,
		badge: "DEMOS",
		title: "Pruébalo",
		description: "Description B2C",
		bullets: ["Bullet B2C 1"],
		cta: { label: "B2C CTA", href: "/demos" },
	},
];

describe("AudienceSplit", () => {
	it("renders both audience cards", () => {
		render(
			<MemoryRouter>
				<AudienceSplit eyebrow="EYE" headline="HEAD" cards={cards} />
			</MemoryRouter>,
		);
		expect(screen.getByText("Para tu negocio")).toBeInTheDocument();
		expect(screen.getByText("Pruébalo")).toBeInTheDocument();
	});

	it("renders all bullets", () => {
		render(
			<MemoryRouter>
				<AudienceSplit eyebrow="EYE" headline="HEAD" cards={cards} />
			</MemoryRouter>,
		);
		expect(screen.getByText("Bullet B2B 1")).toBeInTheDocument();
		expect(screen.getByText("Bullet B2B 2")).toBeInTheDocument();
		expect(screen.getByText("Bullet B2C 1")).toBeInTheDocument();
	});

	it("renders CTAs with correct hrefs", () => {
		render(
			<MemoryRouter>
				<AudienceSplit eyebrow="EYE" headline="HEAD" cards={cards} />
			</MemoryRouter>,
		);
		expect(screen.getByText("B2B CTA").closest("a")).toHaveAttribute("href", "/empresas");
		expect(screen.getByText("B2C CTA").closest("a")).toHaveAttribute("href", "/demos");
	});
});
