import MarqueeRow from "@/components/marketing/MarqueeRow";

const TECH_ITEMS = [
	"OpenAI",
	"Retrieval-Augmented Generation",
	"FastAPI",
	"Python 3.12",
	"React 18",
	"TypeScript",
	"Streaming SSE",
	"Multi-agent",
	"Vector DB",
	"LangChain",
	"Tailwind CSS",
	"Vite",
	"PostgreSQL",
	"Docker",
];

export function MarqueeTech() {
	return (
		<section
			aria-label="Tecnologías que usamos"
			className="border-y border-outline-variant bg-surface-container-low py-8"
		>
			<MarqueeRow
				speed={45}
				items={TECH_ITEMS.map((label, i) => (
					<span
						key={i}
						className="text-label-lg uppercase tracking-[0.18em] text-on-surface-variant"
					>
						{label}
					</span>
				))}
			/>
		</section>
	);
}
