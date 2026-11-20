---
title: Route-level translations
seoTitle: Load translations per route with extend
description: Use extend() in @svelte-i18n/core to add translations for a single SvelteKit page or layout, from lazy-loaded JSON or an API, without growing your global dictionary.
---

Not every translation belongs in the global dictionary. With `extend` you add messages for one page or section, loaded only when that route is visited.

## In a load function

Call `extend` in the route's `+page.ts` or `+layout.ts` and **await** it, so the translations are there before the page renders on the server:

```ts title="src/routes/dashboard/+page.ts"
export const load = async ({ parent }) => {
	const { i18n } = await parent();

	await i18n.extend({
		en: async () => (await import('./locales/en.json')).default,
		nl: async () => (await import('./locales/nl.json')).default
	});
};
```

```json title="src/routes/dashboard/locales/en.json"
{
	"Welcome to your dashboard": "Welcome to your dashboard"
}
```

```json title="src/routes/dashboard/locales/nl.json"
{
	"Welcome to your dashboard": "Welkom op je dashboard"
}
```

```svelte title="src/routes/dashboard/+page.svelte"
<script lang="ts">
	import { useI18n } from '#lib/i18n.ts';

	const { t } = useI18n();
</script>

<h1>{t('Welcome to your dashboard')}</h1>
```

> [!WARNING]
> Always `await i18n.extend(...)`. Without it, the page can render once with untranslated keys.

## Values

Each locale is optional and can be an object or a (sync or async) function, just like in `createI18n`:

```ts
await i18n.extend({
	en: { 'Export': 'Export' },
	nl: async () => (await fetch('/api/translations/dashboard/nl')).json()
});
```

Only the active locale is loaded right away. The others are loaded when the user switches.

## Merge rules

| Situation | Result |
|---|---|
| New key | Added |
| Key already in the base dictionary | The extension wins |
| Several `extend` calls | All are kept, in order |
| Same key in two `extend` calls | The later call wins |

`extend` returns a promise of the instance. To add two layers, await them one after the other. Chaining (`i18n.extend(a).extend(b)`) does **not** work:

```ts
await i18n.extend({ en: { title: 'Hello' } });
await i18n.extend({ en: { subtitle: 'Getting started' } });
```

## Things to know

- Extensions are never removed. They stay active after you navigate away from the route.
- Keys added with `extend` are not part of the inferred TypeScript types, so `t` won't autocomplete them.
- Prefer load functions over components. A top-level `await` in a component `<script>` only works with Svelte's experimental async mode.

## When to use what

| | `createI18n({ dictionaries })` | `extend()` |
|---|---|---|
| Where | `src/lib/i18n.ts`, once | `+page.ts` / `+layout.ts` of a route |
| What | Shared UI text: navigation, buttons, errors | Text for one page or feature |
| Types | Keys are inferred | Not inferred |
