import { useState, type FormEvent } from "react";
import { Loader2, AlertCircle, ChevronRight } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { ToolPageShell } from "@/components/demo/ToolPageShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/FormField";
import { DemoLimitGate } from "@/components/demo/DemoLimitGate";
import { useDemoUsageLimit } from "@/hooks/useDemoUsageLimit";
import {
	estimateIrpf,
	type EstimateRequest,
	type EstimateResponse,
	ApiError,
} from "@/lib/fiscalApi";

interface Step {
	id: string;
	title: string;
	helper: string;
	fields: Array<keyof EstimateRequest>;
}

const STEPS_PARTICULAR: Step[] = [
	{
		id: "rol",
		title: "Tu situación laboral",
		helper: "Para enfocar la guía a tu perfil.",
		fields: ["rol"],
	},
	{
		id: "ccaa",
		title: "Tu comunidad autónoma",
		helper: "Melilla y Ceuta tienen un régimen especial con reducción 60% IRPF.",
		fields: ["ccaa"],
	},
	{
		id: "ingresos",
		title: "Tus ingresos del año",
		helper: "Suma todo lo que has cobrado bruto de trabajos por cuenta ajena.",
		fields: ["rendimientos_trabajo"],
	},
	{
		id: "personal",
		title: "Datos personales",
		helper: "Edad e hijos a tu cargo (afectan al mínimo personal).",
		fields: ["edad_contribuyente", "hijos_menores_25"],
	},
	{
		id: "extras",
		title: "Otros datos relevantes",
		helper: "Discapacidad y tributación conjunta si aplica.",
		fields: ["discapacidad_contribuyente", "tributacion_conjunta"],
	},
];

const DEFAULTS: EstimateRequest = {
	rol: "particular",
	ccaa: "Melilla",
	rendimientos_trabajo: 28000,
	rendimientos_actividades_economicas: 0,
	edad_contribuyente: 35,
	hijos_menores_25: 0,
	discapacidad_contribuyente: 0,
	tributacion_conjunta: false,
};

function fmtEur(n: number | undefined): string {
	if (n === undefined || n === null) return "—";
	return new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 2,
	}).format(n);
}

export default function IaFiscalGuiaFiscal() {
	const limit = useDemoUsageLimit("guia-fiscal");
	const [step, setStep] = useState(0);
	const [form, setForm] = useState<EstimateRequest>(DEFAULTS);
	const [result, setResult] = useState<EstimateResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const totalSteps = STEPS_PARTICULAR.length;
	const isLast = step === totalSteps - 1;
	const current = STEPS_PARTICULAR[step];

	function update<K extends keyof EstimateRequest>(
		key: K,
		value: EstimateRequest[K],
	) {
		setForm((f) => ({ ...f, [key]: value }));
	}

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!isLast) {
			setStep((s) => Math.min(s + 1, totalSteps - 1));
			return;
		}
		setLoading(true);
		setError(null);
		setResult(null);
		try {
			const res = await estimateIrpf(form);
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

	function reset() {
		setStep(0);
		setForm(DEFAULTS);
		setResult(null);
		setError(null);
	}

	return (
		<PageShell>
			<SeoHead
				title="Guía Fiscal IRPF · IA Fiscal Melilla"
				description="Wizard guiado para estimar tu IRPF con cobertura específica de Melilla. Calcula base, cuota, deducciones y resultado a devolver/pagar."
				path="/demos/ia-fiscal-melilla/guia-fiscal"
			/>
			<ToolPageShell
				title="Guía Fiscal IRPF"
				description="Te llevamos paso a paso por los datos clave de tu declaración. Estimamos base, cuota y resultado con cobertura específica de Melilla."
			>
				<DemoLimitGate
					blocked={limit.blocked}
					used={limit.used}
					max={limit.max}
					toolLabel="Guía Fiscal IRPF"
				>
				{result ? (
					<ResultPanel result={result} onReset={reset} />
				) : (
					<div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
						<div>
							<ProgressBar current={step} total={totalSteps} />
							<form
								onSubmit={onSubmit}
								className="mt-8 flex flex-col gap-6"
							>
								<div>
									<p className="text-label-caps uppercase tracking-[0.12em] text-primary">
										PASO {step + 1} DE {totalSteps}
									</p>
									<h2 className="mt-2 text-headline-md font-semibold tracking-tight text-on-surface">
										{current.title}
									</h2>
									<p className="mt-2 text-body-md text-on-surface-variant">
										{current.helper}
									</p>
								</div>
								<StepFields step={current} form={form} update={update} />
								{error && (
									<div
										role="alert"
										className="flex items-start gap-3 rounded-md border border-error bg-error-container p-4 text-on-error-container"
									>
										<AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
										<div className="text-body-md">{error}</div>
									</div>
								)}
								<div className="flex gap-3 pt-2">
									{step > 0 && (
										<Button
											type="button"
											variant="outline"
											size="lg"
											onClick={() => setStep((s) => Math.max(s - 1, 0))}
											disabled={loading}
										>
											Atrás
										</Button>
									)}
									<Button
										type="submit"
										size="lg"
										disabled={loading}
										className="flex-1 sm:flex-none"
									>
										{loading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Calculando...
											</>
										) : isLast ? (
											"Calcular IRPF"
										) : (
											<>
												Siguiente
												<ChevronRight className="ml-1 h-4 w-4" />
											</>
										)}
									</Button>
								</div>
							</form>
						</div>
						<div className="rounded-xl border border-outline-variant bg-surface-container p-8 self-start">
							<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
								QUÉ VAS A OBTENER
							</p>
							<ul className="mt-4 flex flex-col gap-3 text-body-md text-on-surface">
								<li>· Base imponible y cuota líquida estimada</li>
								<li>· Desglose cuota estatal vs autonómica</li>
								<li>· Deducciones aplicables (Melilla + estatales)</li>
								<li>· Resultado: a devolver o a pagar</li>
								<li>· Disclaimer y referencias normativas</li>
							</ul>
							<div className="mt-6 rounded-md bg-surface-container-high p-4 text-body-sm text-on-surface-variant">
								<strong className="text-on-surface">Privacidad:</strong> los
								datos que introduces se procesan en el momento y no se
								almacenan de forma identificable.
							</div>
						</div>
					</div>
				)}
				</DemoLimitGate>
			</ToolPageShell>
		</PageShell>
	);
}

function ProgressBar({ current, total }: { current: number; total: number }) {
	const pct = ((current + 1) / total) * 100;
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between text-label-lg text-on-surface-variant">
				<span>Progreso</span>
				<span>
					{current + 1}/{total}
				</span>
			</div>
			<div className="h-1.5 w-full rounded-full bg-surface-container-high">
				<div
					className="h-full rounded-full bg-primary transition-all duration-300"
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
}

function StepFields({
	step,
	form,
	update,
}: {
	step: Step;
	form: EstimateRequest;
	update: <K extends keyof EstimateRequest>(
		key: K,
		value: EstimateRequest[K],
	) => void;
}) {
	if (step.id === "rol") {
		return (
			<FormField label="Eres..." htmlFor="rol">
				<select
					id="rol"
					className="h-11 w-full rounded-md bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					value={form.rol}
					onChange={(e) =>
						update("rol", e.target.value as "particular" | "autonomo")
					}
				>
					<option value="particular">Particular (trabajo por cuenta ajena)</option>
					<option value="autonomo">Autónomo (actividad económica)</option>
				</select>
			</FormField>
		);
	}
	if (step.id === "ccaa") {
		return (
			<FormField label="Comunidad autónoma" htmlFor="ccaa-g">
				<select
					id="ccaa-g"
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
		);
	}
	if (step.id === "ingresos") {
		return (
			<div className="flex flex-col gap-4">
				<FormField
					label="Rendimientos del trabajo (bruto anual)"
					htmlFor="rt"
					hint="Suma de salario bruto del año"
				>
					<Input
						id="rt"
						type="number"
						min={0}
						step={500}
						value={form.rendimientos_trabajo}
						onChange={(e) =>
							update("rendimientos_trabajo", Number(e.target.value))
						}
					/>
				</FormField>
				{form.rol === "autonomo" && (
					<FormField
						label="Rendimientos actividades económicas"
						htmlFor="rae"
						hint="Ingresos como autónomo (factura - gastos deducibles)"
					>
						<Input
							id="rae"
							type="number"
							min={0}
							step={500}
							value={form.rendimientos_actividades_economicas}
							onChange={(e) =>
								update(
									"rendimientos_actividades_economicas",
									Number(e.target.value),
								)
							}
						/>
					</FormField>
				)}
			</div>
		);
	}
	if (step.id === "personal") {
		return (
			<div className="flex flex-col gap-4">
				<FormField label="Edad" htmlFor="edad-g">
					<Input
						id="edad-g"
						type="number"
						min={18}
						max={110}
						value={form.edad_contribuyente}
						onChange={(e) =>
							update("edad_contribuyente", Number(e.target.value))
						}
					/>
				</FormField>
				<FormField label="Hijos menores de 25 a tu cargo" htmlFor="hijos-g">
					<Input
						id="hijos-g"
						type="number"
						min={0}
						max={12}
						value={form.hijos_menores_25}
						onChange={(e) =>
							update("hijos_menores_25", Number(e.target.value))
						}
					/>
				</FormField>
			</div>
		);
	}
	if (step.id === "extras") {
		return (
			<div className="flex flex-col gap-4">
				<FormField label="Grado de discapacidad (%)" htmlFor="disc-g">
					<Input
						id="disc-g"
						type="number"
						min={0}
						max={100}
						value={form.discapacidad_contribuyente}
						onChange={(e) =>
							update("discapacidad_contribuyente", Number(e.target.value))
						}
					/>
				</FormField>
				<label className="inline-flex items-center gap-2 text-body-md text-on-surface">
					<input
						type="checkbox"
						checked={form.tributacion_conjunta}
						onChange={(e) =>
							update("tributacion_conjunta", e.target.checked)
						}
					/>
					Tributación conjunta (declaración con cónyuge)
				</label>
			</div>
		);
	}
	return null;
}

function ResultPanel({
	result,
	onReset,
}: {
	result: EstimateResponse;
	onReset: () => void;
}) {
	// Backend uses *_total / *_general suffixes; legacy field names kept as
	// fallback so the panel works even if a future backend version renames them.
	const resultado = result.resultado_estimado ?? result.resultado ?? 0;
	const baseImponible =
		result.base_imponible ??
		(result.base_imponible_general ?? 0) + (result.base_imponible_ahorro ?? 0);
	const cuotaLiquida = result.cuota_liquida_total ?? result.cuota_liquida;
	const cuotaIntegra = result.cuota_integra_general ?? result.cuota_estatal;
	const deduccionMelilla = result.deduccion_ceuta_melilla;

	return (
		<div className="flex flex-col gap-8">
			<div>
				<p className="text-label-caps uppercase tracking-[0.12em] text-primary">
					RESULTADO IRPF ESTIMADO
				</p>
				<p
					className={`mt-2 text-display-md font-bold ${
						resultado <= 0 ? "text-primary" : "text-warning"
					}`}
				>
					{fmtEur(resultado)}
				</p>
				<p className="mt-1 text-body-md text-on-surface-variant">
					{resultado <= 0 ? "A devolver" : "A pagar"}
				</p>
			</div>
			<div className="grid grid-cols-2 gap-6 border-t border-outline-variant pt-6 md:grid-cols-4">
				<Stat label="Base imponible" value={fmtEur(baseImponible)} />
				<Stat label="Cuota íntegra" value={fmtEur(cuotaIntegra)} />
				<Stat
					label="Deducción Ceuta/Melilla"
					value={fmtEur(deduccionMelilla)}
				/>
				<Stat label="Cuota líquida" value={fmtEur(cuotaLiquida)} />
			</div>
			{(() => {
				const deds =
					(result.deducciones_autonomicas as Array<{
						name?: string;
						amount?: number;
					}> | undefined) ?? result.deducciones;
				if (!deds || deds.length === 0) return null;
				return (
					<div>
						<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
							DEDUCCIONES APLICADAS
						</p>
						<ul className="mt-3 flex flex-col gap-2">
							{deds.map((d, i) => (
								<li
									key={i}
									className="flex items-center justify-between rounded-md border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md"
								>
									<span className="text-on-surface">{d.name ?? "Deducción"}</span>
									<span className="font-semibold text-primary">
										{fmtEur(d.amount)}
									</span>
								</li>
							))}
						</ul>
					</div>
				);
			})()}
			<Button onClick={onReset} variant="outline" size="lg" className="self-start">
				Hacer otra estimación
			</Button>
		</div>
	);
}

function Stat({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
				{label}
			</p>
			<p className="mt-1 text-headline-sm font-semibold text-on-surface">
				{value}
			</p>
		</div>
	);
}
