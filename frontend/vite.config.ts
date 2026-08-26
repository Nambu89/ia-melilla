import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { seoFilesPlugin } from "./scripts/seo-files-plugin";

export default defineConfig({
	plugins: [react(), tailwindcss(), seoFilesPlugin()],
	resolve: {
		alias: { "@": path.resolve(__dirname, "src") },
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./src/test/setup.ts",
	},
});
