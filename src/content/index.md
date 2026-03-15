---
title: Introduction
description: Why another i18n library?
section: Overview
---

<script>
	import { Callout } from '@svecodocs/kit'
</script>

- **Svelte 5** ✅
- **Runes and not stores** ✅
- **Easy to use** ✅
- **SSR ready** ✅
- **No external dependencies** ✅

## Motivation

Most Svelte-specific i18n libraries are outdated and/or rely on Svelte stores instead of runes.
That approach works, but I did not like the `$_('hello')` syntax and wanted something more future-proof.

Many libraries also require a complicated setup, and in the case of [Wuchale](https://wuchale.dev/), a lot of configuration.
But what if you just need i18n and nothing more? That is exactly why I created svelte-i18n. No deep nesting, just a simple key -> value
translation dictionary

```json en.json
{
    "Hello, {username}!": "Hello, {username}!",
    "welcome_banner": "Welcome to our website"
    ...
}
```

Svelte-i18n is SSR safe by default, since we are using the [context API](https://svelte.dev/docs/svelte/context) 

<Callout type="tip" title="Type safety">

Parameter types are inferred from the key string, not the translated value. 
Keys like `"Hello, \{username\}!"` are fully type-safe, but opaque keys like 
`"welcome_banner"` won't have typed parameters even if the value contains placeholders.

</Callout>

This library has full TypeScript support, your translation keys are autocompleted when you call `t("Hello, {username}!", { username: 'Richard' })`, 
and if a message contains variables like `{username}`, TypeScript will enforce that you pass the correct arguments.

```svelte
<script lang="ts">
    import { useI18n } from '$lib/i18n';

    const { t } = useI18n();
</script>

{t('Hello, {username}!', { username: 'Richard' })}
```
