export const SITE = {
	name: 'svelte-i18n',
	packageName: '@svelte-i18n/core',
	url: 'https://svelte-i18n.com',
	tagline: 'Type-safe i18n for Svelte 5 and SvelteKit',
	description:
		'A tiny, type-safe internationalization (i18n) library for Svelte 5 and SvelteKit. Built on runes, SSR-safe, with flat JSON dictionaries and autocompleted keys.',
	github: 'https://github.com/svelte-intl/core',
	npm: 'https://www.npmjs.com/package/@svelte-i18n/core',
	author: 'Richard Mauritz',
	ogImage: '/og.png',
	themeColor: '#E6266E'
} as const;

export type NavItem = { title: string; href: string };
export type NavSection = { title: string; items: NavItem[] };

/** Sidebar order. Slugs map to files in `src/content/docs/<slug>.md`. */
export const NAV: { title: string; slugs: string[] }[] = [
	{ title: 'Getting started', slugs: ['', 'getting-started'] },
	{
		title: 'Guides',
		slugs: ['dictionaries', 'type-safety', 'switching-locale', 'extend', 'remote-dictionaries']
	},
	{ title: 'Reference', slugs: ['api', 'comparison'] }
];

export const docHref = (slug: string) => (slug ? `/docs/${slug}` : '/docs');
