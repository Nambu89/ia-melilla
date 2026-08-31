import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
	ArrowRight,
	ClipboardCheck,
	GraduationCap,
	Wand2,
	type LucideIcon,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AnimatedHeadline from "@/components/animations/AnimatedHeadline";
import AuroraBackground from "@/components/decoration/AuroraBackground";
import RevealOnScroll from "@/components/animations/RevealOnScroll";
import { AiDisclaimer } from "@/components/demo/AiDisclaimer";
import { AboutMelilla } from "@/components/sections/AboutMelilla";
import { ServiceNotice } from "@/components/tutor/ServiceNotice";
import { RUTA_DEL_TUTOR } from "@/components/tutor/TutorToolShell";
import { demoTutorOpositoresContent } from "@/content/demoTutorOpositores";
import { obtenerTemas } from "@/lib/tutorApi";

interface Herramienta {
	href: string;
	title: string;
	description: string;
	icon: LucideIcon;
	badge: string;
	featured?: boolean;
}

const HERRAMIENTAS: Herramienta[] = [
	{
		href: `${RUTA_DEL_TUTOR}/tutor`,
		title: "Resuelve dudas del temario",
		description:
			"Pregunta lo que no entiendas y te contesta con los fragmentos del temario que ha usado, numerados al lado de cada afirmación. Si la duda no está en el temario, lo dice.",
		icon: GraduationCap,
		badge: "FLAGSHIP",
		featured: true,
	},
	{
		href: `${RUTA_DEL_TUTOR}/test`,
		title: "Test de diez preguntas",
		description:
			"Diez preguntas del temario, sin reloj y sin penalización por fallo. Al corregir, despliega cualquiera y el tutor te explica por qué esa era la buena.",
		icon: ClipboardCheck,
		badge: "CORRECCIÓN IA",
	},
	{
		href: `${RUTA_DEL_TUTOR}/generador`,
		title: "Generador de preguntas",
		description:
			"Elige un tema y mira cómo se fabrica una pregunta nueva, con el fragmento del temario del que sale puesto al lado como prueba.",
		icon: Wand2,
		badge: "GENERACIÓN",
	},
];

export default function DemoTutorOpositores() {
	const { hero, comoFunciona, cierre } = demoTutorOpositoresContent;
	const temasIndexados = useTemasIndexados(comoFunciona.temasIndexados);

	const estadisticas = [
		{
			value: temasIndexados,
			label: "Temas del temario",
			hint: "indexados y consultables",
		},
		...comoFunciona.stats,
	];

	return (
		<PageShell>
			<SeoHead
				title="Tutor IA para opositores — Demo con el temario dentro"
				description="Demo abierta de un tutor IA anclado al temario de una oposición: resuelve dudas citando la fuente, te pone un test de diez preguntas y te corrige explicando cada fallo."
				path={RUTA_DEL_TUTOR}
			/>
			<section className="relative overflow-hidden">
				<AuroraBackground />
				<div className="relative mx-auto max-w-[1200px] px-6 pt-20 pb-16 md:pt-28">
					<RevealOnScroll>
						<Badge variant="primary" className="mb-6">
							DEMO 2 · DISPONIBLE
						</Badge>
					</RevealOnScroll>
					<AnimatedHeadline
						lines={["Un profesor particular", "que se sabe el temario."]}
						as="h1"
						className="text-display-md md:text-display-lg lg:text-display-xl font-bold max-w-5xl text-on-surface"
					/>
					<RevealOnScroll delay={0.2}>
						<p className="mt-8 max-w-2xl text-body-lg text-on-surface-variant">
							{hero.subheadline}
						</p>
						<ServiceNotice className="mt-8 max-w-3xl" />
						<AiDisclaimer className="mt-8 max-w-3xl" />
						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Button asChild size="lg">
								<Link to={`${RUTA_DEL_TUTOR}/tutor`}>
									Preguntarle algo ahora
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<Link to={`${RUTA_DEL_TUTOR}/test`}>Hacer un test de 10</Link>
							</Button>
						</div>
					</RevealOnScroll>
				</div>
			</section>

			<section className="mx-auto max-w-[1200px] px-6 pb-24">
				<RevealOnScroll>
					<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted mb-3">
						HERRAMIENTAS DISPONIBLES
					</p>
					<h2 className="text-headline-lg font-semibold tracking-tight text-on-surface">
						Tres formas de estudiar con él.
					</h2>
				</RevealOnScroll>
				<div className="mt-10 grid gap-6 md:grid-cols-2">
					{HERRAMIENTAS.map((herramienta) => (
						<TarjetaDeHerramienta
							key={herramienta.href}
							herramienta={herramienta}
						/>
					))}
				</div>
			</section>

			<AboutMelilla
				eyebrow={comoFunciona.eyebrow}
				headline={comoFunciona.headline}
				body={comoFunciona.body}
				stats={estadisticas}
			/>

			<section className="mx-auto max-w-[1200px] px-6 pb-24">
				<RevealOnScroll>
					<div className="rounded-xl border border-outline-variant bg-surface-container p-8 md:p-12">
						<div className="grid gap-6 md:grid-cols-[2fr_1fr] md:items-center">
							<div>
								<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
									{cierre.eyebrow}
								</p>
								<h2 className="mt-3 text-headline-md font-semibold tracking-tight text-on-surface">
									{cierre.headline}
								</h2>
								<p className="mt-4 text-body-md text-on-surface-variant">
									{cierre.body}
								</p>
							</div>
							<div className="flex flex-col gap-3 md:items-end">
								<Button asChild size="lg">
									<Link to="/contacto">Pedir cita</Link>
								</Button>
								<Button asChild variant="outline" size="lg">
									<Link to="/demos">Ver las demás demos</Link>
								</Button>
							</div>
						</div>
					</div>
				</RevealOnScroll>
			</section>
		</PageShell>
	);
}

/**
 * El número de temas indexados, preguntado al backend.
 *
 * Se pregunta en vez de escribirlo aquí porque un dato a mano en una demo
 * envejece sin que nadie se entere: el día que el corpus crezca, la página
 * seguiría diciendo el número viejo. Si el backend no contesta se queda el
 * respaldo del fichero de contenido, que es peor que el dato real pero mejor
 * que un hueco.
 */
function useTemasIndexados(respaldo: number): number {
	const [temas, setTemas] = useState(respaldo);
	const montadoRef = useRef(true);

	useEffect(() => {
		montadoRef.current = true;
		const controlador = new AbortController();
		obtenerTemas(controlador.signal)
			.then((lista) => {
				if (montadoRef.current && lista.length > 0) setTemas(lista.length);
			})
			.catch(() => {
				// Silencio deliberado: es un adorno, no puede romper la portada.
			});
		return () => {
			montadoRef.current = false;
			controlador.abort();
		};
	}, []);

	return temas;
}

function TarjetaDeHerramienta({ herramienta }: { herramienta: Herramienta }) {
	const Icono = herramienta.icon;
	return (
		<Link
			to={herramienta.href}
			className={`group relative flex flex-col gap-4 rounded-xl border border-outline-variant bg-surface-container p-8 transition-all duration-200 hover:border-primary/50 hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
				herramienta.featured ? "md:col-span-2 md:row-auto" : ""
			}`}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<Icono size={22} aria-hidden />
				</div>
				<Badge variant={herramienta.featured ? "primary" : "b2b"}>
					{herramienta.badge}
				</Badge>
			</div>
			<div>
				<h3 className="text-headline-sm font-semibold text-on-surface">
					{herramienta.title}
				</h3>
				<p className="mt-2 text-body-md text-on-surface-variant">
					{herramienta.description}
				</p>
			</div>
			<div className="mt-auto flex items-center gap-1.5 text-label-lg font-medium text-primary transition-transform duration-200 group-hover:translate-x-1">
				Probar
				<ArrowRight size={16} />
			</div>
		</Link>
	);
}
