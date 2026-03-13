---
title: Load dictionary async
description: Learn how to load dictionaries using a async callback
section: Miscellaneous
---

## Load dictionaries from resource

You can load dictionaries using an (async) callback. This makes it possible to load dictionaries from a database or URL

```ts title="src/lib/i18n.ts"
export const { i18n, useI18n } = await createI18n({
    // ...
    dictionaries: {
        // To get typescript autocompletion replace 
        // Record<string, string> with correct typings
        nl: async (): Promise<Record<string, string>> => {
            try {
                const request = await fetch('https://example.com/locales/nl');
                const json = await response.json();

                return json;
            } catch(err) {
                console.error(err)
                return {};
            }
		},
        // ...
    }
});
```
