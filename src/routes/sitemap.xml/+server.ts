import { SITE } from '#lib/site.ts';
import { orderedDocs } from '#lib/server/content.ts';

export const prerender = true;

export const GET = () => {
	const urls = ['/', ...orderedDocs.map((doc) => doc.href)];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `\t<url><loc>${SITE.url}${path === '/' ? '/' : path}</loc></url>`).join('\n')}
</urlset>
`;
	return new Response(body, { headers: { 'content-type': 'application/xml' } });
};
