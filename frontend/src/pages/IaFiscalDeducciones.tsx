import { useState, type FormEvent } from "react";
import { Loader2, AlertCircle, ScrollText } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { ToolPageShell } from "@/components/demo/ToolPageShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/FormField";
import {
	discoverDeductions,
	type DeductionsRequest,
	type DeductionsResponse,
	type Deduction,
	ApiError,
} from "@/lib/fiscalApi";

const DEFAULTS: DeductionsRequest = {
	ccaa: "Melilla",
	edad_contribuyente: 35,
	hijos_menores_25: 2,
	discapacidad: 0,
	vivienda_alquiler: false,
	vivienda_propiedad: true,
	donativos: 100,
};

function fmtEur(n: number): string {
	return new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 2,
	}).format(n);
}

export default function IaFiscalDeducciones() {
	const [form, setForm] = useState<DeductionsRequest>(DEFAULTS);
	const [result, setResult] = useState<DeductionsResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	function update<K extends keyof DeductionsRequest>(
		key: K,
		value: DeductionsRequest[K],
	) {
		setForm((f) => ({ ...f, [key]: value }));
	}

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setResult(null);
		try {
			const res = await discoverDeductions(form);
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
				title="Descubrir Deducciones IRPF · IA Fiscal Melilla"
				description="Encuentra todas las deducciones IRPF que puedes aplicar según tu situación. Cobertura Melilla + estatales."
				path="/demos/ia-fiscal-melilla/deducciones"
			/>
			<ToolPageShell
				title="Descubrir Deducciones IRPF"
				description="Cuéntanos cómo es tu situación y te mostramos todas las deducciones que puedes aplicar en tu declaración. Cobertura Melilla y estatales."
			>
				<div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
					<form
						onSubmit={onSubmit}
						className="flex flex-col gap-5 self-start"
					>
						<FormField label="Comunidad autónoma" htmlFor="ccaa-d">
							<select
								id="ccaa-d"
								className="h-11 w-full rounded-md bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
								value={form.ccaa}
								onChange={(e) => update("ccaa", e.target.value)}
							>
								<option value="Melilla">Melilla</option>
								<option value="Ceuta">Ceuta</option>
								<option value="Madrid">Madrid</option>
								<option value="Cataluña">Cataluña</option>
								<option value="Andalucía">Andalucía</option>
								<option value="Valencia">Valencia</option>
							</select>
						</FormField>

						<FormField label="Edad" htmlFor="edad">
							<Input
								id="edad"
								type="number"
								min={18}
								max={110}
								value={form.edad_contribuyente}
								onChange={(e) =>
									update("edad_contribuyente", Number(e.target.value))
								}
							/>
						</FormField>

						<FormField label="Hijos menores de 25" htmlFor="hijos">
							<Input
								id="hijos"
								type="number"
								min={0}
								max={12}
								value={form.hijos_menores_25}
								onChange={(e) =>
									update("hijos_menores_25", Number(e.target.value))
								}
							/>
						</FormField>

						<FormField
							label="Grado de discapacidad (%)"
							htmlFor="discapacidad"
							hint="0 si no aplica"
						>
							<Input
								id="discapacidad"
								type="number"
								min={0}
								max={100}
								value={form.discapacidad}
								onChange={(e) =>
									update("discapacidad", Number(e.target.value))
								}
							/>
						</FormField>

						<FormField label="Donativos anuales" htmlFor="donativos">
							<Input
								id="donativos"
								type="number"
								min={0}
								step={10}
								value={form.donativos}
								onChange={(e) => update("donativos", Number(e.target.value))}
							/>
						</FormField>

						<div className="flex flex-col gap-3 pt-2">
							<label className="inline-flex items-center gap-2 text-body-md text-on-surface">
								<input
									type="checkbox"
									checked={form.vivienda_propiedad}
									onChange={(e) =>
										update("vivienda_propiedad", e.target.checked)
									}
								/>
								Vivienda en propiedad
							</label>
							<label className="inline-flex items-center gap-2 text-body-md text-on-surface">
								<input
									type="checkbox"
									checked={form.vivienda_alquiler}
									onChange={(e) =>
										update("vivienda_alquiler", e.target.checked)
									}
								/>
								Vivienda en alquiler
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
									Buscando...
								</>
							) : (
								"Descubrir deducciones"
							)}
						</Button>
					</form>

					<div>
						{!result && !error && (
							<div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-outline-variant bg-surface-container py-16 px-8 text-center">
								<ScrollText
									size={32}
									className="text-on-surface-muted"
									aria-hidden
								/>
								<p className="text-headline-sm font-semibold text-on-surface">
									Encuentra las deducciones a las que tienes derecho
								</p>
								<p className="text-body-md text-on-surface-variant max-w-sm">
									Combina deducciones autonómicas de Melilla con las
									estatales y te muestra cuantía máxima estimada de cada
									una.
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
						{result && <DeductionsList list={result.deductions ?? []} />}
					</div>
				</div>
			</ToolPageShell>
		</PageShell>
	);
}

function DeductionsList({ list }: { list: Deduction[] }) {
	if (list.length === 0) {
		return (
			<div className="rounded-xl border border-outline-variant bg-surface-container p-8 text-center text-body-md text-on-surface-variant">
				No hemos encontrado deducciones aplicables con esos datos. Prueba a
				ajustar la situación familiar o la comunidad autónoma.
			</div>
		);
	}
	return (
		<div className="flex flex-col gap-4">
			<p className="text-label-caps uppercase tracking-[0.12em] text-primary">
				{list.length} DEDUCCIÓN{list.length !== 1 ? "ES" : ""} APLICABLE
				{list.length !== 1 ? "S" : ""}
			</p>
			{list.map((d) => (
				<article
					key={d.code}
					className="rounded-lg border border-outline-variant bg-surface-container p-6 transition-colors hover:border-primary/40"
				>
					<div className="flex items-start justify-between gap-4">
						<div>
							<h3 className="text-headline-sm font-semibold text-on-surface">
								{d.name}
							</h3>
							{d.description && (
								<p className="mt-2 text-body-md text-on-surface-variant">
									{d.description}
								</p>
							)}
						</div>
						{d.max_amount !== undefined && (
							<div className="shrink-0 text-right">
								<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
									MÁXIMO
								</p>
								<p className="text-headline-sm font-bold text-primary">
									{fmtEur(d.max_amount)}
								</p>
							</div>
						)}
					</div>
					<div className="mt-4 flex flex-wrap gap-3 text-body-sm text-on-surface-muted">
						{d.percentage !== undefined && (
							<span>Porcentaje: {d.percentage}%</span>
						)}
						{d.legal_reference && (
							<span className="font-mono">{d.legal_reference}</span>
						)}
					</div>
				</article>
			))}
		</div>
	);
}
