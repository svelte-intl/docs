<script lang="ts">
	import { siteConfig } from "$lib/site-config";
    import { I18nContext } from "@svelte-i18n/core";
    import { i18n } from "$lib/i18n";
	import { useSiteConfig } from "@svecodocs/kit";

    import SvecosystemDark from "$lib/components/logos/svecosystem-dark.svelte";
	import SvecosystemLight from "$lib/components/logos/svecosystem-light.svelte";
	import { DocsLayout } from "@svecodocs/kit";
	import { navigation } from "$lib/navigation";
    
	import "../app.css";

	let { children } = $props();

	useSiteConfig(() => siteConfig);
</script>

<I18nContext {i18n}>
    <DocsLayout {navigation}>
        {#snippet logo()}
            <SvecosystemDark class="hidden max-h-6 dark:block" />
            <SvecosystemLight class="block max-h-6 dark:hidden" />
            <span class="sr-only">svelte-i18n</span>
        {/snippet}
        {@render children?.()}
    </DocsLayout>
</I18nContext>
