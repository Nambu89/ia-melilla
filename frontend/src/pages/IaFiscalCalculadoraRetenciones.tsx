import { useState, type FormEvent } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { ToolPageShell } from "@/components/demo/ToolPageShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/FormField";
import {
	calculateWithholding,
	type WithholdingRequest,
	type WithholdingResponse,
	ApiError,
} from "@/lib/fiscalApi";

const DEFAULTS: WithholdingRequest = {
	retribucion_bruta_anual: 35000,
	situacion_familiar: "3",
	situacion_laboral: "activo",
	tipo_contrato: "indefinido",
	ano_nacimiento: 1990,
	discapacidad: "sin",
	movilidad_reducida: false,
	descendientes: [],
	ascendientes: [],
	ceuta_melilla: true,
	num_pagas: 14,
};

function fmtEur(n: number): string {
	return new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 2,
	}).format(n);
}

export default function IaFiscalCalculadoraRetenciones() {
	const [form, setForm] = useState<WithholdingRequest>(DEFAULTS);
	const [result, setResult] = useState<WithholdingResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	function update<K extends keyof WithholdingRequest>(
		key: K,
		value: WithholdingRequest[K],
	) {
		setForm((f) => ({ ...f, [key]: value }));
	}

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setResult(null);
		try {
			const res = await calculateWithholding(form);
			setResult(res);
		} catch (err) {
			if (err instanceof ApiError) {
				setError(`Error del servidor (HTTP ${err.status}). Inténtalo de nuevo.`);
			} else {
				setError("No pudimos conectar. Comprueba tu conexión.");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<PageShell>
			<SeoHead
				title="Calculadora Retenciones IRPF · IA Fiscal Melilla"
				description="Calcula tu retención IRPF mensual aplicando la reducción 60% Ceuta/Melilla automáticamente. Algoritmo oficial AEAT."
				path="/demos/ia-fiscal-melilla/calculadora-retenciones"
			/>
			<ToolPageShell
				title="Calculadora Retenciones IRPF"
				description="Estima la retención IRPF que te aplicarán en nómina según situación familiar y residencia. Aplica reducción 60% Ceuta/Melilla."
			>
				<div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
					<form onSubmit={onSubmit} className="flex flex-col gap-5">
						<FormField
							label="Retribución bruta anual"
							htmlFor="bruto"
							hint="Salario bruto anual (suma 12 o 14 pagas según contrato)"
							required
						>
							<Input
								id="bruto"
								type="number"
								min={0}
								step={500}
								value={form.retribucion_bruta_anual}
								onChange={(e) =>
									update("retribucion_bruta_anual", Number(e.target.value))
								}
								required
							/>
						</FormField>

						<FormField
							label="Situación familiar"
							htmlFor="familiar"
							hint="1 = soltero con hijos · 2 = casado cónyuge <1500€ · 3 = resto"
						>
							<select
								id="familiar"
								className="h-11 w-full rounded-md bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
								value={form.situacion_familiar}
								onChange={(e) =>
									update(
										"situacion_familiar",
										e.target.value as "1" | "2" | "3",
									)
								}
							>
								<option value="1">1 — Soltero con hijos</option>
								<option value="2">2 — Casado, cónyuge bajos ingresos</option>
								<option value="3">3 — Resto (default)</option>
							</select>
						</FormField>

						<FormField
							label="Tipo de contrato"
							htmlFor="contrato"
						>
							<select
								id="contrato"
								className="h-11 w-full rounded-md bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
								value={form.tipo_contrato}
								onChange={(e) => update("tipo_contrato", e.target.value)}
							>
								<option value="indefinido">Indefinido</option>
								<option value="temporal">Temporal</option>
								<option value="fijo_discontinuo">Fijo discontinuo</option>
							</select>
						</FormField>

						<FormField label="Año de nacimiento" htmlFor="anio">
							<Input
								id="anio"
								type="number"
								min={1940}
								max={2010}
								value={form.ano_nacimiento}
								onChange={(e) =>
									update("ano_nacimiento", Number(e.target.value))
								}
							/>
						</FormField>

						<FormField label="Discapacidad" htmlFor="disc">
							<select
								id="disc"
								className="h-11 w-full rounded-md bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
								value={form.discapacidad}
								onChange={(e) => update("discapacidad", e.target.value)}
							>
								<option value="sin">Sin discapacidad</option>
								<option value="33_65">Entre 33% y 65%</option>
								<option value="65_mas">Más del 65%</option>
							</select>
						</FormField>

						<FormField label="Número de pagas" htmlFor="pagas">
							<select
								id="pagas"
								className="h-11 w-full rounded-md bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
								value={form.num_pagas}
								onChange={(e) => update("num_pagas", Number(e.target.value))}
							>
								<option value={12}>12 pagas</option>
								<option value={14}>14 pagas (2 extras)</option>
							</select>
						</FormField>

						<div className="flex flex-col gap-3 pt-2">
							<label className="inline-flex items-center gap-2 text-body-md text-on-surface">
								<input
									type="checkbox"
									checked={form.ceuta_melilla}
									onChange={(e) => update("ceuta_melilla", e.target.checked)}
								/>
								Residencia en Ceuta o Melilla (reducción 60%)
							</label>
							<label className="inline-flex items-center gap-2 text-body-md text-on-surface">
								<input
									type="checkbox"
									checked={form.movilidad_reducida}
									onChange={(e) =>
										update("movilidad_reducida", e.target.checked)
									}
								/>
								Movilidad reducida
							</label>
						</div>

						<Button
							type="submit"
							size="lg"
							disabled={loading}
							className="mt-4 w-full sm:w-auto"
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Calculando...
								</>
							) : (
								"Calcular retención"
							)}
						</Button>
					</form>

					<div className="rounded-xl border border-outline-variant bg-surface-container p-8 lg:p-10">
						{!result && !error && (
							<div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
								<p className="text-headline-sm font-semibold text-on-surface">
									Rellena tus datos para ver la retención
								</p>
								<p className="text-body-md text-on-surface-variant max-w-sm">
									Calculamos según el algoritmo oficial AEAT 2026 con
									reducción Ceuta/Melilla si aplica.
								</p>
							</div>
						)}
						{error && (
							<div
								role="alert"
								className="flex items-start gap-3 rounded-md border border-error bg-error-container p-4 text-on-error-container"
							>
								<AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
								<div className="text-body-md">{error}</div>
							</div>
						)}
						{result && (
							<div className="flex flex-col gap-6">
								<div>
									<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
										TIPO DE RETENCIÓN
									</p>
									<p className="mt-2 text-display-md font-bold text-primary">
										{result.tipo_retencion.toFixed(2)}%
									</p>
									{result.exento && (
										<p className="text-body-sm text-on-surface-muted">
											Exento · {result.motivo_exencion}
										</p>
									)}
								</div>
								<div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-6">
									<div>
										<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
											RETENCIÓN MENSUAL
										</p>
										<p className="mt-1 text-headline-sm font-semibold text-on-surface">
											{fmtEur(result.retencion_mensual)}
										</p>
									</div>
									<div>
										<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
											CUOTA ANUAL
										</p>
										<p className="mt-1 text-headline-sm font-semibold text-on-surface">
											{fmtEur(result.cuota_anual)}
										</p>
									</div>
									<div>
										<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
											NETO MENSUAL ESTIMADO
										</p>
										<p className="mt-1 text-headline-sm font-semibold text-primary">
											{fmtEur(result.salario_neto_mensual)}
										</p>
									</div>
									<div>
										<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
											COTIZACIONES SS
										</p>
										<p className="mt-1 text-headline-sm font-semibold text-on-surface">
											{fmtEur(result.cotizaciones_ss)}
										</p>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</ToolPageShell>
		</PageShell>
	);
}
