import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const dataOpzionale = z.preprocess((valore) => {
	if (!valore) return undefined;
	if (valore instanceof Date) return valore;
	const data = new Date(String(valore));
	return Number.isNaN(data.getTime()) ? undefined : data;
}, z.date().optional());

const dataRichiesta = z.coerce.date();

const impostazioni = defineCollection({
	loader: glob({ pattern: "*.md", base: "./src/content/impostazioni" }),
	schema: z.object({
		nome_sito: z.string().default("I Saraceni di Lucera"),
		descrizione_sito: z.string().optional(),
		anno_fondazione: z.string().default("[DA CONFERMARE]"),
		codice_fidal: z.string().default("FG806"),
		email: z.string().default("[DA COMPILARE]"),
		telefono: z.string().default("[DA COMPILARE]"),
		whatsapp: z.string().default("[DA COMPILARE]"),
		sede: z.string().default("[DA COMPILARE]"),
		google_maps: z.string().default("[DA COMPILARE]"),
		facebook: z.string().default("[DA COMPILARE]"),
		instagram: z.string().default("[DA COMPILARE]"),
		youtube: z.string().default("[DA COMPILARE]"),
		testo_footer: z
			.string()
			.default(
				"Podismo a Lucera. Strada, campestre, pista e trail: un gruppo affiatato che corre per vincere e per divertirsi.",
			),
		statistiche: z
			.array(
				z.object({
					valore: z.string(),
					etichetta: z.string(),
				}),
			)
			.default([]),
		hero_etichetta: z.string().default("ASD di podismo · Lucera · FIDAL FG806"),
		hero_titolo: z.string().default("Vincere"),
		hero_titolo_evidenziato: z.string().default("e divertirsi."),
		hero_testo: z
			.string()
			.default(
				"Corriamo insieme tra strada, campestre, pista e trail. Un gruppo affiatato che porta il nome di Lucera nei campionati FIDAL e nei circuiti provinciali della Capitanata.",
			),
		hero_immagine: z.string().optional(),
	}),
});

const news = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/news" }),
	schema: z.object({
		titolo: z.string(),
		data: dataOpzionale,
		estratto: z.string(),
		categoria: z.string().optional(),
		copertina: z.string().optional(),
		esempio: z.boolean().default(false),
	}),
});

const gare = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/gare" }),
	schema: z.object({
		titolo: z.string(),
		data: dataRichiesta,
		luogo: z.string(),
		distanza: z.string().optional(),
		tipo: z.enum(["Strada", "Campestre", "Pista", "Trail", "Altro"]).default("Strada"),
		descrizione: z.string().optional(),
		link: z.string().optional(),
		esempio: z.boolean().default(false),
	}),
});

const palmares = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/palmares" }),
	schema: z.object({
		anno: z.number().int(),
		anno_da_confermare: z.boolean().default(false),
		competizione: z.string(),
		categoria: z.string().optional(),
		risultato: z.string().optional(),
		descrizione: z.string().optional(),
		esempio: z.boolean().default(false),
	}),
});

const stralucera = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/stralucera" }),
	schema: z.object({
		anno: z.number().int(),
		edizione: z.number().int(),
		data: dataRichiesta,
		partenza: z.string(),
		luogo: z.string(),
		distanza: z.string(),
		circuito: z.string().optional(),
		organizzazione: z.string().optional(),
		partecipanti: z.string().optional(),
		maglia: z.string().optional(),
		medaglia: z.string().optional(),
		descrizione: z.string().optional(),
		immagine: z.string().optional(),
		nota_fonte: z.string().optional(),
		invito_titolo: z.string().default("Resta aggiornato"),
		invito_testo: z
			.string()
			.default("Segui il calendario e i nostri canali per le novità."),
		vincitori: z
			.array(
				z.object({
					nome: z.string(),
					societa: z.string().optional(),
					tempo: z.string().optional(),
				}),
			)
			.default([]),
	}),
});

const sponsor = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/sponsor" }),
	schema: z.object({
		nome: z.string(),
		logo: z.string().optional(),
		sito: z.string().optional(),
		livello: z.enum(["Principale", "Sostenitore", "Tecnico", "Altro"]).default("Sostenitore"),
		ordine: z.number().int().default(0),
		esempio: z.boolean().default(false),
	}),
});

const galleria = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/galleria" }),
	schema: z.object({
		titolo: z.string(),
		data: dataOpzionale,
		descrizione: z.string().optional(),
		copertina: z.string().optional(),
		immagini: z.array(z.string()).default([]),
		esempio: z.boolean().default(false),
	}),
});

const allenamenti = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/allenamenti" }),
	schema: z.object({
		giorno: z.string(),
		orario: z.string(),
		luogo: z.string(),
		note: z.string().optional(),
		ordine: z.number().int().default(0),
		esempio: z.boolean().default(false),
	}),
});

const pagine = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pagine" }),
	schema: z.object({
		titolo: z.string(),
		descrizione: z.string().optional(),
		intro: z.string().optional(),
		immagine: z.string().optional(),
	}),
});

export const collections = {
	impostazioni,
	news,
	gare,
	palmares,
	stralucera,
	sponsor,
	galleria,
	allenamenti,
	pagine,
};
