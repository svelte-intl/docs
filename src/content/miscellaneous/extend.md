---
title: Extend dictionaries
description: Add translations at runtime with extend
section: Miscellaneous
---

<script>
    import { Callout, Steps, Step } from "@svecodocs/kit";
</script>

Use `extend` when a part of your app needs translations that are not part of the base dictionary passed to `createI18n`. Typical cases:

- **Route-specific messages** — load extra keys only for a page or layout
- **Lazy-loaded JSON** — import locale files on demand
- **Remote dictionaries** — fetch translations from an API

The base dictionary from `createI18n` stays unchanged; `extend` layers additional messages on top.

## Basic usage

`extend` is available on the i18n instance returned from `createI18n` (or via `useI18n()` in components).

```ts
const i18n = await createI18n({
	locales: ['en', 'nl'],
	locale: 'en',
	dictionaries: {
		en: async () => (await import('$lib/locales/en.json')).default,
		nl: async () => (await import('$lib/locales/nl.json')).default
	}
});

await i18n.extend({
	en: {
		'Welcome to the dashboard': 'Welcome to the dashboard'
	},
	nl: {
		'Welcome to the dashboard': 'Welkom op het dashboard'
	}
});

i18n.t('Welcome to the dashboard');
// → "Welcome to the dashboard"
```

Each locale value can be a plain object or an async loader:

```ts
await i18n.extend({
	nl: async () => {
		const response = await fetch('/api/translations/nl');
		return response.json();
	}
});
```

## Use in a SvelteKit load function

For SSR, call `extend` in a `+page.ts` or `+layout.ts` load function and **await** it so translations are available before the page renders.

```ts title="src/routes/docs/+page.ts"
export const load = async ({ parent }) => {
	const { i18n } = await parent();

	await i18n.extend({
		en: async () => (await import('./locales/en.json')).default,
		nl: async () => (await import('./locales/nl.json')).default
	});
};
```

```svelte title="src/routes/docs/+page.svelte"
<script lang="ts">
	import { useI18n } from '$lib/i18n';

	const { t } = useI18n();
</script>

<h1>{t('Documentation')}</h1>
```

<Callout type="warning">

Always `await i18n.extend(...)` in load functions. Without `await`, the page may render once with missing keys (falling back to the key string) before the dictionary is updated.

</Callout>

## Merge behaviour

`extend` merges messages into the active dictionary for each locale:

| Situation | Result |
|-----------|--------|
| New key in extension | Key is added |
| Key exists in base dictionary | Extension value wins |
| Multiple `extend` calls | All layers are accumulated |
| Same key in two `extend` calls | The later call wins |

```ts
await i18n.extend({ en: { title: 'Hello' } });
await i18n.extend({ en: { subtitle: 'Getting started' } });
await i18n.extend({ en: { title: 'Hello again' } });

i18n.t('title');    // → "Hello again"
i18n.t('subtitle'); // → "Getting started"
```

When the user switches locale with `setLocale`, the base dictionary and all extension layers for the new locale are loaded together.

## Method chaining

`extend` returns a promise that resolves to the i18n instance:

```ts
await i18n
	.extend({ en: { 'Step 1': 'Step 1' } })
	.extend({ en: { 'Step 2': 'Step 2' } });
```

## `extend` vs `createI18n` dictionaries

| | `createI18n({ dictionaries })` | `extend()` |
|---|-------------------------------|------------|
| When | App / layout setup | Runtime, per route or feature |
| Scope | Global for the i18n instance | Layered on top of base dictionaries |
| SSR | Loaded in `+layout.ts` | Loaded where you call `extend` |
| Type generation | Picked up by the Vite plugin | Static `extend` calls are also analysed |

Put shared messages in `createI18n`. Use `extend` for messages that belong to a specific route, feature, or dynamically loaded source.

## In a component

You can call `extend` from a component, but prefer load functions for SSR.

```svelte
<script lang="ts">
	import { useI18n } from '$lib/i18n';

	const { t, extend } = useI18n();

	await extend({
		en: { 'Loaded in component': 'Loaded in component' }
	});
</script>

<p>{t('Loaded in component')}</p>
```

<Callout type="note">

In components, `await` in `<script>` works during SSR and on navigation. For client-only extensions (e.g. after a user action), call `await extend(...)` inside an event handler.

</Callout>
