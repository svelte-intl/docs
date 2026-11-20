import { llmsFullTxt } from '#lib/server/llms.ts';

export const prerender = true;

export const GET = () =>
	new Response(llmsFullTxt(), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
