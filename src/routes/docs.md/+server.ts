import { getDoc } from '#lib/server/content.ts';
import { docToMarkdown } from '#lib/server/llms.ts';

export const prerender = true;

export const GET = () =>
	new Response(docToMarkdown(getDoc('')!), {
		headers: { 'content-type': 'text/markdown; charset=utf-8' }
	});
