export default function App() {
	return (
		<div className="min-h-screen bg-surface text-on-surface p-12">
			<p className="text-label-caps text-primary mb-6">DESIGN SYSTEM SMOKE TEST</p>
			<h1 className="text-display-lg font-bold tracking-tight">
				Tailwind v4 + DESIGN.md tokens OK
			</h1>
			<p className="text-body-lg text-on-surface-variant mt-6 max-w-2xl">
				Si ves charcoal background, texto blanco, eyebrow en emerald y boton verde abajo — el
				pipeline DESIGN.md → theme.css → Tailwind v4 funciona.
			</p>
			<button
				type="button"
				className="mt-10 inline-flex items-center justify-center h-11 px-6 bg-primary text-on-primary rounded-md font-semibold hover:bg-primary-hover transition-colors"
			>
				Primary CTA
			</button>
			<button
				type="button"
				className="mt-10 ml-3 inline-flex items-center justify-center h-11 px-6 bg-surface-container-high text-on-surface rounded-md font-semibold hover:bg-surface-container-highest transition-colors"
			>
				Secondary
			</button>
		</div>
	);
}
