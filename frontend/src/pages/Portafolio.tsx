import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { portafolioContent } from "@/content/portafolio";
import { business } from "@/content/shared";

export default function Portafolio() {
	return (
		<PageShell>
			<section className="mx-auto max-w-[1200px] px-6 pt-16 pb-24">
				<p className="text-label-caps text-primary mb-6">{portafolioContent.hero.eyebrow}</p>
				<h1 className="text-display-md font-bold tracking-tight max-w-3xl">
					{portafolioContent.hero.headline}
				</h1>
				<p className="mt-6 text-body-lg text-on-surface-variant max-w-2xl">
					{portafolioContent.hero.subheadline}
				</p>
				<div className="mt-16 rounded-xl border border-outline-variant bg-surface-container p-12 text-center">
					<p className="text-body-lg text-on-surface-variant">{portafolioContent.placeholderNote}</p>
					<Button asChild variant="outline" className="mt-6">
						<a href={business.instagram} target="_blank" rel="noreferrer">
							Ver Instagram →
						</a>
					</Button>
				</div>
			</section>
		</PageShell>
	);
}
