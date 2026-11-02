import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

const isWindows = process.platform === "win32";
const npmCli = process.env.npm_execpath;
const npxCli = npmCli ? join(dirname(npmCli), "npx-cli.js") : null;

function createCommand(cliPath, fallback, args) {
	if (cliPath && existsSync(cliPath)) {
		return { command: process.execPath, args: [cliPath, ...args], shell: false };
	}

	return {
		command: isWindows ? `${fallback}.cmd` : fallback,
		args,
		shell: isWindows,
	};
}

const astro = createCommand(npmCli, "npm", ["run", "dev"]);
const decap = createCommand(npxCli, "npx", ["--yes", "decap-server"]);

const processes = [
	{
		name: "Astro",
		child: spawn(astro.command, astro.args, { stdio: "inherit", shell: astro.shell }),
	},
	{
		name: "Decap",
		child: spawn(decap.command, decap.args, { stdio: "inherit", shell: decap.shell }),
	},
];

let stopping = false;

function stopAll() {
	if (stopping) return;
	stopping = true;

	for (const { child } of processes) {
		if (child.exitCode !== null || child.killed) continue;

		if (isWindows) {
			spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
				stdio: "ignore",
			});
		} else {
			child.kill("SIGTERM");
		}
	}
}

for (const { name, child } of processes) {
	child.on("error", (error) => {
		console.error(`[${name}] ${error.message}`);
		stopAll();
		process.exitCode = 1;
	});

	child.on("exit", (code, signal) => {
		if (stopping) return;

		const motivo = signal ? `segnale ${signal}` : `codice ${code ?? 1}`;
		console.error(`[${name}] terminato con ${motivo}.`);
		stopAll();
		process.exitCode = code ?? 1;
	});
}

process.on("SIGINT", () => {
	stopAll();
	process.exit(0);
});

process.on("SIGTERM", () => {
	stopAll();
	process.exit(0);
});
