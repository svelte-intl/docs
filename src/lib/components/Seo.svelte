<script lang="ts">
	import { SITE } from '#lib/site.ts';

	type Props = {
		/** Full document title. */
		title: string;
		description: string;
		/** Path without trailing slash, e.g. `/docs/api`. */
		path: string;
		type?: 'website' | 'article';
		jsonLd?: Record<string, unknown>[];
	};

	let { title, description, path, type = 'website', jsonLd = [] }: Props = $props();

	const canonical = $derived(SITE.url + path);
	const image = SITE.url + SITE.ogImage;

	// Escape `<` so the JSON can't close the script tag.
	const ld = $derived(
		jsonLd.map((data) => JSON.stringify(data).replace(/</g, '\\u003c'))
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<link rel="alternate" type="text/plain" title="LLM-friendly docs" href="{SITE.url}/llms.txt" />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE.name} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="{SITE.name}: {SITE.tagline}" />
	<meta property="og:locale" content="en_US" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	{#each ld as json}
		{@html `<script type="application/ld+json">${json}</script>`}
	{/each}
</svelte:head>
