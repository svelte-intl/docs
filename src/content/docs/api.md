---
title: API reference
seoTitle: API reference for createI18n, t and setLocale
description: Complete API reference for @svelte-i18n/core. Options of createI18n, the t function, setLocale, getLocale, extend, exported types and the CLI.
---

This page documents `@svelte-i18n/core` **v3.1**.

## Exports

```ts
import { createI18n, I18nContext, I18N_CONTEXT_KEY } from '@svelte-i18n/core';
import type { CreateI18nOptions, I18nInstance } from '@svelte-i18n/core';
import { createI18nHandle } from '@svelte-i18n/core/server';
import { i18n } from '@svelte-i18n/core/vite';
```

The library does **not** export `useI18n`. You create it yourself in `src/lib/i18n.ts` with Svelte's `createContext`, as shown in [Getting started](/docs/getting-started). That way it is fully typed for your dictionaries.

## `createI18n(options)`

Creates an i18n instance and loads the dictionary for the initial locale. Returns a `Promise`. Call it inside a SvelteKit `load` function so every request gets its own instance.

```ts
const i18n = await createI18n({
	locales: ['en', 'nl'],
	locale: 'nl',
	fallbackLocale: 'en',
	cookieName: 'lang',
	dictionaries: {
		en: async () => (await import('./locales/en.json')).default,
		nl: async () => (await import('./locales/nl.json')).default
	}
});
```

| Option | Type | Default | Description |
|---|---|---|---|
| `locales` | `string[]` | required | Supported locales. Their union type is used for `setLocale`. |
| `locale` | `string` | required | The initial locale, for example from a cookie. Resolved as described below. |
| `dictionaries` | `Record<Locale, Dictionary \| () => Dictionary \| Promise<Dictionary>>` | required | One entry per locale. `Dictionary` is a flat `Record<string, string>`. |
| `fallbackLocale` | `string` | `undefined` | Used when `locale` isn't supported. |
| `cookieName` | `string` | `'lang'` | Cookie that `setLocale` writes in the browser. |
| `strict` | `boolean` | `false` | Only accept known keys in `t`, so typos are type errors. See [type safety](/docs/type-safety#strict-mode). |

**Locale resolution.** The `locale` option is matched in this order:

1. an exact match in `locales` (`'nl'`),
2. the language part before the `-` (`'nl-BE'` becomes `'nl'`),
3. `fallbackLocale`,
4. the first entry of `locales`.

## Instance

`createI18n` resolves to an object with these members. Destructuring the functions is safe and they stay reactive.

### `t(key, params?)`

Returns the translation of `key` in the active locale, with `{placeholders}` replaced by `params`.

```ts
t('Hello, {name}!', { name: 'Richard' }); // "Hallo, Richard!"
```

- Returns `key` itself when the key isn't in the active dictionary, or when the translation is an empty string.
- `params` is required when the key contains placeholders.
- Parameter values can be `string` or `number`, and are inserted as they are.
- Every occurrence of a placeholder is replaced. Placeholders without a value stay in the output.

`_` is an alias of `t`. Prefer `t`.

### `setLocale(locale)`

Loads the dictionary for `locale` and then switches to it. Returns a `Promise<void>` that resolves when the switch is done.

Only after the dictionary has loaded:

- `getLocale()` and `t` change,
- in the browser, the cookie is written (`<cookieName>=<locale>; path=/; max-age=31536000; SameSite=Lax`, plus `Secure` on https),
- `document.documentElement.lang` is set.

If loading fails, nothing changes and the promise rejects. An unsupported locale is ignored with a console warning. When `setLocale` is called several times in a row, the last call wins.

```ts
await setLocale('nl');
getLocale(); // 'nl'
```

### `getLocale()`

Returns the active locale. Reactive.

### `getLocales()`

Returns the `locales` array.

### `getFallbackLocale()`

Returns `fallbackLocale`, or `undefined`.

### `getLoading()`

Returns `true` while a locale switch or `extend` is loading. It is `false` once `createI18n` has resolved, on the server and in the browser.

```svelte
{#if getLoading()}
	<p aria-live="polite">Loading translations…</p>
{/if}
```

### `extend(dictionaries)`

Adds translations on top of the base dictionaries and reloads the active locale. Returns a `Promise` of the instance. If loading fails, the extension is not added and the promise rejects. See [Route-level translations](/docs/extend).

```ts
await i18n.extend({
	en: { 'Export': 'Export' },
	nl: async () => (await import('./locales/nl.json')).default
});
```

### Getters

| Getter | Value |
|---|---|
| `locale` | Active locale (same as `getLocale()`). |
| `locales` | Supported locales (same as `getLocales()`). |
| `dictionary` | The active dictionary object. |
| `dictionaries` | The `dictionaries` option. |
| `loading` | `{ current: boolean }`. Prefer `getLoading()`. |

Getters are read-only and lose reactivity when destructured. Use the `get...()` functions in components.

## Types

### `I18nInstance`

The type of a resolved instance. In your app, use the inferred type instead so you keep your keys:

```ts
export type I18n = Awaited<ReturnType<typeof loadI18n>>;
```

### `CreateI18nOptions`

The type of the `createI18n` options object.

## `I18nContext` and `I18N_CONTEXT_KEY`

`I18nContext` is a component that puts an instance in Svelte context under `I18N_CONTEXT_KEY`. It isn't typed for your dictionaries, so use the `createContext` setup from [Getting started](/docs/getting-started) instead.

## `createI18nHandle(options)`

```ts title="src/hooks.server.ts"
import { createI18nHandle } from '@svelte-i18n/core/server';

export const handle = createI18nHandle({ locales: ['en', 'nl'], fallbackLocale: 'en' });
```

A SvelteKit `handle` hook that replaces `%lang%` in `src/app.html` with the locale of the request, so the server-rendered `<html lang>` is correct. It works with SvelteKit 2 and 3, and with `sequence()`.

| Option | Type | Default | Description |
|---|---|---|---|
| `locales` | `readonly string[]` | required | The supported locales. |
| `fallbackLocale` | `string` | first of `locales` | Used when the detected locale is not supported. |
| `cookieName` | `string` | `'lang'` | Cookie to read the locale from. |
| `locale` | `(event) => string \| null \| undefined` | reads `cookieName` | Your own detection, for example from `Accept-Language`. |
| `placeholder` | `string` | `'%lang%'` | The text in `app.html` to replace. |

The detected value is matched like in `createI18n`: `nl-BE` becomes `nl`, and anything else becomes `fallbackLocale`. Only a supported locale is ever written into the HTML.

## Vite plugin

```ts
import { i18n } from '@svelte-i18n/core/vite';

i18n({ output: 'src/lib/i18n-types.d.ts', fetch: true });
```

Generates an `I18nDictionary` type with every key from your `createI18n` and `extend` dictionaries. See [Type safety](/docs/type-safety#vite-plugin-recommended).

## CLI

```bash
npx @svelte-i18n/cli generate-types --input <file-or-url> [--output ./i18n-types.d.ts]
```

Reads one flat JSON dictionary (a file path or a URL) and writes an `I18nDictionary` type with all its keys. Requires Node.js 22 or newer. See [Type safety](/docs/type-safety#remote-dictionaries).
