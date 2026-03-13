import { defineSiteConfig } from "@svecodocs/kit";

export const siteConfig = defineSiteConfig({
	name: "Svecodocs",
	url: "https://svelte-i18n.com",
	ogImage: {
		url: "https://docs.svelte-i18n.com/og.png",
		height: "630",
		width: "1200",
	},
	description: "The simplest i18n library for Svelte / SvelteKit out there",
	author: "Richard Mauritz",
	keywords: ["svelte-i18n", "svelte-intl", "sveltekit", "svelte", "i18n"],
	license: {
		name: "MIT",
		url: "https://github.com/svelte-intl/core/blob/main/LICENSE",
	},
	links: {
		github: "https://github.com/svelte-intl/core"
	},
});
