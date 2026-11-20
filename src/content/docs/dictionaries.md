---
title: Dictionaries
seoTitle: Translation dictionaries and placeholders
description: How to write translation dictionaries for @svelte-i18n/core. Flat JSON keys, {placeholder} interpolation, missing keys, and static, lazy or remote loading.
---

A dictionary is a flat JSON object that maps a key to a translated string. You need one dictionary per locale.

```json title="src/lib/locales/en.json"
{
	"Welcome, {username}!": "Welcome, {username}!",
	"Subscribe": "Subscribe",
	"You have used {count} of {total} credits": "You have used {count} of {total} credits"
}
```

```json title="src/lib/locales/nl.json"
{
	"Welcome, {username}!": "Welkom, {username}!",
	"Subscribe": "Abonneren",
	"You have used {count} of {total} credits": "Je hebt {count} van de {total} credits gebruikt"
}
```

## Keys

Keys can be any string. Two styles work:

| Style | Example | Trade-off |
|---|---|---|
| Source text as key (recommended) | `"Welcome, {username}!"` | Readable in components, searchable, and TypeScript checks the params. Changing the English text means renaming the key in every file. |
| Identifier as key | `"welcome_banner"` | Stable when the copy changes, but your components no longer show the text, and TypeScript cannot see the placeholders (see [type safety](/docs/type-safety)). |

Dictionaries are **flat**. A key like `"nav.home"` is just a string with a dot in it. There is no nested lookup, and nested objects are a type error.

> [!TIP]
> Most projects use nested keys out of habit. A flat key like `"Welcome to our website"` is easier to read and search than `banner.heading.title`.

## Placeholders

Write placeholders as `{name}` in the value and pass the values as the second argument of `t`:

```svelte
<p>{t('You have used {count} of {total} credits', { count: 3, total: 10 })}</p>
<!-- Je hebt 3 van de 10 credits gebruikt -->
```

Rules:

- Values can be strings or numbers.
- A placeholder without a matching parameter stays in the output as `{name}`.
- A placeholder can appear more than once. Every occurrence is replaced.
- Values are inserted as they are. A value that contains `{other}` is not replaced again.
- The output is plain text. Svelte escapes it when you render it with `{t(...)}`. Never pass user input to `{@html t(...)}`.

## Missing translations

When a key is not in the active dictionary, or its translation is an empty string, `t` returns the key itself, with placeholders filled in. With source-text keys, that means users see the English text instead of an empty string.

`fallbackLocale` does **not** fill in missing keys from another dictionary. It is only used to choose a locale when the requested one isn't supported.

## Plurals and formatting

There are no built-in plural rules. Use separate keys and pick one with the browser's `Intl.PluralRules`:

```svelte title="src/lib/components/Cart.svelte"
<script lang="ts">
	import { useI18n } from '#lib/i18n.ts';

	let { count }: { count: number } = $props();
	const { t, getLocale } = useI18n();

	const plural = $derived(new Intl.PluralRules(getLocale()).select(count));
</script>

<p>
	{plural === 'one'
		? t('{count} item in your cart', { count })
		: t('{count} items in your cart', { count })}
</p>
```

Format numbers, currencies and dates with `Intl` and the active locale:

```ts
const price = new Intl.NumberFormat(getLocale(), { style: 'currency', currency: 'EUR' }).format(19.99);
const date = new Intl.DateTimeFormat(getLocale(), { dateStyle: 'long' }).format(new Date());
```

## Loading dictionaries

Each entry in `dictionaries` can be an object or a function that returns one, sync or async. Only the active locale is loaded.

### Lazy import (recommended)

Each language becomes its own chunk, so users only download the language they use:

```ts
dictionaries: {
	en: async () => (await import('./locales/en.json')).default,
	nl: async () => (await import('./locales/nl.json')).default
}
```

### Static import

Simpler, but every language ends up in your bundle:

```ts
import en from './locales/en.json';
import nl from './locales/nl.json';

// ...
dictionaries: { en, nl }
```

### From an API or database

See [Remote dictionaries](/docs/remote-dictionaries).
