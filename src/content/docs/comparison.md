---
title: Comparison
seoTitle: Svelte i18n libraries compared
description: How @svelte-i18n/core compares to Paraglide JS, Wuchale and svelte-i18n for internationalizing Svelte 5 and SvelteKit apps, and when to choose which.
---

There are several good i18n options for Svelte. They make different trade-offs, and the right one depends on the size of your project.

| | `@svelte-i18n/core` | Paraglide JS | Wuchale | `svelte-i18n` |
|---|---|---|---|---|
| Approach | Runtime, key → string | Compiler, generates a function per message | Compiler, extracts plain text from your components | Runtime, Svelte stores |
| Syntax in components | `t('Hello, {name}!', { name })` | `m.hello({ name })` | Just write text | `$_('hello', { values: { name } })` |
| Message format | `{placeholder}` | Variants, plurals | Plurals (PO files) | ICU MessageFormat |
| Localized URLs | No | Yes | No | No |
| Build step | None | Yes | Yes | None |
| Setup | A few files | CLI + Vite plugin | Vite plugin + config | A few files |

> [!NOTE]
> This table describes the other libraries at a high level. Check their docs for current details.

## Choose `@svelte-i18n/core` when

- your app has a handful of languages and up to a few hundred strings,
- you want to keep using plain JSON files that anyone can edit,
- you want typed keys without a compiler or a build step,
- you prefer `t()` over stores, and you're on Svelte 5.

## Choose something else when

- **You need SEO in every language.** Paraglide JS supports localized URLs like `/nl/over-ons`.
- **You don't want to write keys at all.** Wuchale extracts the text from your components.
- **You need ICU plurals and select rules.** `svelte-i18n` supports ICU MessageFormat.
- **You have thousands of strings** and want only the messages a page uses in its bundle. Paraglide's per-message functions are tree-shakable.

## Coming from `svelte-i18n`

| `svelte-i18n` | `@svelte-i18n/core` |
|---|---|
| `register('nl', () => import('./nl.json'))` | `dictionaries: { nl: async () => (await import('./nl.json')).default }` |
| `init({ fallbackLocale: 'en', initialLocale })` | `createI18n({ locales, locale, fallbackLocale: 'en', dictionaries })` |
| `{$_('key')}` | `{t('key')}` |
| `$_('key', { values: { name } })` | `t('key', { name })` |
| `$locale = 'nl'` | `setLocale('nl')` |
| `$isLoading` | `getLoading()` |

Nested keys need to be flattened, for example `"home.title"`, and ICU syntax needs to be rewritten as separate keys.
