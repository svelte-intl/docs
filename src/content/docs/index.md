---
title: Introduction
seoTitle: Svelte i18n library for Svelte 5 and SvelteKit
description: '@svelte-i18n/core is a tiny, type-safe i18n library for Svelte 5 and SvelteKit. Built on runes, SSR-safe, with flat JSON dictionaries and autocompleted translation keys.'
---

`@svelte-i18n/core` is a small internationalization (i18n) library for **Svelte 5** and **SvelteKit**. You write your translations as flat JSON, call `t('Hello, {name}!', { name })` in your components, and TypeScript autocompletes every key and checks the parameters.

```json title="src/lib/locales/nl.json"
{
	"Hello, {name}!": "Hallo, {name}!",
	"Subscribe": "Abonneren"
}
```

```svelte title="src/routes/+page.svelte"
<script lang="ts">
	import { useI18n } from '#lib/i18n.ts';

	const { t } = useI18n();
</script>

<h1>{t('Hello, {name}!', { name: 'Richard' })}</h1>
<button>{t('Subscribe')}</button>
```

## Why this library

- **Runes, not stores.** `t()` is a plain function. There is no `$_` or `$t` store syntax.
- **Type-safe keys.** Keys are autocompleted from your JSON files, and keys with placeholders like `{name}` require the matching parameters.
- **SSR-safe.** Each request gets its own instance via SvelteKit `load` functions and Svelte's context API, so users never see each other's language.
- **Flat dictionaries.** One key, one string. Readable keys like `"Welcome back"` are easy to search for in your codebase.
- **Lazy loading.** Only the active language is loaded. Dictionaries can be imported, fetched from an API or added per route with [`extend`](/docs/extend).
- **Persisted locale.** `setLocale` stores the user's choice in a cookie and updates `<html lang>`.

## Requirements

| | Version |
|---|---|
| Svelte | 5.40 or newer (uses `createContext`) |
| SvelteKit | 2 or 3 |
| TypeScript | optional, recommended |

> [!NOTE]
> The examples use the `#lib` import alias from **SvelteKit 3**. On SvelteKit 2, write `$lib/i18n` instead of `#lib/i18n.ts`.

## Not to be confused with `svelte-i18n`

There is an older, unrelated package on npm called [`svelte-i18n`](https://github.com/kaisermann/svelte-i18n), which uses Svelte stores. This library is **`@svelte-i18n/core`** and works differently:

| `svelte-i18n` (stores) | `@svelte-i18n/core` (this library) |
|---|---|
| `import { _ } from 'svelte-i18n'` | `const { t } = useI18n()` |
| `{$_('key')}` | `{t('key')}` |
| `init()`, `register()`, `addMessages()` | `createI18n({ locales, locale, dictionaries })` |
| `$locale = 'nl'` | `setLocale('nl')` |
| ICU message format, plurals | plain `{placeholder}` interpolation |

## When to use something else

This library is intentionally small. It does not do nested keys, ICU message syntax, plural rules, localized URLs (`/nl/about`) or translation extraction. If you need those, look at [Paraglide JS](https://www.npmjs.com/package/@inlang/paraglide-js) or [Wuchale](https://wuchale.dev/). See the [comparison](/docs/comparison) for details.

Ready? Continue with [Getting started](/docs/getting-started).
