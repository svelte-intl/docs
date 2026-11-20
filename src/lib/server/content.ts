import { NAV, docHref, type NavSection } from '#lib/site.ts';
import { render, type TocItem } from './markdown.ts';

export type Doc = {
	slug: string;
	href: string;
	/** Visible H1 and sidebar label. */
	title: string;
	/** `<title>` override, keyword-rich. Falls back to `title`. */
	seoTitle: string;
	description: string;
	/** Markdown body without frontmatter. */
	markdown: string;
};

export type RenderedDoc = Doc & {
	html: string;
	toc: TocItem[];
	prev?: { title: string; href: string };
	next?: { title: string; href: string };
};

const files = import.meta.glob('/src/content/docs/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

function parseFrontmatter(source: string) {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
	if (!match) throw new Error('Missing frontmatter');

	const data: Record<string, string> = {};
	for (const line of match[1].split(/\r?\n/)) {
		const i = line.indexOf(':');
		if (i === -1) continue;
		const key = line.slice(0, i).trim();
		let value = line.slice(i + 1).trim();
		if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
		data[key] = value;
	}

	return { data, body: source.slice(match[0].length) };
}

const docs: Doc[] = Object.entries(files).map(([path, source]) => {
	const file = path.split('/').pop()!.replace(/\.md$/, '');
	const slug = file === 'index' ? '' : file;
	const { data, body } = parseFrontmatter(source);

	if (!data.title || !data.description) {
		throw new Error(`${path}: frontmatter needs "title" and "description"`);
	}

	return {
		slug,
		href: docHref(slug),
		title: data.title,
		seoTitle: data.seoTitle || data.title,
		description: data.description,
		markdown: body.trim() + '\n'
	};
});

const bySlug = new Map(docs.map((doc) => [doc.slug, doc]));

/** Docs in sidebar order. Throws when NAV and the content folder disagree. */
export const orderedDocs: Doc[] = NAV.flatMap((section) =>
	section.slugs.map((slug) => {
		const doc = bySlug.get(slug);
		if (!doc) throw new Error(`NAV references missing doc "${slug}"`);
		return doc;
	})
);

if (orderedDocs.length !== docs.length) {
	const missing = docs.filter((d) => !orderedDocs.includes(d)).map((d) => d.slug);
	throw new Error(`Docs not listed in NAV: ${missing.join(', ')}`);
}

export const navigation: NavSection[] = NAV.map((section) => ({
	title: section.title,
	items: section.slugs.map((slug) => {
		const doc = bySlug.get(slug)!;
		return { title: doc.title, href: doc.href };
	})
}));

export function getDoc(slug: string) {
	return bySlug.get(slug);
}

const cache = new Map<string, RenderedDoc>();

export async function renderDoc(slug: string): Promise<RenderedDoc | undefined> {
	const doc = bySlug.get(slug);
	if (!doc) return undefined;
	if (cache.has(slug)) return cache.get(slug);

	const { html, toc } = await render(doc.markdown);
	const index = orderedDocs.indexOf(doc);
	const link = (d?: Doc) => (d ? { title: d.title, href: d.href } : undefined);

	const rendered = {
		...doc,
		html,
		toc,
		prev: link(orderedDocs[index - 1]),
		next: link(orderedDocs[index + 1])
	};
	cache.set(slug, rendered);
	return rendered;
}
