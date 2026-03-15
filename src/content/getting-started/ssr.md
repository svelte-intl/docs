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

<Step>Create i18n.ts</Step>

Create a new file called `i18n.ts` inside `src/lib` to initialize `svelte-i18n`.

```ts title="src/lib/i18n.ts"
import { createI18n } from '$lib/i18n';
import nl from './locales/nl.json';
import en from './locales/en.json';

// In this example we load the dictionaries using an import
// But its also possible to load the dictionary from a async resource
export const { i18n, useI18n } = await createI18n({
    locales: ['nl', 'en'],
    locale: 'en',
    dictionaries: {
        nl,
        en
    }
});
```

<Step>Edit +layout.svelte</Step>

To make svelte-i18n SSR safe we need to set the context using the [context API](https://svelte.dev/docs/svelte/context).
There are two methods to do this.

<Tabs value="Using provider" items={["Using provider", "Manually"]}>
<TabItem value="Using provider">

```svelte title="src/routes/+layout.svelte"
<script lang="ts">
    import { I18nContext } from '@svelte-i18n/core';
    import { i18n } from '$lib/i18n';

    let { children } = $props();
</script>

<I18nContext {i18n}>
    {@render children?.()}
</I18nContext>
```

</TabItem>
<TabItem value="Manually">

```svelte title="src/routes/+layout.svelte"
<script lang="ts">
    import { I18N_CONTEXT_KEY } from '@svelte-i18n/core';
	import { setContext } from 'svelte';
	import { i18n } from '$lib/i18n';

    let { children } = $props();
	setContext(I18N_CONTEXT_KEY, i18n);
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