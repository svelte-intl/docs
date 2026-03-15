---
title: Getting Started
description: A quick guide to get started with svelte-i18n
section: Overview
---

<script>
	import { Callout, Tabs, TabItem, Steps, Step, CardGrid, Card } from "@svecodocs/kit";
    import CaretRightIcon from "phosphor-svelte/lib/CaretRightIcon";
</script>

The following guide will walk you through the process of getting svelte-i18n up and running.

## Configuration
<Steps>

<Step>Install the package</Step>

You can install the project via `npm` or `pnpm`.
```bash
npm install @svelte-i18n/core # pnpm add @svelte-i18n/core
```

<Step>+layout.ts</Step>

Edit the `+layout.ts` file or create it if it doesn't exist.

```ts title="src/routes/+layout.ts"
import { createI18n } from '@svelte-i18n/core';

export const load = async ({ data }) => {
	const i18n = await createI18n({
		locales: ['en', 'nl'],
		locale: 'en',
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