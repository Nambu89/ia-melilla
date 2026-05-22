import { apiPost, ApiError } from "@/lib/apiClient";

/**
 * Cliente backend Impuestify (branded "Fiscal IA Melilla").
 * Auto-login con demo user, JWT en memoria.
 * Retry una vez con re-login si la primera llamada da 401.
 */

interface LoginResponse {
	user: { id: string; email: string; name: string };
	tokens: { access_token: string; refresh_token: string; token_type: string };
}

let cachedToken: string | null = null;
let inflightLogin: Promise<string> | null = null;

function getBaseUrl(): string {
	const url = import.meta.env.VITE_API_BASE_URL as string | undefined;
	if (!url) {
		throw new Error("VITE_API_BASE_URL no configurado");
	}
	return url.replace(/\/$/, "");
}

async function login(): Promise<string> {
	if (inflightLogin) return inflightLogin;
	const email = import.meta.env.VITE_DEMO_USER_EMAIL as string;
	const password = import.meta.env.VITE_DEMO_USER_PASSWORD as string;
	if (!email || !password) {
		throw new Error(
			"VITE_DEMO_USER_EMAIL / VITE_DEMO_USER_PASSWORD no configurados",
		);
	}
	inflightLogin = apiPost<LoginResponse>(getBaseUrl(), "/auth/login", {
		email,
		password,
	})
		.then((res) => {
			cachedToken = res.tokens.access_token;
			return cachedToken;
		})
		.finally(() => {
			inflightLogin = null;
		});
	return inflightLogin;
}

async function getToken(): Promise<string> {
	if (cachedToken) return cachedToken;
	return login();
}

async function authedPost<T>(path: string, body: unknown): Promise<T> {
	const baseUrl = getBaseUrl();
	let token = await getToken();
	try {
		return await apiPost<T>(baseUrl, path, body, token);
	} catch (err) {
		if (err instanceof ApiError && err.status === 401) {
			// Token expired or invalid → re-login + retry once
			cachedToken = null;
			token = await login();
			return apiPost<T>(baseUrl, path, body, token);
		}
		throw err;
	}
}

// ===== Tipos =====

export interface NetSalaryRequest {
	facturacion_bruta_mensual: number;
	tipo_iva?: number | null;
	retencion_irpf?: number;
	cuota_autonomo_mensual?: number | null;
	gastos_deducibles_mensual?: number;
	comunidad_autonoma?: string;
	es_nuevo_autonomo?: boolean;
	tarifa_plana?: boolean;
}

export interface NetSalaryResponse {
	success: boolean;
	facturacion_bruta: number;
	iva_repercutido: number;
	total_factura: number;
	retencion_irpf_factura: number;
	cobro_efectivo: number;
	cuota_autonomo: number;
	neto_mensual: number;
	neto_anual: number;
	tipo_irpf_efectivo: number;
	regimen_fiscal: string;
	impuesto_indirecto: string;
	tipo_impuesto_indirecto: number;
	deduccion_ceuta_melilla?: number;
	disclaimer: string;
}

export interface WithholdingRequest {
	retribucion_bruta_anual: number;
	situacion_familiar: "1" | "2" | "3";
	situacion_laboral: string;
	tipo_contrato: string;
	ano_nacimiento: number;
	discapacidad: string;
	movilidad_reducida: boolean;
	descendientes: unknown[];
	ascendientes: unknown[];
	ceuta_melilla: boolean;
	num_pagas: number;
}

export interface WithholdingResponse {
	success: boolean;
	tipo_retencion: number;
	cuota_anual: number;
	retencion_mensual: number;
	salario_neto_mensual: number;
	retribucion_bruta: number;
	cotizaciones_ss: number;
	gastos_deducibles: number;
	rendimiento_neto_reducido: number;
	minimo_personal_familiar: number;
	base_retencion: number;
	exento: boolean;
	motivo_exencion: string | null;
	disclaimer: string;
}

export interface EstimateRequest {
	rol: "particular" | "autonomo";
	ccaa: string;
	rendimientos_trabajo: number;
	rendimientos_actividades_economicas: number;
	edad_contribuyente: number;
	hijos_menores_25: number;
	discapacidad_contribuyente: number;
	tributacion_conjunta: boolean;
	[key: string]: unknown;
}

export interface EstimateResponse {
	base_imponible?: number;
	cuota_estatal?: number;
	cuota_autonomica?: number;
	cuota_liquida?: number;
	resultado?: number;
	deducciones?: Array<{ name: string; amount: number; reference?: string }>;
	disclaimer?: string;
	[key: string]: unknown;
}

export interface DeductionsRequest {
	ccaa: string;
	edad_contribuyente: number;
	hijos_menores_25: number;
	discapacidad: number;
	vivienda_alquiler: boolean;
	vivienda_propiedad: boolean;
	donativos: number;
}

export interface Deduction {
	code: string;
	name: string;
	max_amount?: number;
	percentage?: number;
	legal_reference?: string;
	description?: string;
}

export interface DeductionsResponse {
	deductions: Deduction[];
	[key: string]: unknown;
}

export interface HealthResponse {
	status: string;
	brand: string;
	territory_lock: string;
	demo_mode: boolean;
	rag_initialized: boolean;
	statistics?: { documents?: number; embeddings?: number };
}

// ===== Endpoints =====

export function calculateNetSalary(req: NetSalaryRequest) {
	return authedPost<NetSalaryResponse>("/api/irpf/net-salary", req);
}

export function calculateWithholding(req: WithholdingRequest) {
	return apiPost<WithholdingResponse>(getBaseUrl(), "/api/irpf/withholding", req);
}

export function estimateIrpf(req: EstimateRequest) {
	return authedPost<EstimateResponse>("/api/irpf/estimate", req);
}

export function discoverDeductions(req: DeductionsRequest) {
	return authedPost<DeductionsResponse>(
		"/api/irpf/deductions/discover",
		req,
	);
}

export async function getHealth(): Promise<HealthResponse> {
	const baseUrl = getBaseUrl();
	const res = await fetch(`${baseUrl}/health`);
	if (!res.ok) throw new ApiError(res.status, await res.text());
	return (await res.json()) as HealthResponse;
}

// ===== Invoices (OCR + PGC classification) =====

export interface InvoiceUploadResponse {
	id?: string;
	invoice_id?: string;
	status?: string;
	vendor?: string;
	vendor_name?: string;
	supplier?: string;
	customer?: string;
	date?: string;
	invoice_date?: string;
	invoice_number?: string;
	number?: string;
	subtotal?: number;
	base_imponible?: number;
	tax?: number;
	tax_amount?: number;
	iva?: number;
	ipsi?: number;
	tax_rate?: number;
	total?: number;
	amount?: number;
	currency?: string;
	pgc_account?: string;
	pgc_code?: string;
	classification?: string;
	category?: string;
	confidence?: number;
	accounting_entry?: {
		debit?: Array<{ account: string; amount: number; description?: string }>;
		credit?: Array<{ account: string; amount: number; description?: string }>;
	};
	asiento?: unknown;
	items?: Array<{
		description?: string;
		quantity?: number;
		unit_price?: number;
		total?: number;
	}>;
	raw_text?: string;
	processing_time_ms?: number;
	[key: string]: unknown;
}

/**
 * Sube una factura (PDF / JPG / PNG) al backend. OCR Gemini + clasificación
 * PGC + generación asiento contable. Si la respuesta indica `status:
 * "processing"`, hacer polling con `getInvoice(id)` hasta status terminal.
 */
export async function uploadInvoice(
	file: File,
	opts: { workspaceId?: string; signal?: AbortSignal } = {},
): Promise<InvoiceUploadResponse> {
	const baseUrl = getBaseUrl();
	const token = await getToken();

	const form = new FormData();
	form.append("file", file);
	if (opts.workspaceId) form.append("workspace_id", opts.workspaceId);

	const doUpload = async (bearer: string) => {
		const res = await fetch(`${baseUrl}/api/invoices/upload`, {
			method: "POST",
			headers: { Authorization: `Bearer ${bearer}` },
			body: form,
			signal: opts.signal,
		});
		if (!res.ok) {
			let body: unknown;
			try {
				body = await res.json();
			} catch {
				body = await res.text();
			}
			throw new ApiError(res.status, body);
		}
		return (await res.json()) as InvoiceUploadResponse;
	};

	try {
		return await doUpload(token);
	} catch (err) {
		if (err instanceof ApiError && err.status === 401) {
			cachedToken = null;
			const fresh = await login();
			return doUpload(fresh);
		}
		throw err;
	}
}

export async function getInvoice(
	invoiceId: string,
): Promise<InvoiceUploadResponse> {
	const baseUrl = getBaseUrl();
	const token = await getToken();
	const res = await fetch(`${baseUrl}/api/invoices/${invoiceId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) {
		let body: unknown;
		try {
			body = await res.json();
		} catch {
			body = await res.text();
		}
		throw new ApiError(res.status, body);
	}
	return (await res.json()) as InvoiceUploadResponse;
}

/**
 * Sube factura y hace polling hasta status terminal. Resuelve con resultado
 * final o rechaza si timeout/error. onProgress recibe el estado intermedio
 * cada chequeo (mostrar spinner + texto al usuario).
 */
export async function uploadAndProcessInvoice(
	file: File,
	opts: {
		workspaceId?: string;
		signal?: AbortSignal;
		pollIntervalMs?: number;
		timeoutMs?: number;
		onProgress?: (status: string) => void;
	} = {},
): Promise<InvoiceUploadResponse> {
	const {
		pollIntervalMs = 2000,
		timeoutMs = 60_000,
		onProgress,
	} = opts;

	onProgress?.("Subiendo archivo...");
	const initial = await uploadInvoice(file, {
		workspaceId: opts.workspaceId,
		signal: opts.signal,
	});

	const terminalStatuses = new Set([
		"completed",
		"complete",
		"done",
		"processed",
		"success",
		"finished",
		"ok",
		"error",
		"failed",
	]);

	// Si no hay status o ya es terminal, devolver lo que tenemos
	if (!initial.status || terminalStatuses.has(initial.status.toLowerCase())) {
		return initial;
	}

	const id = initial.id ?? initial.invoice_id;
	if (!id) {
		// Sin id no podemos pollear — devolver lo que tenemos
		return initial;
	}

	const started = Date.now();
	let lastStatus = initial.status;
	onProgress?.(`Procesando (${lastStatus})...`);

	while (Date.now() - started < timeoutMs) {
		if (opts.signal?.aborted) {
			throw new Error("AbortError");
		}
		await new Promise((r) => setTimeout(r, pollIntervalMs));
		const polled = await getInvoice(id);
		if (
			!polled.status ||
			terminalStatuses.has(polled.status.toLowerCase())
		) {
			return polled;
		}
		if (polled.status !== lastStatus) {
			lastStatus = polled.status;
			onProgress?.(`Procesando (${lastStatus})...`);
		}
	}
	throw new Error("Timeout procesando factura tras 60s");
}

export { ApiError };
