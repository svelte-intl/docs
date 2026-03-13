import { createI18n } from '@svelte-i18n/core'
import en from '$lib/locales/en.json' with { type: 'json' }

export const { i18n, useI18n } = await createI18n({
    locales: ['en'],
    locale: 'en',
    dictionaries: {
        en,
    },
});