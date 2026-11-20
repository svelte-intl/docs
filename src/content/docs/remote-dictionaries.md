---
title: Remote dictionaries
seoTitle: Load translations from an API or database
description: Load @svelte-i18n/core dictionaries from a CMS, API or database with async loaders, use SvelteKit's fetch for SSR, and handle errors.
---

A dictionary loader can be any function that returns a flat `Record<string, string>`, or a promise of one. This lets you load translations from a CMS, a translation platform or your own database.

## From an API

Pass SvelteKit's `fetch` from the load event into `loadI18n`, so requests work during SSR and the response is reused on the client:

```ts title="src/lib/i18n.ts"
import { createContext } from 'svelte';
import { createI18n } from '@svelte-i18n/core';
import type { I18nDictionary } from './i18n-types';

export const LOCALES = ['en', 'nl'] as const;
export const DEFAULT_LOCALE = 'en';
export const COOKIE_NAME = 'lang';

export type Locale = (typeof LOCALES)[number];

export function resolveLocale(value: string | null | undefined): Locale {
	return LOCALES.find((locale) => locale === value) ?? DEFAULT_LOCALE;
}

export function loadI18n(locale: string, fetch: typeof globalThis.fetch) {
	const load = async (lang: Locale): Promise<I18nDictionary> => {
		const response = await fetch(`https://cms.example.com/translations/${lang}.json`);
		if (!response.ok) throw new Error(`Could not load translations for "${lang}"`);
		return response.json();
	};

	return createI18n({
		locales: [...LOCALES],
		locale,
		fallbackLocale: DEFAULT_LOCALE,
		cookieName: COOKIE_NAME,
		dictionaries: {
			en: () => load('en'),
			nl: () => load('nl')
		}
	});
}

export type I18n = Awaited<ReturnType<typeof loadI18n>>;

const [getI18n, setI18nContext] = createContext<I18n>();

export const useI18n = getI18n;
export const setI18n = (i18n: () => I18n) => setI18nContext(i18n());
```

```ts title="src/routes/+layout.ts"
import { loadI18n } from '#lib/i18n.ts';

export const load = async ({ data, fetch }) => {
	return { i18n: await loadI18n(data.locale, fetch) };
};
```

The `I18nDictionary` type keeps autocomplete working. Generate it from one of your dictionaries with the CLI, as described in [Type safety](/docs/type-safety#remote-dictionaries).

## Errors

If the loader for the initial locale throws, `createI18n` rejects and the error goes through SvelteKit's normal error handling. If you'd rather show untranslated keys than an error page, catch the error and return an empty object:

```ts
const load = async (lang: Locale): Promise<I18nDictionary> => {
	try {
		const response = await fetch(`https://cms.example.com/translations/${lang}.json`);
		if (!response.ok) throw new Error(response.statusText);
		return await response.json();
	} catch (error) {
		console.error(`Could not load translations for "${lang}"`, error);
		return {} as I18nDictionary;
	}
};
```

## Caching

The loader runs on every server request. For a remote source, add HTTP caching on the API, or cache the result in memory on the server, so you don't fetch the same dictionary for every page view.
