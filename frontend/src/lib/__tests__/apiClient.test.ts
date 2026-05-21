import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiPost } from "../apiClient";

describe("apiClient.apiPost", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("envia POST JSON con Authorization Bearer si token provided", async () => {
		const mockFetch = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);
		vi.stubGlobal("fetch", mockFetch);
		const res = await apiPost<{ ok: boolean }>("https://api.test", "/x", { a: 1 }, "TOKEN123");
		expect(res).toEqual({ ok: true });
		expect(mockFetch).toHaveBeenCalledOnce();
		const [url, init] = mockFetch.mock.calls[0];
		expect(url).toBe("https://api.test/x");
		expect(init.method).toBe("POST");
		expect(init.headers["Authorization"]).toBe("Bearer TOKEN123");
		expect(init.headers["Content-Type"]).toBe("application/json");
		expect(init.body).toBe(JSON.stringify({ a: 1 }));
	});

	it("omite Authorization si token vacio", async () => {
		const mockFetch = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), { status: 200 }),
		);
		vi.stubGlobal("fetch", mockFetch);
		await apiPost("https://api.test", "/x", {});
		const [, init] = mockFetch.mock.calls[0];
		expect(init.headers["Authorization"]).toBeUndefined();
	});

	it("lanza ApiError con status y body si response no-ok", async () => {
		const mockFetch = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ error: "bad" }), { status: 403 }),
		);
		vi.stubGlobal("fetch", mockFetch);
		await expect(apiPost("https://api.test", "/x", {})).rejects.toMatchObject({
			status: 403,
			body: { error: "bad" },
		});
	});
});
