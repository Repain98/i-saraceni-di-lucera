// @ts-check
import { defineConfig } from 'astro/config';

// URL del sito: punto unico da modificare quando sarà disponibile il dominio definitivo.
// Questo valore alimenta canonical, Open Graph, sitemap e dati strutturati.
const SITE_URL = 'https://i-saraceni-di-lucera.pages.dev';

// https://astro.build/config
export default defineConfig({
	site: SITE_URL,
});
