import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const roots = ["src/content", "src/data", "dist"];
const markers = [
	"[DA COMPILARE]",
	"[ESEMPIO]",
	"[PROVA]",
	"[DA CONFERMARE]",
	"Testo della pagina da completare",
];
const extensions = new Set([
	".astro",
	".css",
	".html",
	".js",
	".json",
	".md",
	".mdx",
	".txt",
	".xml",
]);

const files = [];

async function collectFiles(directory) {
	let entries;
	try {
		entries = await readdir(directory, { withFileTypes: true });
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}

	for (const entry of entries) {
		if (entry.name === "node_modules" || entry.name === ".git") continue;

		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			await collectFiles(fullPath);
		} else if (entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase())) {
			files.push(fullPath);
		}
	}
}

for (const root of roots) {
	await collectFiles(path.join(rootDir, root));
}

const results = new Map(markers.map((marker) => [marker, []]));

for (const file of files) {
	const content = await readFile(file, "utf8");
	for (const marker of markers) {
		const count = content.split(marker).length - 1;
		if (count > 0) {
			results.get(marker).push({
				file: path.relative(rootDir, file).replaceAll(path.sep, "/"),
				count,
			});
		}
	}
}

const foundMarkers = markers.filter((marker) => results.get(marker).length > 0);

if (foundMarkers.length === 0) {
	console.log("Nessun segnaposto trovato.");
	process.exit(0);
}

let totale = 0;
console.log("Segnaposto trovati:");

for (const marker of foundMarkers) {
	const voci = results.get(marker).sort((a, b) => a.file.localeCompare(b.file, "it"));
	const conteggio = voci.reduce((somma, voce) => somma + voce.count, 0);
	totale += conteggio;
	console.log(`\n${marker}: ${conteggio}`);
	for (const voce of voci) {
		console.log(`  ${voce.file} (${voce.count})`);
	}
}

console.log(`\nTotale: ${totale}`);
process.exit(1);
