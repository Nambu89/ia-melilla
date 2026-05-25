import { type RouteObject } from "react-router-dom";
import Home from "@/pages/Home";
import Empresas from "@/pages/Empresas";
import Demos from "@/pages/Demos";
import DemoIaFiscal from "@/pages/DemoIaFiscal";
import IaFiscalChat from "@/pages/IaFiscalChat";
import IaFiscalCalculadoraNeto from "@/pages/IaFiscalCalculadoraNeto";
import IaFiscalCalculadoraRetenciones from "@/pages/IaFiscalCalculadoraRetenciones";
import IaFiscalGuiaFiscal from "@/pages/IaFiscalGuiaFiscal";
import IaFiscalClasificadorFacturas from "@/pages/IaFiscalClasificadorFacturas";
import Contacto from "@/pages/Contacto";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import AvisoLegal from "@/pages/AvisoLegal";
import PoliticaPrivacidad from "@/pages/PoliticaPrivacidad";
import PoliticaCookies from "@/pages/PoliticaCookies";
import Terminos from "@/pages/Terminos";
import TransparenciaIA from "@/pages/TransparenciaIA";
import SobreNosotros from "@/pages/SobreNosotros";
import NotFound from "@/pages/NotFound";
import ClienteLogin from "@/pages/cliente/Login";
import ClienteDashboard from "@/pages/cliente/Dashboard";
import ClienteChat from "@/pages/cliente/Chat";
import ClienteCalculadoras from "@/pages/cliente/Calculadoras";
import ClienteClasificadorFacturas from "@/pages/cliente/ClasificadorFacturas";
import ClienteDefensia from "@/pages/cliente/Defensia";
import ClienteAjustes from "@/pages/cliente/Ajustes";
import { RequireAuth } from "@/components/auth/RequireAuth";

export const routes: RouteObject[] = [
	{ path: "/", element: <Home /> },
	{ path: "/empresas", element: <Empresas /> },
	{ path: "/demos", element: <Demos /> },
	{ path: "/demos/ia-fiscal-melilla", element: <DemoIaFiscal /> },
	{ path: "/demos/ia-fiscal-melilla/chat", element: <IaFiscalChat /> },
	{
		path: "/demos/ia-fiscal-melilla/calculadora-neto",
		element: <IaFiscalCalculadoraNeto />,
	},
	{
		path: "/demos/ia-fiscal-melilla/calculadora-retenciones",
		element: <IaFiscalCalculadoraRetenciones />,
	},
	{
		path: "/demos/ia-fiscal-melilla/guia-fiscal",
		element: <IaFiscalGuiaFiscal />,
	},
	{
		path: "/demos/ia-fiscal-melilla/clasificador-facturas",
		element: <IaFiscalClasificadorFacturas />,
	},
	{ path: "/contacto", element: <Contacto /> },
	{ path: "/blog", element: <Blog /> },
	{ path: "/blog/:slug", element: <BlogPost /> },
	{ path: "/aviso-legal", element: <AvisoLegal /> },
	{ path: "/politica-de-privacidad", element: <PoliticaPrivacidad /> },
	{ path: "/politica-de-cookies", element: <PoliticaCookies /> },
	{ path: "/terminos", element: <Terminos /> },
	{ path: "/transparencia-ia", element: <TransparenciaIA /> },
	{ path: "/sobre-nosotros", element: <SobreNosotros /> },
	// Cliente (suite SaaS authenticated)
	{ path: "/cliente/login", element: <ClienteLogin /> },
	{
		path: "/cliente",
		element: (
			<RequireAuth>
				<ClienteDashboard />
			</RequireAuth>
		),
	},
	{
		path: "/cliente/chat",
		element: (
			<RequireAuth>
				<ClienteChat />
			</RequireAuth>
		),
	},
	{
		path: "/cliente/calculadoras",
		element: (
			<RequireAuth>
				<ClienteCalculadoras />
			</RequireAuth>
		),
	},
	{
		path: "/cliente/clasificador-facturas",
		element: (
			<RequireAuth>
				<ClienteClasificadorFacturas />
			</RequireAuth>
		),
	},
	{
		path: "/cliente/defensia",
		element: (
			<RequireAuth>
				<ClienteDefensia />
			</RequireAuth>
		),
	},
	{
		path: "/cliente/ajustes",
		element: (
			<RequireAuth>
				<ClienteAjustes />
			</RequireAuth>
		),
	},
	{ path: "*", element: <NotFound /> },
];
