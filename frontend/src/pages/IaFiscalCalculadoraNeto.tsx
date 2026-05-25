import { useState, type FormEvent } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { ToolPageShell } from "@/components/demo/ToolPageShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/FormField";
import { DemoLimitGate } from "@/components/demo/DemoLimitGate";
import { useDemoUsageLimit } from "@/hooks/useDemoUsageLimit";
import {
	calculateNetSalary,
	type NetSalaryRequest,
	type NetSalaryResponse,
	ApiError,
} from "@/lib/fiscalApi";

const DEFAULTS: NetSalaryRequest = {
	facturacion_bruta_mensual: 3000,
	tipo_iva: null,
	retencion_irpf: 15.0,
	cuota_autonomo_mensual: null,
	gastos_deducibles_mensual: 500,
	comunidad_autonoma: "Melilla",
	es_nuevo_autonomo: false,
	tarifa_plana: false,
};

function fmtEur(n: number): string {
	return new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 2,
	}).format(n);
}

export default function IaFiscalCalculadoraNeto() {
	const limit = useDemoUsageLimit("calculadora-neto");
	const [form, setForm] = useState<NetSalaryRequest>(DEFAULTS);
	const [result, setResult] = useState<NetSalaryResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	function update<K extends keyof NetSalaryRequest>(
		key: K,
		value: NetSalaryRequest[K],
	) {
		setForm((f) => ({ ...f, [key]: value }));
	}

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setResult(null);
		try {
			const res = await calculateNetSalary(form);
			setResult(res);
			limit.increment();
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
				title="Calculadora Neto Autónomos · IA Fiscal Melilla"
				description="Calcula tu neto mensual y anual como autónomo en Melilla. Aplica IPSI 4% y deducción 60% Ceuta/Melilla automáticamente."
				path="/demos/ia-fiscal-melilla/calculadora-neto"
			/>
			<ToolPageShell
				title="Calculadora Neto Autónomos"
				description="Calcula cuánto te queda al mes y al año tras impuestos. Aplica IPSI y la deducción 60% Ceuta/Melilla si corresponde."
			>
				<DemoLimitGate
					blocked={limit.blocked}
					used={limit.used}
					max={limit.max}
					toolLabel="Calculadora de Neto Autónomo"
				>
				<div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
					<form onSubmit={onSubmit} className="flex flex-col gap-5">
						<FormField
							label="Facturación bruta mensual"
							htmlFor="facturacion"
							hint="Lo que facturas al mes antes de impuestos"
							required
						>
							<Input
								id="facturacion"
								type="number"
								min={0}
								step={50}
								value={form.facturacion_bruta_mensual}
								onChange={(e) =>
									update("facturacion_bruta_mensual", Number(e.target.value))
								}
								required
							/>
						</FormField>
						<FormField
							label="Retención IRPF en factura (%)"
							htmlFor="retencion"
							hint="15% habitual. 7% primeros 3 años nuevos autónomos."
						>
							<Input
								id="retencion"
								type="number"
								min={0}
								max={50}
								step={0.5}
								value={form.retencion_irpf ?? 15}
								onChange={(e) =>
									update("retencion_irpf", Number(e.target.value))
								}
							/>
						</FormField>
						<FormField
							label="Cuota autónomo mensual"
							htmlFor="cuota"
							hint="Déjalo vacío para calcular por tramos automáticamente (RDL 13/2022)."
						>
							<Input
								id="cuota"
								type="number"
								min={0}
								step={10}
								placeholder="Auto"
								value={form.cuota_autonomo_mensual ?? ""}
								onChange={(e) =>
									update(
										"cuota_autonomo_mensual",
										e.target.value === "" ? null : Number(e.target.value),
									)
								}
							/>
						</FormField>
						<FormField
							label="Gastos deducibles mensuales"
							htmlFor="gastos"
							hint="Material, software, conexión, oficina, etc."
						>
							<Input
								id="gastos"
								type="number"
								min={0}
								step={10}
								value={form.gastos_deducibles_mensual ?? 0}
								onChange={(e) =>
									update(
										"gastos_deducibles_mensual",
										Number(e.target.value),
									)
								}
							/>
						</FormField>
						<FormField
							label="Comunidad autónoma"
							htmlFor="ccaa"
							hint="Melilla aplica IPSI 4% y deducción 60% IRPF"
						>
							<select
								id="ccaa"
								className="h-11 w-full rounded-md bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
								value={form.comunidad_autonoma ?? "Melilla"}
								onChange={(e) =>
									update("comunidad_autonoma", e.target.value)
								}
							>
								<option value="Melilla">Melilla</option>
								<option value="Ceuta">Ceuta</option>
								<option value="Madrid">Madrid (referencia)</option>
								<option value="Cataluña">Cataluña (referencia)</option>
								<option value="Andalucía">Andalucía (referencia)</option>
							</select>
						</FormField>
						<div className="flex gap-6 pt-2">
							<label className="inline-flex items-center gap-2 text-body-md text-on-surface">
								<input
									type="checkbox"
									checked={form.es_nuevo_autonomo ?? false}
									onChange={(e) =>
										update("es_nuevo_autonomo", e.target.checked)
									}
								/>
								Nuevo autónomo (&lt;3 años)
							</label>
							<label className="inline-flex items-center gap-2 text-body-md text-on-surface">
								<input
									type="checkbox"
									checked={form.tarifa_plana ?? false}
									onChange={(e) =>
										update("tarifa_plana", e.target.checked)
									}
								/>
								Tarifa plana
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
								"Calcular mi neto"
							)}
						</Button>
					</form>

					<div className="rounded-xl border border-outline-variant bg-surface-container p-8 lg:p-10">
						{!result && !error && (
							<div className="flex h-full flex-col justify-center gap-3 py-12 text-center">
								<p className="text-headline-sm font-semibold text-on-surface">
									Rellena tus datos y pulsa Calcular
								</p>
								<p className="mx-auto max-w-sm text-body-md text-on-surface-variant">
									Te mostraremos tu neto mensual y anual, las cotizaciones SS,
									IPSI y la deducción Melilla aplicable.
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
						{result && <ResultPanel data={result} />}
					</div>
				</div>
				</DemoLimitGate>
			</ToolPageShell>
		</PageShell>
	);
}

function ResultPanel({ data }: { data: NetSalaryResponse }) {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
					NETO ESTIMADO
				</p>
				<p className="mt-2 text-display-md font-bold text-primary">
					{fmtEur(data.neto_mensual)}
					<span className="text-headline-sm text-on-surface-variant"> /mes</span>
				</p>
				<p className="mt-1 text-body-md text-on-surface-variant">
					{fmtEur(data.neto_anual)} al año · Tipo IRPF efectivo{" "}
					{data.tipo_irpf_efectivo.toFixed(1)}%
				</p>
			</div>
			<div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-6">
				<Stat label="Facturación bruta" value={fmtEur(data.facturacion_bruta)} />
				<Stat
					label={data.impuesto_indirecto}
					value={`${data.tipo_impuesto_indirecto}%`}
					sub={fmtEur(data.iva_repercutido)}
				/>
				<Stat
					label="Total con impuesto"
					value={fmtEur(data.total_factura)}
				/>
				<Stat
					label="Retención IRPF"
					value={fmtEur(data.retencion_irpf_factura)}
				/>
				<Stat label="Cobro efectivo" value={fmtEur(data.cobro_efectivo)} />
				<Stat label="Cuota autónomo SS" value={fmtEur(data.cuota_autonomo)} />
				{data.deduccion_ceuta_melilla !== undefined &&
					data.deduccion_ceuta_melilla > 0 && (
						<Stat
							label="Deducción Ceuta/Melilla"
							value={fmtEur(data.deduccion_ceuta_melilla)}
							highlight
						/>
					)}
				<Stat
					label="Régimen fiscal"
					value={data.regimen_fiscal.replace(/_/g, " ")}
				/>
			</div>
		</div>
	);
}

function Stat({
	label,
	value,
	sub,
	highlight,
}: {
	label: string;
	value: string;
	sub?: string;
	highlight?: boolean;
}) {
	return (
		<div>
			<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
				{label}
			</p>
			<p
				className={
					highlight
						? "mt-1 text-body-lg font-semibold text-primary"
						: "mt-1 text-body-lg font-semibold text-on-surface"
				}
			>
				{value}
			</p>
			{sub && (
				<p className="text-body-sm text-on-surface-muted">{sub}</p>
			)}
		</div>
	);
}
