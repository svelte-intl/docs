<script lang="ts">
	import { siteConfig } from "$lib/site-config";
    import { I18nContext } from "@svelte-i18n/core";
    import { i18n } from "$lib/i18n";
	import { useSiteConfig } from "@svecodocs/kit";
    
	import "../app.css";

	let { children } = $props();

	useSiteConfig(() => siteConfig);
</script>

<I18nContext {i18n}>
    {@render children?.()}
</I18nContext>
