---
title: Persistent locale
description: Learn how locale persistence and the HTML lang attribute work
section: Miscellaneous
---

<script>
    import { Callout, Steps, Step } from "@svecodocs/kit";
</script>

When a user switches language, `setLocale` updates the active locale **and** stores it in a cookie (default name: `lang`). On the next page load, your server can read that cookie and pass the correct locale to `createI18n`.

## Language switcher

```svelte
<script lang="ts">
    import { useI18n } from '$lib/i18n';

    const { getLocales, setLocale } = useI18n();
</script>

<div class="flex gap-2">
    {#each getLocales() as locale}
        <button onclick={() => setLocale(locale)}>
            {locale}
        </button>
    {/each}
</div>
```

No extra persistence logic is required — the cookie is written automatically when `setLocale` is called in the browser.

## Read the cookie on the server

In `+layout.server.ts`, read the same cookie and pass it to your layout load function:

```ts title="src/routes/+layout.server.ts"
export const load = async ({ cookies }) => {
	const locale = cookies.get('lang');

	return {
		locale: locale ?? 'en'
	};
};
```

Then use `data.locale` when creating the i18n instance:

```ts title="src/routes/+layout.ts"
export const load = async ({ data }) => {
	const i18n = await createI18n({
		locales: ['en', 'nl'],
		locale: data.locale,
		fallbackLocale: 'en',
		dictionaries: {
			// ...
		}
	});

	return { i18n };
};
```

## Custom cookie name

Override the default cookie name (`lang`) via `cookieName` in `createI18n`:

```ts
const i18n = await createI18n({
	locales: ['en', 'nl'],
	locale: data.locale,
	cookieName: 'locale',
	dictionaries: {
		// ...
	}
});
```

Use the same name in `+layout.server.ts` and `hooks.server.ts`.

## HTML `lang` attribute

For accessibility and SEO, the document language should match the active locale.

### Client-side

`setLocale` updates `document.documentElement.lang` automatically when the user switches language.

### Server-side (SSR)

Set a placeholder in `app.html`:

```html title="src/app.html"
<html lang="%lang%">
```

Then replace `%lang%` in a server hook using the cookie value:

```ts title="src/hooks.server.ts"
import type { Handle } from '@sveltejs/kit';

const COOKIE_NAME = 'lang';
const FALLBACK_LOCALE = 'en';

export const handle: Handle = async ({ event, resolve }) => {
	const locale = event.cookies.get(COOKIE_NAME);

	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('%lang%', locale ?? FALLBACK_LOCALE)
	});
};
```

<Callout type="note">

Use the same cookie name everywhere: `createI18n({ cookieName })`, `+layout.server.ts`, and `hooks.server.ts`.

</Callout>
