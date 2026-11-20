import { error } from '@sveltejs/kit';
import { getDoc, orderedDocs } from '#lib/server/content.ts';
import { docToMarkdown } from '#lib/server/llms.ts';

export const prerender = true;

export const entries = () => orderedDocs.filter((d) => d.slug).map((d) => ({ slug: d.slug }));

export const GET = ({ params }) => {
	const doc = getDoc(params.slug);
	if (!doc) error(404, 'Not found');
	return new Response(docToMarkdown(doc), {
		headers: { 'content-type': 'text/markdown; charset=utf-8' }
	});
};
