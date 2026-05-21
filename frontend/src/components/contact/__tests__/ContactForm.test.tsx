import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "../ContactForm";
import * as api from "@/lib/api";

describe("ContactForm", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("renders all required fields", () => {
		render(<ContactForm />);
		expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Cuentanos/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Empresa o autonomo/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Particular/i)).toBeInTheDocument();
	});

	it("submits valid form and shows success message", async () => {
		const spy = vi.spyOn(api, "submitContact").mockResolvedValue({ ok: true });
		const user = userEvent.setup();
		render(<ContactForm />);
		await user.type(screen.getByLabelText(/Nombre/i), "Juan");
		await user.type(screen.getByLabelText(/Email/i), "juan@example.com");
		await user.click(screen.getByLabelText(/Empresa o autonomo/i));
		await user.type(screen.getByLabelText(/Cuentanos/i), "Necesito IA");
		await user.click(screen.getByLabelText(/He leido y acepto/i));
		await user.click(screen.getByRole("button", { name: /Enviar/i }));

		await waitFor(() => {
			expect(screen.getByText(/Gracias\. Hemos recibido tu consulta/i)).toBeInTheDocument();
		});
		expect(spy).toHaveBeenCalledOnce();
	});

	it("shows error message when submission fails", async () => {
		vi.spyOn(api, "submitContact").mockResolvedValue({ ok: false, error: "invalid_email" });
		const user = userEvent.setup();
		render(<ContactForm />);
		await user.type(screen.getByLabelText(/Nombre/i), "Juan");
		await user.type(screen.getByLabelText(/Email/i), "bad");
		await user.click(screen.getByLabelText(/Particular/i));
		await user.type(screen.getByLabelText(/Cuentanos/i), "Test");
		await user.click(screen.getByLabelText(/He leido y acepto/i));
		await user.click(screen.getByRole("button", { name: /Enviar/i }));

		await waitFor(() => {
			expect(screen.getByText(/Algo no fue/i)).toBeInTheDocument();
		});
	});
});
