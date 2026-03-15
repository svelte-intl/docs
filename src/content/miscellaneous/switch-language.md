---
title: Persistent locale
description: Learn how to safe to make the locale persistent
section: Miscellaneous
---

<script>
    import { Callout, Steps, Step } from "@svecodocs/kit";
</script>

Somewhere in your app, you have this

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

This is a very basic method of changing the locale, and in a real world app you would store the locale somewhere
so that the correct locale is persisted when the site gets refreshed.

Here is a guide how you can achieve that.

<Steps>

<Step>Edit $lib/i18n</Step>

In you `i18n.ts` file create a new method to retrieve the locale from a persistend storage, like the `localeStorage`.

```ts title="src/lib/i18n.ts" {5-25}
import { createI18n } from '$lib/i18n';
import nl from './locales/nl.json';
import en from './locales/en.json';

// add this
const locales = ['en', 'nl'];
const fallbackLocale = 'en';

function loadLocale() {
	// If using SSR, we can't access localStorage, so we return early
	if (!browser) {
		return fallbackLocale;
	}

	if (localStorage.getItem('locale')) {
		return localStorage.getItem('locale') as string;
	}

	const language = navigator.language.split('-')[0];
	if (locales.includes(language)) {
		return language;
	}

	return fallbackLocale;
}

export const { i18n, useI18n } = await createI18n({
    locales,
    locale: loadLocale(),
    fallbackLocale,
    dictionaries: {
        nl,
        en
    }
});
```

</Steps>