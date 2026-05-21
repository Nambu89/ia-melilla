export class ApiError extends Error {
	constructor(
		public status: number,
		public body: unknown,
		message?: string,
	) {
		super(message ?? `HTTP ${status}`);
		this.name = "ApiError";
	}
}

export async function apiPost<T>(
	baseUrl: string,
	path: string,
	body: unknown,
	token?: string,
	signal?: AbortSignal,
): Promise<T> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		Accept: "application/json",
	};
	if (token) headers["Authorization"] = `Bearer ${token}`;

	const res = await fetch(`${baseUrl}${path}`, {
		method: "POST",
		headers,
		body: JSON.stringify(body),
		signal,
	});

	if (!res.ok) {
		let parsed: unknown;
		try {
			parsed = await res.json();
		} catch {
			try {
				parsed = await res.text();
			} catch {
				parsed = null;
			}
		}
		throw new ApiError(res.status, parsed);
	}

	return (await res.json()) as T;
}

/**
 * Returns the underlying Response so the caller can consume a stream body.
 * Throws ApiError on non-OK status (after parsing error body).
 * Pass `signal` to abort the request mid-stream from the caller.
 */
export async function apiPostStream(
	baseUrl: string,
	path: string,
	body: unknown,
	token?: string,
	signal?: AbortSignal,
): Promise<Response> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		Accept: "text/event-stream, application/x-ndjson, application/json",
	};
	if (token) headers["Authorization"] = `Bearer ${token}`;

	const res = await fetch(`${baseUrl}${path}`, {
		method: "POST",
		headers,
		body: JSON.stringify(body),
		signal,
	});

	if (!res.ok) {
		let parsed: unknown;
		try {
			parsed = await res.json();
		} catch {
			try {
				parsed = await res.text();
			} catch {
				parsed = null;
			}
		}
		throw new ApiError(res.status, parsed);
	}

	return res;
}
