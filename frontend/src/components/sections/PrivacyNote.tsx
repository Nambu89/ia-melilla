import { Shield } from "lucide-react";

interface PrivacyNoteProps {
	headline: string;
	body: string;
}

export function PrivacyNote({ headline, body }: PrivacyNoteProps) {
	return (
		<section className="mx-auto max-w-[1200px] px-6 py-24">
			<div className="flex gap-6 items-start rounded-xl border border-outline-variant bg-surface-container p-12">
				<Shield className="h-8 w-8 shrink-0 text-primary" aria-hidden="true" />
				<div>
					<h2 className="text-headline-md font-semibold tracking-tight">{headline}</h2>
					<p className="mt-3 text-body-md text-on-surface-variant">{body}</p>
				</div>
			</div>
		</section>
	);
}
