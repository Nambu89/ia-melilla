import { type RouteObject } from "react-router-dom";
import Home from "@/pages/Home";
import Empresas from "@/pages/Empresas";
import Particulares from "@/pages/Particulares";
import DemoIaFiscal from "@/pages/DemoIaFiscal";
import Contacto from "@/pages/Contacto";
import Portafolio from "@/pages/Portafolio";
import Blog from "@/pages/Blog";
import AvisoLegal from "@/pages/AvisoLegal";
import PoliticaPrivacidad from "@/pages/PoliticaPrivacidad";
import PoliticaCookies from "@/pages/PoliticaCookies";
import NotFound from "@/pages/NotFound";

export const routes: RouteObject[] = [
	{ path: "/", element: <Home /> },
	{ path: "/empresas", element: <Empresas /> },
	{ path: "/particulares", element: <Particulares /> },
	{ path: "/demos/ia-fiscal-melilla", element: <DemoIaFiscal /> },
	{ path: "/contacto", element: <Contacto /> },
	{ path: "/portafolio", element: <Portafolio /> },
	{ path: "/blog", element: <Blog /> },
	{ path: "/aviso-legal", element: <AvisoLegal /> },
	{ path: "/politica-de-privacidad", element: <PoliticaPrivacidad /> },
	{ path: "/politica-de-cookies", element: <PoliticaCookies /> },
	{ path: "*", element: <NotFound /> },
];
