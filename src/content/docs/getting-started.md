---
title: Getting started
seoTitle: Add i18n to SvelteKit in 5 minutes
description: Step-by-step guide to add type-safe translations to a SvelteKit app with @svelte-i18n/core. Complete files for every step, SSR-safe, with a persisted language cookie.
---

This guide adds translations to an existing SvelteKit app. At the end you have:

- translations in `src/lib/locales/*.json`
- a `t()` function with autocompleted keys in every component
- the user's language stored in a cookie and rendered on the server
- the correct `<html lang>` attribute for SEO and screen readers

Every code block below is a **complete file**. Copy them as they are.

> [!NOTE]
> The examples target **SvelteKit 3**, which imports from `src/lib` with `#lib/...` and file extensions. On **SvelteKit 2**, write `$lib/i18n` instead of `#lib/i18n.ts`.

## 1. Install

```bash
npm install @svelte-i18n/core
```

Or use `pnpm add @svelte-i18n/core`, `yarn add @svelte-i18n/core` or `bun add @svelte-i18n/core`.

## 2. Add your dictionaries

A dictionary is a flat JSON object: the key is the text you write in your code, the value is the translation. Using the English text as the key keeps your components readable.

```json title="src/lib/locales/en.json"
{
	"Hello, {name}!": "Hello, {name}!",
	"Change language": "Change language"
}
```

```json title="src/lib/locales/nl.json"
{
	"Hello, {name}!": "Hallo, {name}!",
	"Change language": "Taal wijzigen"
}
```

## 3. Create `src/lib/i18n.ts`

This file holds your whole i18n configuration: the supported languages, how dictionaries are loaded, and the typed `useI18n` helper you use in components.

```ts title="src/lib/i18n.ts"
import { createContext } from 'svelte';
import { createI18n } from '@svelte-i18n/core';

export const LOCALES = ['en', 'nl'] as const;
export const DEFAULT_LOCALE = 'en';
export const COOKIE_NAME = 'lang';

export type Locale = (typeof LOCALES)[number];

/** Returns a supported locale, or the default when the value is unknown. */
export function resolveLocale(value: string | null | undefined): Locale {
	return LOCALES.find((locale) => locale === value) ?? DEFAULT_LOCALE;
}

/** Creates a new i18n instance. Called once per request in +layout.ts. */
export function loadI18n(locale: string) {
	return createI18n({
		locales: [...LOCALES],
		locale,
		fallbackLocale: DEFAULT_LOCALE,
		cookieName: COOKIE_NAME,
		dictionaries: {
			en: async () => (await import('./locales/en.json')).default,
			nl: async () => (await import('./locales/nl.json')).default
		}
	});
}

export type I18n = Awaited<ReturnType<typeof loadI18n>>;

const [getI18n, setI18nContext] = createContext<I18n>();

/** Use in any component to get `t`, `setLocale`, `getLocale` and more. */
export const useI18n = getI18n;

/** Call once in the root +layout.svelte. */
export const setI18n = (i18n: () => I18n) => setI18nContext(i18n());
```

Only the active language is downloaded, because each dictionary is a dynamic `import()`.

## 4. Read the cookie on the server

```ts title="src/routes/+layout.server.ts"
import { COOKIE_NAME, resolveLocale } from '#lib/i18n.ts';

export const load = ({ cookies }) => {
	return { locale: resolveLocale(cookies.get(COOKIE_NAME)) };
};
```

## 5. Create the instance in `+layout.ts`

```ts title="src/routes/+layout.ts"
import { loadI18n } from '#lib/i18n.ts';

export const load = async ({ data }) => {
	return { i18n: await loadI18n(data.locale) };
};
```

Creating the instance in a `load` function gives every request its own instance. This is what makes the library SSR-safe: never create it at the top level of a module.

## 6. Provide it in the root layout

```svelte title="src/routes/+layout.svelte"
<script lang="ts">
	import { setI18n } from '#lib/i18n.ts';

	let { children, data } = $props();

	setI18n(() => data.i18n);
</script>

{@render children()}
```

## 7. Set `<html lang>` on the server

In `src/app.html`, replace the `lang` attribute with a placeholder:

```html title="src/app.html"
<html lang="%lang%">
```

Then fill it in with the ready-made server hook:

```ts title="src/hooks.server.ts"
import { createI18nHandle } from '@svelte-i18n/core/server';
import { LOCALES, DEFAULT_LOCALE, COOKIE_NAME } from '#lib/i18n.ts';

export const handle = createI18nHandle({
	locales: LOCALES,
	fallbackLocale: DEFAULT_LOCALE,
	cookieName: COOKIE_NAME
});
```

It reads the cookie, picks a supported locale and writes it into `%lang%`. Already have a `handle`? Combine them with `sequence(createI18nHandle({ ... }), handle)` from `@sveltejs/kit/hooks`.

On the client, `setLocale` updates `document.documentElement.lang` for you.

## 8. Translate

```svelte title="src/routes/+page.svelte"
<script lang="ts">
	import { useI18n, LOCALES } from '#lib/i18n.ts';

	const { t, setLocale, getLocale } = useI18n();
</script>

<h1>{t('Hello, {name}!', { name: 'Richard' })}</h1>

<p>{t('Change language')}:</p>
{#each LOCALES as locale}
	<button onclick={() => setLocale(locale)} disabled={getLocale() === locale}>
		{locale}
	</button>
{/each}
```

That's it. Clicking a button switches the language without a page reload, stores the choice in the `lang` cookie, and the next server render uses it.

> [!TIP]
> Destructuring `useI18n()` is safe: `t`, `getLocale()` and the other functions stay reactive. Avoid destructuring the getters `locale` and `loading`, as those lose reactivity. Use `getLocale()` and `getLoading()` instead.

## Next steps

- [Dictionaries](/docs/dictionaries): placeholders, missing keys and loading strategies
- [Type safety](/docs/type-safety): what TypeScript checks, and generating types for remote dictionaries
- [Switching locale](/docs/switching-locale): language switcher, browser language detection, loading state
- [Route-level translations](/docs/extend): load extra translations for a single page
