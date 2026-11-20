<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { SITE } from '#lib/site.ts';

	let { data } = $props();
	const doc = $derived(data.doc);

	const markdownUrl = $derived(doc.slug ? `${doc.href}.md` : '/docs.md');
	const title = $derived(
		doc.slug ? `${doc.seoTitle} · ${SITE.name}` : `${SITE.name}: ${doc.seoTitle}`
	);

	const jsonLd = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'TechArticle',
			headline: doc.seoTitle,
			description: doc.description,
			url: SITE.url + doc.href,
			inLanguage: 'en',
			author: { '@type': 'Person', name: SITE.author },
			about: { '@type': 'SoftwareSourceCode', name: SITE.packageName, codeRepository: SITE.github }
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Docs', item: `${SITE.url}/docs` },
				...(doc.slug
					? [{ '@type': 'ListItem', position: 2, name: doc.title, item: SITE.url + doc.href }]
					: [])
			]
		}
	]);

	let copied = $state(false);
	async function copyPage() {
		const text = await (await fetch(markdownUrl)).text();
		await navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<Seo {title} description={doc.description} path={doc.href} type="article" {jsonLd} />

<div class="page">
	<main id="content">
		<header>
			<h1>{doc.title}</h1>
			<p class="lead">{doc.description}</p>
			<div class="tools">
				<button type="button" onclick={copyPage}>{copied ? 'Copied' : 'Copy as Markdown'}</button>
				<a href={markdownUrl}>View as Markdown</a>
			</div>
		</header>

		<article class="prose">
			{@html doc.html}
		</article>

		{#if doc.prev || doc.next}
			<nav class="pager" aria-label="Previous and next page">
				{#if doc.prev}
					<a class="prev" href={doc.prev.href}><span>Previous</span>{doc.prev.title}</a>
				{/if}
				{#if doc.next}
					<a class="next" href={doc.next.href}><span>Next</span>{doc.next.title}</a>
				{/if}
			</nav>
		{/if}
	</main>

	{#if doc.toc.length > 1}
		<aside class="toc" aria-label="On this page">
			<p>On this page</p>
			<ul>
				{#each doc.toc as item}
					<li class:sub={item.depth === 3}><a href="#{item.id}">{item.text}</a></li>
				{/each}
			</ul>
		</aside>
	{/if}
</div>

<style>
	.page {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 220px;
		gap: 48px;
		padding: 40px 48px 80px;
	}
	main {
		max-width: 760px;
		min-width: 0;
	}
	h1 {
		margin: 0 0 8px;
		font-size: 2.25rem;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}
	.lead {
		margin: 0;
		color: var(--text-muted);
		font-size: 1.1rem;
	}
	.tools {
		display: flex;
		gap: 16px;
		margin: 16px 0 32px;
		font-size: 13px;
	}
	.tools button,
	.tools a {
		padding: 0;
		border: 0;
		background: none;
		color: var(--text-muted);
		font: inherit;
		cursor: pointer;
	}
	.tools button:hover,
	.tools a:hover {
		color: var(--text);
		text-decoration: underline;
	}
	.pager {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		margin-top: 64px;
	}
	.pager a {
		display: flex;
		flex-direction: column;
		padding: 14px 18px;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		color: var(--text);
		font-weight: 600;
	}
	.pager a:hover {
		border-color: var(--brand);
		text-decoration: none;
	}
	.pager span {
		color: var(--text-muted);
		font-size: 13px;
		font-weight: 400;
	}
	.next {
		grid-column: 2;
		text-align: right;
	}
	.toc {
		position: sticky;
		top: calc(var(--header-h) + 40px);
		align-self: start;
		font-size: 14px;
	}
	.toc p {
		margin: 0 0 8px;
		font-weight: 600;
	}
	.toc ul {
		margin: 0;
		padding: 0;
		list-style: none;
		border-left: 1px solid var(--border);
	}
	.toc li a {
		display: block;
		padding: 4px 0 4px 14px;
		color: var(--text-muted);
	}
	.toc li.sub a {
		padding-left: 26px;
	}
	.toc li a:hover {
		color: var(--text);
		text-decoration: none;
	}

	@media (max-width: 1200px) {
		.page {
			grid-template-columns: minmax(0, 1fr);
		}
		.toc {
			display: none;
		}
	}
	@media (max-width: 640px) {
		.page {
			padding: 28px 16px 64px;
		}
		h1 {
			font-size: 1.85rem;
		}
		.pager {
			grid-template-columns: 1fr;
		}
		.next {
			grid-column: 1;
		}
	}
</style>
