import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { ToolPageShell } from "@/components/demo/ToolPageShell";
import { InvoiceClassifierCore } from "@/components/clasificador/InvoiceClassifierCore";

export default function IaFiscalClasificadorFacturas() {
	return (
		<PageShell>
			<SeoHead
				title="Clasificador de Facturas · IA Fiscal Melilla"
				description="Sube una factura y la IA extrae los datos (proveedor, base, impuestos), clasifica según PGC y genera el asiento contable."
				path="/demos/ia-fiscal-melilla/clasificador-facturas"
			/>
			<ToolPageShell
				title="Clasificador de Facturas"
				description="Sube una factura en PDF o foto. La IA extrae todos los datos con OCR, la clasifica según el Plan General Contable y propone el asiento. Útil para autónomos y pymes que quieren ahorrar tiempo en contabilidad."
			>
				<InvoiceClassifierCore />
			</ToolPageShell>
		</PageShell>
	);
}
