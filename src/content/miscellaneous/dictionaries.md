---
title: Dictionaries
description: Learn what a dictionary is
section: Miscellaneous
---

<script>
	import { Callout, Tabs, TabItem, Steps, Step } from "@svecodocs/kit";
</script>

## Dictionaries

<Callout type="note" title="What is a dictionary?">
A book or electronic resource that lists the words of a language (typically in alphabetical order) and gives their meaning
</Callout>

In `svelte-i18n`, a dictionary is a flat JSON object containing key-value pairs,
where each key represents a phrase or identifier and its value is the translated string.
Nesting is not supported — the `Dictionary` type is strictly `Record<string, string>`, so all keys and values must be plain strings at the top level.
If your project requires nested structures, consider using a different library.

The structure shown below illustrates how your JSON object should be formatted.


<Tabs value="en.json" items={['en.json', 'nl.json', 'ar.json']}>
<TabItem value="en.json">

```json title="src/lib/locales/en.json"
{
    "Welcome, {username}!": "Welcome, {username}!",
    "Subscribe": "Subscribe",
    "Your account has a balance of {count} USD": "Your account has a balance of {count} USD",
    "You have used {count} out of {total} credits": "You have used {count} out of {total} credits",
    // ...
}
```

</TabItem>
<TabItem value="nl.json">

```json title="src/lib/locales/nl.json"
{
    "Welcome, {username}!": "Hoi, {username}!",
    "Subscribe": "Abonneren",
    "Your account has a balance of {count} USD": "Je account heeft een saldo van {count} USD",
    "You have used {count} out of {total} credits": "Je hebt {count} van de {total} credits gebruikt",
    // ...
}
```

</TabItem>
<TabItem value="ar.json">

```json title="src/lib/locales/ar.json"
{
    "Welcome, {username}!": "مرحبًا، {username}!",
    "Subscribe": "اشترك",
    "Your account has a balance of {count} USD": "حسابك يحتوي على رصيد قدره {count} دولار أمريكي",
    "You have used {count} out of {total} credits": "لقد استخدمت {count} من أصل {total} رصيد",
    // ...
}
```

</TabItem>
</Tabs>

<Callout type="tip" title="You probably don't need nesting">
Most projects that use deeply nested keys like 'banner.heading.title' do so out of habit rather than necessity. 
A flat key like "Welcome to our website" is much better readable, easier to search for, and avoids the overhead of traversing nested objects.
</Callout>