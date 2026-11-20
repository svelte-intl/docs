---
title: Switching locale
seoTitle: Language switcher and persisted locale in SvelteKit
description: Build a language switcher with @svelte-i18n/core, persist the choice in a cookie, detect the browser language with Accept-Language, and set the html lang attribute.
---

## Language switcher

```svelte title="src/lib/components/LanguageSwitcher.svelte"
<script lang="ts">
	import { useI18n, LOCALES } from '#lib/i18n.ts';

	const { setLocale, getLocale } = useI18n();

	const names: Record<string, string> = { en: 'English', nl: 'Nederlands' };
</script>

<select value={getLocale()} onchange={(e) => setLocale(e.currentTarget.value as (typeof LOCALES)[number])}>
	{#each LOCALES as locale}
		<option value={locale}>{names[locale]}</option>
	{/each}
</select>
```

When `setLocale` is called in the browser, it:

1. loads the dictionary of the new locale (languages are only downloaded when needed),
2. switches the locale, so the page re-renders with the new translations,
3. stores the locale in a cookie: `lang=<locale>; path=/; max-age=31536000; SameSite=Lax`,
4. sets `document.documentElement.lang`.

Steps 2 to 4 only happen after loading succeeded. If loading fails, the page stays in the current language and the promise returned by `setLocale` rejects. Unsupported locales are ignored. No reload and no navigation happens. The URL stays the same.

## Loading state

While a dictionary loads, `getLoading()` is `true`. With lazy-loaded JSON this is usually a few milliseconds, but for remote dictionaries you can show it:

```svelte
<script lang="ts">
	import { useI18n } from '#lib/i18n.ts';

	const { getLoading } = useI18n();
</script>

{#if getLoading()}
	<p aria-live="polite">Loading translations…</p>
{/if}
```

## Reading the cookie on the server

The [Getting started](/docs/getting-started) setup reads the cookie in `+layout.server.ts` and in `hooks.server.ts`. The layout goes through `resolveLocale`, and `createI18nHandle` only accepts locales from `LOCALES`. An unknown or manipulated cookie value falls back to the default locale and never ends up in your HTML.

To use a different cookie name, change `COOKIE_NAME` in `src/lib/i18n.ts`. It is passed to `createI18n` and `createI18nHandle` as `cookieName` and used by the server code, so the names always match.

## Detecting the browser language

On a first visit there is no cookie yet. To pick the user's preferred language instead of the default, read the `Accept-Language` header. Replace `resolveLocale` in `src/lib/i18n.ts` with:

```ts title="src/lib/i18n.ts"
/**
 * Picks the locale from the cookie, then from the Accept-Language header,
 * then falls back to the default.
 */
export function resolveLocale(cookie?: string | null, acceptLanguage?: string | null): Locale {
	const supported = (value: string) =>
		LOCALES.find((locale) => locale === value.toLowerCase().split('-')[0]);

	if (cookie && supported(cookie)) return supported(cookie)!;

	for (const part of acceptLanguage?.split(',') ?? []) {
		const match = supported(part.split(';')[0].trim());
		if (match) return match;
	}

	return DEFAULT_LOCALE;
}
```

And use it in both places:

```ts title="src/routes/+layout.server.ts"
import { COOKIE_NAME, resolveLocale } from '#lib/i18n.ts';

export const load = ({ cookies, request }) => {
	return {
		locale: resolveLocale(cookies.get(COOKIE_NAME), request.headers.get('accept-language'))
	};
};
```

```ts title="src/hooks.server.ts"
import { createI18nHandle } from '@svelte-i18n/core/server';
import { LOCALES, DEFAULT_LOCALE, COOKIE_NAME, resolveLocale } from '#lib/i18n.ts';

export const handle = createI18nHandle({
	locales: LOCALES,
	fallbackLocale: DEFAULT_LOCALE,
	locale: ({ cookies, request }) =>
		resolveLocale(cookies.get(COOKIE_NAME), request.headers.get('accept-language'))
});
```

The `locale` option replaces the default cookie lookup, so the hook and the layout pick the same locale.

## Prerendered and static sites

Cookies and headers only exist at request time. On a prerendered page (`export const prerender = true`) or with `adapter-static`, the server step runs once at build time, so every visitor gets the default locale in the HTML. After hydration, read the cookie in the browser and call `setLocale`:

```svelte title="src/routes/+layout.svelte"
<script lang="ts">
	import { onMount } from 'svelte';
	import { setI18n, useI18n, resolveLocale, COOKIE_NAME } from '#lib/i18n.ts';

	let { children, data } = $props();

	setI18n(() => data.i18n);
	const { setLocale, getLocale } = useI18n();

	onMount(() => {
		const cookie = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))?.[1];
		const locale = resolveLocale(cookie ?? navigator.language);
		if (locale !== getLocale()) setLocale(locale);
	});
</script>

{@render children()}
```

For a prerendered site, use `+layout.ts` without the `+layout.server.ts` step and pass `DEFAULT_LOCALE` to `loadI18n`.

> [!NOTE]
> For SEO, search engines only see the language that is in the HTML. If you want every language indexed, you need a URL per language (`/nl/...`). This library doesn't do localized routing. See the [comparison](/docs/comparison).
