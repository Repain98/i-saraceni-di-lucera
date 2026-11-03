import type { APIRoute } from "astro";
import { getSiteData } from "../lib/site";

export const GET: APIRoute = async () => {
	const site = await getSiteData();
	const robots = site.noindex
		? "User-agent: *\nDisallow: /\n"
		: "User-agent: *\nAllow: /\n";

	return new Response(robots, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};
