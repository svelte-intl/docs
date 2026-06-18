---
title: Introduction
description: Why another i18n library?
section: Overview
---

<script>
	import { Callout, Button } from '@svecodocs/kit';
    import CaretRightIcon from "phosphor-svelte/lib/CaretRightIcon";
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

Svelte-i18n is SSR safe by default, since we are using the [context API](https://svelte.dev/docs/svelte/context). When users switch language, `setLocale` persists the locale in a cookie (`lang` by default) and updates the HTML `lang` attribute on the client.

## What this is not

svelte-i18n is not intended to replace feature-rich libraries like Wuchale, inlang or Paraglide.js. Those solutions offer advanced capabilities for complex translation needs, such as deeply nested keys or managing large volumes of strings. Instead, svelte-i18n is designed for projects that require straightforward, key-value translations without extensive configuration or overhead.

<div class="mt-8 flex justify-end">
    <Button variant="link">
        Getting started
        <CaretRightIcon/>
    </Button>
</div>
