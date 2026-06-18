---
title: Getting Started
description: A quick guide to get started with svelte-i18n
section: Overview
---

<script>
	import { Callout, Tabs, TabItem, Steps, Step, CardGrid, Card, Button } from "@svecodocs/kit";
    import CaretRightIcon from "phosphor-svelte/lib/CaretRightIcon";
</script>

<Callout type="warning" title="Type safety">

Parameter types are inferred from the key string, not the translated value. 
Keys like `"Hello, \{username\}!"` are fully type-safe, but opaque keys like 
`"welcome_banner"` won't have typed parameters even if the value contains placeholders.

</Callout>

This library has full TypeScript support, your translation keys are autocompleted when you call `t("Hello, {username}!", { username: 'Richard' })`, 
and if a message contains variables like `{username}`, TypeScript will enforce that you pass the correct arguments.

The following guide will walk you through the process of getting svelte-i18n up and running.

## Configuration
<Steps>

<Step>Install the package</Step>

You can install the project via `npm` or `pnpm`.
```bash
npm install @svelte-i18n/core # pnpm add @svelte-i18n/core
```

<Step>+layout.server.ts</Step>

Read the locale cookie on the server so the user's language preference survives a page refresh.

```ts title="src/routes/+layout.server.ts"
export const load = async ({ cookies }) => {
	const locale = cookies.get('lang');

	return {
		locale: locale ?? 'en'
	};
};
```

<Step>+layout.ts</Step>

```ts title="src/routes/+layout.ts"
import { createI18n } from '@svelte-i18n/core';

export const load = async ({ data }) => {
	const i18n = await createI18n({
		locales: ['en', 'nl'],
		locale: data.locale,
		fallbackLocale: 'en',
		dictionaries: {
            // You can also import them at the top level 
            // instead of a dynamic import
			en: async () => {
				return (await import('$lib/locales/en.json')).default;
			},
			nl: async () => {
				return (await import('$lib/locales/nl.json')).default;
			}
		}
	});

	return {
		i18n
	};
};
```

When the user switches language via `setLocale`, the locale is stored in a cookie named `lang` by default. Override the name with `cookieName` if needed:

```ts
const i18n = await createI18n({
	// ...
	cookieName: 'locale'
});
```

<Step>app.html and hooks.server.ts</Step>

Set the HTML `lang` attribute for SSR by using a placeholder in `app.html` and replacing it in a server hook:

```html title="src/app.html"
<html lang="%lang%">
```

```ts title="src/hooks.server.ts"
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const locale = event.cookies.get('lang');

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', locale ?? 'en')
	});
};
```

On the client, `setLocale` also updates `document.documentElement.lang` when the user switches language.

<Step>Edit +layout.svelte</Step>

Export `I18nContext` so the i18n context type can be shared across the app.
In the next step, we import this type in `i18n.ts` to keep the setup type-safe.

```svelte title="src/routes/layout.svelte"
<script lang="ts" module>
	export type I18nContext = LayoutProps['data']['i18n'];
</script>

<script lang="ts">
	import type { LayoutProps } from './$types.d.ts';

	let { children, data }: LayoutProps = $props();
</script>

{@render children?.()}
```

<Step>Create i18n.ts</Step>

Create a new file called `i18n.ts` inside `src/lib` here we set and export our context. So we can reuse it and keep typesafety.

```ts title="src/lib/i18n.ts"
import type { I18nContext } from '../routes/+layout.svelte';
import { createContext } from 'svelte';

const [getContext, setContext] = createContext<I18nContext>();

export const useI18n = getContext;
export const createI18n = (i18n: () => I18nContext) => 
    setContext(i18n());
```

<Step>Edit +layout.svelte</Step>

```svelte title="src/routes/layout.svelte" {7,10}
<script lang="ts" module>
	export type I18nContext = LayoutProps['data']['i18n'];
</script>

<script lang="ts">
	import type { LayoutProps } from './$types.d.ts';
    import { createI18n } from '$lib/i18n';

	let { children, data }: LayoutProps = $props();
  	createI18n(() => data.i18n);
</script>

{@render children?.()}
```

<Step>🎉 finished, you have setup svelte-i18n</Step>

```svelte title="src/routes/+page.svelte"
<script lang="ts">
    import { useI18n } from '$lib/i18n';

    // ...
    let user = $state('John Doe');
    let { t, getLocale } = useI18n();
</script>

{t('Current language: {locale}', { locale: getLocale() })}
{t("Welcome, {user}", { user })}
```

</Steps>

<Callout type="note" title="Route-specific translations">

Not every message belongs in the root layout dictionary. Use [`extend`](/docs/miscellaneous/extend) in a `+page.ts` or `+layout.ts` load function to add translations for a single route — for example lazy-loaded JSON or keys fetched from an API.

</Callout>