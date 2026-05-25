import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
	Loader2,
	AlertCircle,
	FileUp,
	FileCheck2,
	X,
	Trash2,
	Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	uploadAndProcessInvoice,
	type InvoiceUploadResponse,
	ApiError,
} from "@/lib/fiscalApi";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = [
	"application/pdf",
	"image/jpeg",
	"image/png",
	"image/webp",
];

function fmtEur(n: number | undefined): string {
	if (n === undefined || n === null || Number.isNaN(n)) return "—";
	return new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 2,
	}).format(n);
}

function fmtMb(bytes: number): string {
	return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function InvoiceClassifierCore() {
	const [file, setFile] = useState<File | null>(null);
	const [result, setResult] = useState<InvoiceUploadResponse | null>(null);
	const [status, setStatus] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [dragOver, setDragOver] = useState(false);
	const abortRef = useRef<AbortController | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const acceptFile = useCallback((f: File): string | null => {
		if (f.size > MAX_SIZE_BYTES) {
			return `Archivo demasiado grande. Máximo ${fmtMb(MAX_SIZE_BYTES)}.`;
		}
		if (
			!ACCEPTED_TYPES.includes(f.type) &&
			!/\.(pdf|jpg|jpeg|png|webp)$/i.test(f.name)
		) {
			return "Formato no soportado. Usa PDF, JPG, PNG o WEBP.";
		}
		return null;
	}, []);

	function handleFileSelected(f: File | null) {
		setError(null);
		setResult(null);
		setStatus(null);
		if (!f) {
			setFile(null);
			return;
		}
		const reason = acceptFile(f);
		if (reason) {
			setError(reason);
			setFile(null);
			return;
		}
		setFile(f);
	}

	function onInputChange(e: ChangeEvent<HTMLInputElement>) {
		const f = e.target.files?.[0] ?? null;
		handleFileSelected(f);
	}

	function onDrop(e: DragEvent<HTMLLabelElement>) {
		e.preventDefault();
		setDragOver(false);
		const f = e.dataTransfer.files?.[0] ?? null;
		handleFileSelected(f);
	}

	function reset() {
		abortRef.current?.abort();
		setFile(null);
		setResult(null);
		setStatus(null);
		setError(null);
		setLoading(false);
		if (inputRef.current) inputRef.current.value = "";
	}

	async function processInvoice() {
		if (!file) return;
		setLoading(true);
		setError(null);
		setResult(null);
		setStatus("Iniciando...");
		const ctrl = new AbortController();
		abortRef.current = ctrl;
		try {
			const data = await uploadAndProcessInvoice(file, {
				signal: ctrl.signal,
				onProgress: setStatus,
			});
			setResult(data);
			setStatus(null);
		} catch (err) {
			if ((err as Error).name === "AbortError") {
				setStatus(null);
				return;
			}
			if (err instanceof ApiError) {
				if (err.status === 413) {
					setError("El archivo es demasiado grande para el servidor.");
				} else if (err.status === 415 || err.status === 422) {
					setError("Formato no aceptado por el servidor. Prueba PDF o JPG.");
				} else {
					setError(`Error del servidor (HTTP ${err.status}). Inténtalo de nuevo.`);
				}
			} else {
				setError((err as Error).message || "No pudimos procesar la factura.");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
			<div className="flex flex-col gap-5">
				<DropZone
					file={file}
					loading={loading}
					dragOver={dragOver}
					onDrag={setDragOver}
					onDrop={onDrop}
					onPick={() => inputRef.current?.click()}
					onRemove={() => handleFileSelected(null)}
				/>
				<input
					ref={inputRef}
					type="file"
					accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
					onChange={onInputChange}
					className="sr-only"
					aria-label="Seleccionar factura"
				/>

				{error && (
					<div
						role="alert"
						className="flex items-start gap-3 rounded-md border border-error bg-error-container p-4 text-on-error-container"
					>
						<AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
						<div className="text-body-md">{error}</div>
					</div>
				)}

				<div className="flex gap-3">
					<Button
						size="lg"
						disabled={!file || loading}
						onClick={processInvoice}
						className="flex-1 sm:flex-none"
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{status ?? "Procesando..."}
							</>
						) : (
							"Clasificar factura"
						)}
					</Button>
					{(file || result || error) && !loading && (
						<Button
							size="lg"
							variant="outline"
							onClick={reset}
							aria-label="Reiniciar"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Empezar de nuevo
						</Button>
					)}
				</div>

				<div className="mt-2 rounded-md bg-surface-container-low p-4 text-body-sm text-on-surface-muted">
					<p className="mb-2">
						<strong className="text-on-surface-variant">Tipos:</strong>{" "}
						PDF, JPG, PNG, WEBP. Máximo 10 MB.
					</p>
					<p>
						<strong className="text-on-surface-variant">Privacidad:</strong>{" "}
						la factura se procesa en el momento y se elimina automáticamente
						tras devolver el resultado. No la usamos para marketing ni para
						entrenar modelos.
					</p>
				</div>

				<div
					role="note"
					className="rounded-lg border border-warning/40 bg-warning-container/20 p-4 text-body-sm text-on-warning-container leading-relaxed"
				>
					<p className="mb-1 font-semibold text-warning">
						Aviso sobre datos de terceros
					</p>
					<p>
						No subas facturas con datos personales reales de terceros
						(clientes o proveedores) sin su consentimiento expreso. Para
						probar la herramienta utiliza una factura propia o pseudonimiza
						los datos antes de subirla.
					</p>
				</div>
			</div>

			<div>
				{!result && !loading && !error && <EmptyState />}
				{loading && <ProcessingState status={status} />}
				{result && <ResultPanel data={result} />}
			</div>
		</div>
	);
}

function DropZone({
	file,
	loading,
	dragOver,
	onDrag,
	onDrop,
	onPick,
	onRemove,
}: {
	file: File | null;
	loading: boolean;
	dragOver: boolean;
	onDrag: (v: boolean) => void;
	onDrop: (e: DragEvent<HTMLLabelElement>) => void;
	onPick: () => void;
	onRemove: () => void;
}) {
	if (file) {
		return (
			<div className="flex items-center gap-4 rounded-xl border border-primary/40 bg-surface-container p-5">
				<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
					<FileCheck2 size={22} aria-hidden />
				</div>
				<div className="min-w-0 flex-1">
					<p className="truncate text-body-md font-semibold text-on-surface">
						{file.name}
					</p>
					<p className="text-body-sm text-on-surface-variant">
						{fmtMb(file.size)} · {file.type || "tipo desconocido"}
					</p>
				</div>
				{!loading && (
					<button
						type="button"
						onClick={onRemove}
						aria-label="Quitar archivo"
						className="rounded-md p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					>
						<X size={18} />
					</button>
				)}
			</div>
		);
	}
	return (
		<label
			onDragOver={(e) => {
				e.preventDefault();
				onDrag(true);
			}}
			onDragLeave={() => onDrag(false)}
			onDrop={onDrop}
			onClick={onPick}
			className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
				dragOver
					? "border-primary bg-surface-container-high"
					: "border-outline-variant bg-surface-container-low hover:border-primary/40 hover:bg-surface-container"
			}`}
		>
			<FileUp size={32} className="text-on-surface-variant" aria-hidden />
			<div>
				<p className="text-body-lg font-semibold text-on-surface">
					Arrastra una factura aquí
				</p>
				<p className="mt-1 text-body-md text-on-surface-variant">
					o haz clic para elegir un archivo
				</p>
			</div>
			<p className="text-label-lg text-on-surface-muted">
				PDF · JPG · PNG · WEBP · max 10MB
			</p>
		</label>
	);
}

function EmptyState() {
	return (
		<div className="flex h-full flex-col justify-center gap-3 rounded-xl border border-outline-variant bg-surface-container py-16 px-8 text-center">
			<Receipt size={32} className="mx-auto text-on-surface-muted" aria-hidden />
			<p className="text-headline-sm font-semibold text-on-surface">
				Sube una factura para empezar
			</p>
			<p className="mx-auto max-w-sm text-body-md text-on-surface-variant">
				Extraemos automáticamente proveedor, base imponible, impuestos
				(IVA / IPSI), total y clasificamos según PGC. Te proponemos el
				asiento contable listo para tu libro.
			</p>
		</div>
	);
}

function ProcessingState({ status }: { status: string | null }) {
	return (
		<div className="flex h-full flex-col justify-center gap-4 rounded-xl border border-outline-variant bg-surface-container py-16 px-8 text-center">
			<Loader2
				size={32}
				className="mx-auto animate-spin text-primary"
				aria-hidden
			/>
			<p className="text-headline-sm font-semibold text-on-surface">
				{status ?? "Procesando..."}
			</p>
			<p className="mx-auto max-w-sm text-body-md text-on-surface-variant">
				La IA está extrayendo los datos y clasificándolos. Puede tardar
				entre 5 y 15 segundos según el tipo de factura.
			</p>
		</div>
	);
}

function ResultPanel({ data }: { data: InvoiceUploadResponse }) {
	// Backend returns the structured payload nested under `factura` /
	// `clasificacion` / `validacion`. Read those first and fall back to the
	// legacy flat fields so the panel works for both shapes.
	const f = data.factura;
	const c = data.clasificacion;
	const v = data.validacion;

	const vendor =
		f?.emisor?.nombre ??
		data.vendor ??
		data.vendor_name ??
		data.supplier ??
		"Proveedor no detectado";
	const date = f?.fecha_factura ?? data.date ?? data.invoice_date;
	const number = f?.numero_factura ?? data.invoice_number ?? data.number;
	const subtotal = f?.base_imponible_total ?? data.subtotal ?? data.base_imponible;
	const tax =
		f?.cuota_iva ??
		data.tax ??
		data.tax_amount ??
		data.iva ??
		data.ipsi;
	const taxRate = f?.tipo_iva_pct ?? data.tax_rate;
	const total = f?.total ?? data.total ?? data.amount;
	const pgcCode =
		c?.cuenta_code ??
		data.pgc_account ??
		data.pgc_code ??
		data.classification ??
		data.category;
	const pgcName = c?.cuenta_nombre;
	const pgc = pgcCode && pgcName ? `${pgcCode} — ${pgcName}` : pgcCode;
	const justificacion = c?.justificacion;
	const confidenceLabel = v?.confianza_extraccion ?? c?.confianza;
	const confidence =
		confidenceLabel === "alta"
			? 95
			: confidenceLabel === "media"
				? 70
				: confidenceLabel === "baja"
					? 40
					: data.confidence !== undefined
						? Math.round(data.confidence * 100)
						: undefined;
	const entry = data.accounting_entry;

	return (
		<div className="flex flex-col gap-6 rounded-xl border border-outline-variant bg-surface-container p-8">
			<div className="flex items-start justify-between gap-4 border-b border-outline-variant pb-6">
				<div>
					<p className="text-label-caps uppercase tracking-[0.12em] text-primary">
						FACTURA CLASIFICADA
					</p>
					<h2 className="mt-2 text-headline-md font-semibold text-on-surface">
						{vendor}
					</h2>
					{(date || number) && (
						<p className="mt-1 text-body-sm text-on-surface-variant">
							{number && <span>Núm. {number}</span>}
							{number && date && <span> · </span>}
							{date && <span>{date}</span>}
						</p>
					)}
				</div>
				{confidence !== undefined && (
					<div className="shrink-0 text-right">
						<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
							CONFIANZA
						</p>
						<p
							className={`mt-1 text-headline-sm font-bold ${
								confidence >= 80 ? "text-primary" : "text-warning"
							}`}
						>
							{confidence}%
						</p>
					</div>
				)}
			</div>

			<div className="grid grid-cols-2 gap-4">
				<Stat label="Base imponible" value={fmtEur(subtotal)} />
				<Stat
					label={
						data.ipsi !== undefined
							? "IPSI"
							: taxRate !== undefined && taxRate !== null
								? `Impuesto (${taxRate}%)`
								: "Impuesto"
					}
					value={fmtEur(tax)}
				/>
				<Stat
					label="Total factura"
					value={fmtEur(total)}
					highlight
				/>
				{pgc && <Stat label="Cuenta PGC" value={String(pgc)} mono />}
			</div>

			{justificacion && (
				<div className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-sm text-on-surface-variant">
					<p className="mb-1 text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
						JUSTIFICACIÓN PGC
					</p>
					<p>{justificacion}</p>
				</div>
			)}

			{entry && (entry.debit || entry.credit) && (
				<div>
					<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted mb-3">
						ASIENTO CONTABLE PROPUESTO
					</p>
					<div className="overflow-hidden rounded-lg border border-outline-variant">
						<table className="w-full text-body-sm">
							<thead className="bg-surface-container-high">
								<tr>
									<th className="px-3 py-2 text-left font-semibold text-on-surface-variant">
										Cuenta
									</th>
									<th className="px-3 py-2 text-right font-semibold text-on-surface-variant">
										Debe
									</th>
									<th className="px-3 py-2 text-right font-semibold text-on-surface-variant">
										Haber
									</th>
								</tr>
							</thead>
							<tbody>
								{(entry.debit ?? []).map((l, i) => (
									<tr
										key={`d-${i}`}
										className="border-t border-outline-variant"
									>
										<td className="px-3 py-2 font-mono text-on-surface">
											{l.account}{" "}
											{l.description && (
												<span className="text-on-surface-muted">
													— {l.description}
												</span>
											)}
										</td>
										<td className="px-3 py-2 text-right font-mono text-on-surface">
											{fmtEur(l.amount)}
										</td>
										<td className="px-3 py-2 text-right text-on-surface-muted">
											—
										</td>
									</tr>
								))}
								{(entry.credit ?? []).map((l, i) => (
									<tr
										key={`c-${i}`}
										className="border-t border-outline-variant"
									>
										<td className="px-3 py-2 font-mono text-on-surface">
											{l.account}{" "}
											{l.description && (
												<span className="text-on-surface-muted">
													— {l.description}
												</span>
											)}
										</td>
										<td className="px-3 py-2 text-right text-on-surface-muted">
											—
										</td>
										<td className="px-3 py-2 text-right font-mono text-on-surface">
											{fmtEur(l.amount)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{(() => {
				// Normalise both nested (factura.lineas) and legacy (data.items)
				// to a single shape so the rendering loop is identical.
				const lineas = f?.lineas
					? f.lineas.map((l) => ({
							description: l.concepto,
							quantity: l.cantidad,
							unit_price: l.precio_unitario,
							total: l.base_imponible,
						}))
					: data.items;
				if (!lineas || lineas.length === 0) return null;
				return (
					<div>
						<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted mb-3">
							LÍNEAS DETECTADAS ({lineas.length})
						</p>
						<ul className="flex flex-col gap-2 text-body-sm">
							{lineas.slice(0, 8).map((item, i) => (
								<li
									key={i}
									className="flex items-start justify-between gap-4 rounded-md border border-outline-variant bg-surface-container-low px-3 py-2"
								>
									<span className="text-on-surface">
										{item.description ?? "—"}
									</span>
									<span className="shrink-0 font-mono text-on-surface-variant">
										{item.quantity ? `${item.quantity} · ` : ""}
										{fmtEur(item.total ?? item.unit_price)}
									</span>
								</li>
							))}
							{lineas.length > 8 && (
								<li className="text-on-surface-muted">
									+ {lineas.length - 8} líneas más...
								</li>
							)}
						</ul>
					</div>
				);
			})()}
		</div>
	);
}

function Stat({
	label,
	value,
	highlight,
	mono,
}: {
	label: string;
	value: string;
	highlight?: boolean;
	mono?: boolean;
}) {
	return (
		<div>
			<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
				{label}
			</p>
			<p
				className={`mt-1 ${mono ? "font-mono" : ""} ${
					highlight
						? "text-headline-sm font-bold text-primary"
						: "text-body-lg font-semibold text-on-surface"
				}`}
			>
				{value}
			</p>
		</div>
	);
}
