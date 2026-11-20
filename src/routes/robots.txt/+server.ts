import { SITE } from '#lib/site.ts';

export const prerender = true;

export const GET = () =>
	new Response(`User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`, {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
