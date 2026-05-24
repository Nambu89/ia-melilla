import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { InvoiceClassifierCore } from "@/components/clasificador/InvoiceClassifierCore";

export default function ClienteClasificadorFacturas() {
	return (
		<PageShell>
			<SeoHead
				title="Clasificador de Facturas — Panel cliente — IA Melilla"
				description="OCR + clasificación PGC + asiento contable de facturas. Suite cliente IA Melilla."
				path="/cliente/clasificador-facturas"
			/>
			<section className="mx-auto max-w-[1200px] px-6 pt-12 pb-24">
				<Link
					to="/cliente"
					className="inline-flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary mb-6"
				>
					<ArrowLeft className="h-4 w-4" aria-hidden="true" />
					Volver al panel
				</Link>

				<p className="text-label-caps text-primary mb-3">Clasificador de facturas</p>
				<h1 className="text-display-sm font-bold tracking-tight">
					OCR y clasificación contable
				</h1>
				<p className="mt-3 max-w-2xl text-body-md text-on-surface-variant">
					Sube una factura (PDF o foto). Extraemos proveedor, base imponible,
					impuestos (IVA / IPSI) y total. La clasificamos según el Plan
					General Contable y proponemos el asiento contable.
				</p>

				<div className="mt-10">
					<InvoiceClassifierCore />
				</div>
			</section>
		</PageShell>
	);
}
