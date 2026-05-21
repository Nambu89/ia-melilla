import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";

function AppRoutes() {
	return useRoutes(routes);
}

export default function App() {
	return (
		<HelmetProvider>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</HelmetProvider>
	);
}
