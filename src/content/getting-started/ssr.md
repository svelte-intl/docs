---
title: Getting Started (SSR)
description: A quick guide to get started with svelte-i18n in SSR
section: Overview
---

<script>
	import { Callout, Tabs, TabItem, Steps, Step, CardGrid, Card } from "@svecodocs/kit";
    import CaretRightIcon from "phosphor-svelte/lib/CaretRightIcon";

    let setupType = $state('ssr');
    $inspect(setupType)
</script>

The following guide will walk you through the process of getting svelte-i18n up and running in a SSR context.

## Configuration
<Steps>

<Step>Install the package</Step>

You can install the project via `npm` or `pnpm`.
```bash
npm install @svelte-i18n/core # pnpm add @svelte-i18n/core
```

<Step>+layout.server.ts</Step>

Read the locale cookie so the user's language preference is restored on each request.

```ts title="src/routes/+layout.server.ts"
export const load = async ({ cookies }) => {
	const locale = cookies.get('lang');

	return {
		locale: locale ?? 'en'
	};
};
```

<Step>+layout.ts</Step>

Create the i18n instance in your layout load function and pass `data.locale` from the server.

```ts title="src/routes/+layout.ts"
import { createI18n } from '@svelte-i18n/core';

export const load = async ({ data }) => {
	const i18n = await createI18n({
		locales: ['en', 'nl'],
		locale: data.locale,
		fallbackLocale: 'en',
		dictionaries: {
			en: async () => (await import('$lib/locales/en.json')).default,
			nl: async () => (await import('$lib/locales/nl.json')).default
		}
	});

	return { i18n };
};
```

<Step>app.html and hooks.server.ts</Step>

Set the HTML `lang` attribute for the initial server render:

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

<Callout type="note">

`setLocale` writes the locale to a cookie (`lang` by default) and updates `document.documentElement.lang` on the client. Use the same cookie name in `+layout.server.ts` and `hooks.server.ts`. Override it with `cookieName` in `createI18n` if needed.

</Callout>

<Step>Edit +layout.svelte</Step>

To make svelte-i18n SSR safe we need to set the context using the [context API](https://svelte.dev/docs/svelte/context).
There are two methods to do this.

<Tabs value="Using provider" items={["Using provider", "Manually"]}>
<TabItem value="Using provider">

```svelte title="src/routes/+layout.svelte"
<script lang="ts">
    import { I18nContext } from '@svelte-i18n/core';
    import type { LayoutProps } from './$types';

    let { children, data }: LayoutProps = $props();
</script>

<I18nContext i18n={data.i18n}>
    {@render children?.()}
</I18nContext>
```

</TabItem>
<TabItem value="Manually">

```svelte title="src/routes/+layout.svelte"
<script lang="ts">
    import { I18N_CONTEXT_KEY } from '@svelte-i18n/core';
	import { setContext } from 'svelte';
    import type { LayoutProps } from './$types';

    let { children, data }: LayoutProps = $props();
	setContext(I18N_CONTEXT_KEY, data.i18n);
</script>

{@render children?.()}
```

</TabItem>
</Tabs>



<Step>🎉 finished, you have setup svelte-i18n</Step>

```svelte title="src/routes/+page.svelte"
<script lang="ts">
    import { useI18n } from '$lib/i18n';

    // ...
    let user = $state('Richard');
    let { t } = useI18n();
</script>

{t("Welcome, {user}", { user })}
<!-- Welcome, Richard -->
```

</Steps>
