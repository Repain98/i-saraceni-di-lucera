import type { ImageMetadata } from "astro";

const immagini = import.meta.glob<{ default: ImageMetadata }>(
	"/src/assets/uploads/**/*.{jpg,jpeg,png,webp,avif}",
	{ eager: true },
);

function normalizzaPercorso(percorso: string) {
	if (percorso.startsWith("/images/uploads/")) {
		return `/src/assets/uploads/${percorso.slice("/images/uploads/".length)}`;
	}
	if (percorso.startsWith("src/assets/uploads/")) {
		return `/${percorso}`;
	}
	return percorso;
}

export function resolveImage(percorso?: string): ImageMetadata | undefined {
	if (!percorso) return undefined;
	return immagini[normalizzaPercorso(percorso)]?.default;
}
