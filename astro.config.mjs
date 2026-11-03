// @ts-check
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// URL del sito: punto unico da modificare quando sarà disponibile il dominio definitivo.
// Questo valore alimenta canonical, Open Graph, sitemap e dati strutturati.
const SITE_URL = "https://i-saraceni-di-lucera.pages.dev";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const siteConfig = JSON.parse(
	fs.readFileSync(path.join(rootDir, "src", "data", "site.json"), "utf8"),
);
const noindex = siteConfig.noindex !== false;
const uploadsDir = path.join(rootDir, "src", "assets", "uploads");
const uploadsUrlPrefix = "/images/uploads/";
const mimeTypes = {
	".avif": "image/avif",
	".jpeg": "image/jpeg",
	".jpg": "image/jpeg",
	".png": "image/png",
	".webp": "image/webp",
};

// I file caricati dal CMS stanno in src/assets/uploads per essere ottimizzati da Astro.
// Questo integration li rende raggiungibili anche all'indirizzo pubblico usato dal CMS.
const uploadsIntegration = {
	name: "uploads-statici",
	hooks: {
		"astro:server:setup": ({ server }) => {
			server.middlewares.use((req, res, next) => {
				if (!req.url?.startsWith(uploadsUrlPrefix)) return next();

				const relativePath = decodeURIComponent(
					req.url.slice(uploadsUrlPrefix.length).split("?")[0],
				);
				const filePath = path.join(uploadsDir, relativePath);

				if (
					!filePath.startsWith(`${uploadsDir}${path.sep}`) ||
					!fs.existsSync(filePath)
				) {
					return next();
				}

				res.setHeader(
					"Content-Type",
					mimeTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream",
				);
				fs.createReadStream(filePath).pipe(res);
			});
		},
		"astro:build:done": ({ dir }) => {
			const destination = path.join(fileURLToPath(dir), "images", "uploads");
			fs.mkdirSync(destination, { recursive: true });
			if (fs.existsSync(uploadsDir)) {
				fs.cpSync(uploadsDir, destination, {
					recursive: true,
					filter: (source) => path.basename(source) !== ".gitkeep",
				});
			}
		},
	},
};

// https://astro.build/config
export default defineConfig({
	site: SITE_URL,
	devToolbar: { enabled: false },
	integrations: [
		uploadsIntegration,
		...(noindex
			? []
			: [
					sitemap({
						filter: (page) => !page.includes("/admin/") && !page.includes("/404"),
					}),
				]),
	],
});
