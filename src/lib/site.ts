import { getEntry } from "astro:content";
import siteConfig from "../data/site.json";

export async function getSiteData() {
	const [datiSocieta, paginaIniziale, numeri] = await Promise.all([
		getEntry("impostazioni", "dati-societa"),
		getEntry("impostazioni", "pagina-iniziale"),
		getEntry("impostazioni", "numeri"),
	]);

	if (!datiSocieta || !paginaIniziale || !numeri) {
		throw new Error(
			"Impostazioni del sito non trovate: controlla src/content/impostazioni.",
		);
	}

	return {
		...datiSocieta.data,
		hero_etichetta: paginaIniziale.data.hero_etichetta,
		hero_titolo: paginaIniziale.data.hero_titolo,
		hero_titolo_evidenziato: paginaIniziale.data.hero_titolo_evidenziato,
		hero_testo: paginaIniziale.data.hero_testo,
		hero_immagine: paginaIniziale.data.hero_immagine,
		statistiche: numeri.data.statistiche,
		notaFotoSegnaposto: siteConfig.notaFotoSegnaposto,
	};
}

export type SiteData = Awaited<ReturnType<typeof getSiteData>>;
