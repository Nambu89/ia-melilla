import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { CookieBanner } from "@/components/cookies/CookieBanner";

function AppRoutes() {
	return useRoutes(routes);
}

export default function App() {
	return (
		<HelmetProvider>
			<BrowserRouter>
				<AppRoutes />
				<CookieBanner />
			</BrowserRouter>
		</HelmetProvider>
	);
}
