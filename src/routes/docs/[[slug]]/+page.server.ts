import { error } from '@sveltejs/kit';
import { orderedDocs, renderDoc } from '#lib/server/content.ts';

export const entries = () => orderedDocs.map((doc) => ({ slug: doc.slug || undefined }));

export const load = async ({ params }) => {
	const doc = await renderDoc(params.slug ?? '');
	if (!doc) error(404, 'Not found');

	const { markdown: _, ...rest } = doc;
	return { doc: rest };
};
