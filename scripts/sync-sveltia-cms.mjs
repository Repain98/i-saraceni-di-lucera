import { copyFile, mkdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(rootDir, "node_modules", "@sveltia", "cms", "dist", "sveltia-cms.js");
const destination = join(rootDir, "public", "admin", "sveltia-cms.js");

await mkdir(dirname(destination), { recursive: true });
await copyFile(source, destination);

const { size } = await stat(destination);
console.log(`Sveltia CMS: bundle copiato (${(size / 1024 / 1024).toFixed(2)} MB).`);
