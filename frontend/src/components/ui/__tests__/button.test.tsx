import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../button";

describe("Button", () => {
	it("renders children", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
	});

	it("applies primary variant by default", () => {
		render(<Button>Primary</Button>);
		expect(screen.getByRole("button")).toHaveClass("bg-primary");
	});

	it("applies b2b variant when requested", () => {
		render(<Button variant="b2b">B2B</Button>);
		expect(screen.getByRole("button")).toHaveClass("bg-tertiary-container");
	});

	it("applies b2c variant when requested", () => {
		render(<Button variant="b2c">B2C</Button>);
		expect(screen.getByRole("button")).toHaveClass("bg-secondary-container");
	});

	it("respects disabled state", () => {
		render(<Button disabled>Disabled</Button>);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("renders as Slot when asChild is true", () => {
		render(
			<Button asChild>
				<a href="/test">Link</a>
			</Button>,
		);
		const link = screen.getByRole("link", { name: "Link" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/test");
		expect(link).toHaveClass("bg-primary");
	});
});
