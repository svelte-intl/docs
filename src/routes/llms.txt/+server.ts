import { llmsTxt } from '#lib/server/llms.ts';

export const prerender = true;

export const GET = () =>
	new Response(llmsTxt(), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
