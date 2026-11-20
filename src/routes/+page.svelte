<script lang="ts">
	import Header from '#lib/components/Header.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { SITE } from '#lib/site.ts';

	let { data } = $props();

	const install = `npm install ${SITE.packageName}`;
	let copied = $state(false);
	async function copyInstall() {
		await navigator.clipboard.writeText(install);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}

	const features = [
		{
			title: 'Runes, not stores',
			text: 'Built for Svelte 5. t() is a plain function. No $_ or $t store syntax.'
		},
		{
			title: 'Type-safe keys',
			text: 'Keys are autocompleted from your JSON files. Placeholders like {name} become required parameters.'
		},
		{
			title: 'SSR-safe',
			text: 'One instance per request through load functions and the context API. Server-rendered in the right language.'
		},
		{
			title: 'Flat JSON',
			text: 'One key, one string. Readable keys you can search for and that translators can edit.'
		},
		{
			title: 'Lazy loading',
			text: 'Only the active language is downloaded. Load per route with extend() or from any API.'
		},
		{
			title: 'Persisted locale',
			text: 'setLocale() stores the choice in a cookie and updates <html lang> for SEO and screen readers.'
		}
	];

	const faq = [
		{
			q: 'Does it work with Svelte 5 and runes?',
			a: 'Yes. The library is written for Svelte 5 and uses runes internally. It needs Svelte 5.40 or newer, because the recommended setup uses createContext.'
		},
		{
			q: 'Does it work with SvelteKit 3?',
			a: 'Yes, with SvelteKit 2 and 3. The docs use the SvelteKit 3 #lib import alias and note the SvelteKit 2 alternative.'
		},
		{
			q: 'Is it the same as the svelte-i18n package?',
			a: 'No. svelte-i18n (by kaisermann) is an older, store-based library with ICU message syntax. @svelte-i18n/core is a separate, runes-based library with a t() function and typed keys.'
		},
		{
			q: 'Does it support plurals and number formatting?',
			a: "There are no built-in plural rules. Use separate keys with the browser's Intl.PluralRules, and Intl.NumberFormat or Intl.DateTimeFormat with the active locale."
		},
		{
			q: 'Can I load translations from an API or CMS?',
			a: 'Yes. A dictionary can be any async function that returns a flat object of strings. Use SvelteKit fetch for SSR, and the CLI to generate types.'
		}
	];

	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: SITE.name,
			url: SITE.url + '/'
		},
		{
			'@context': 'https://schema.org',
			'@type': 'SoftwareSourceCode',
			name: SITE.packageName,
			description: SITE.description,
			url: SITE.url + '/',
			codeRepository: SITE.github,
			programmingLanguage: ['TypeScript', 'Svelte'],
			runtimePlatform: 'Svelte 5, SvelteKit',
			license: 'https://opensource.org/licenses/MIT',
			author: { '@type': 'Person', name: SITE.author }
		}
	];
</script>

<Seo
	title="{SITE.name}: {SITE.tagline}"
	description={SITE.description}
	path="/"
	{jsonLd}
/>

<Header />

<main>
	<section class="hero">
		<p class="eyebrow">For Svelte 5 &amp; SvelteKit</p>
		<h1>Type-safe i18n for <span>Svelte 5</span> and SvelteKit</h1>
		<p class="sub">
			A tiny translation library built on runes. Flat JSON dictionaries, autocompleted keys, SSR-safe
			and set up in five minutes.
		</p>

		<div class="cta">
			<a class="btn btn-primary" href="/docs/getting-started">Get started</a>
			<a class="btn" href="/docs">Why this library?</a>
		</div>

		<button class="install" type="button" onclick={copyInstall} aria-label="Copy install command">
			<code><span aria-hidden="true">$</span> {install}</code>
			<span class="hint">{copied ? 'Copied' : 'Copy'}</span>
		</button>
	</section>

	<section class="demo" aria-label="Example">
		<figure class="code">
			<div class="code-title"><span>src/lib/locales/nl.json</span></div>
			{@html data.code.dictionary}
		</figure>
		<figure class="code">
			<div class="code-title"><span>src/routes/+page.svelte</span></div>
			{@html data.code.component}
		</figure>
	</section>

	<section class="features">
		<h2>Everything you need, nothing you don't</h2>
		<ul>
			{#each features as feature}
				<li>
					<h3>{feature.title}</h3>
					<p>{feature.text}</p>
				</li>
			{/each}
		</ul>
	</section>

	<section class="fit">
		<div>
			<h2>A good fit when</h2>
			<ul>
				<li>you have a few languages and up to a few hundred strings</li>
				<li>you want plain JSON files that anyone can edit</li>
				<li>you want typed keys without a compiler or build step</li>
			</ul>
		</div>
		<div>
			<h2>Look elsewhere when</h2>
			<ul>
				<li>you need localized URLs like <code>/nl/about</code></li>
				<li>you need ICU plurals or nested keys</li>
				<li>you'd rather not write keys at all</li>
			</ul>
			<p><a href="/docs/comparison">Compare Svelte i18n libraries →</a></p>
		</div>
	</section>

	<section class="faq">
		<h2>Frequently asked questions</h2>
		{#each faq as item}
			<details>
				<summary>{item.q}</summary>
				<p>{item.a}</p>
			</details>
		{/each}
	</section>

	<section class="final">
		<h2>Translate your SvelteKit app today</h2>
		<a class="btn btn-primary" href="/docs/getting-started">Read the guide</a>
	</section>
</main>

<style>
	main {
		max-width: 1120px;
		margin: 0 auto;
		padding: 0 24px;
	}
	section {
		padding: 56px 0;
	}
	h2 {
		margin: 0 0 24px;
		font-size: 1.75rem;
		letter-spacing: -0.02em;
		line-height: 1.25;
	}

	.hero {
		padding: 96px 0 48px;
		text-align: center;
	}
	.eyebrow {
		margin: 0 0 16px;
		color: var(--brand-text);
		font-weight: 600;
		font-size: 14px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	h1 {
		max-width: 820px;
		margin: 0 auto;
		font-size: clamp(2.25rem, 6vw, 4rem);
		line-height: 1.05;
		letter-spacing: -0.035em;
	}
	h1 span {
		background: linear-gradient(90deg, var(--brand), var(--brand-2));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.sub {
		max-width: 620px;
		margin: 24px auto 0;
		color: var(--text-muted);
		font-size: 1.2rem;
	}
	.cta {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 12px;
		margin-top: 32px;
	}
	.install {
		display: inline-flex;
		align-items: center;
		gap: 16px;
		max-width: 100%;
		margin-top: 28px;
		padding: 10px 12px 10px 18px;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background: var(--bg-soft);
		color: var(--text);
		cursor: pointer;
	}
	.install code {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.install code span {
		color: var(--text-muted);
		user-select: none;
	}
	.hint {
		padding: 2px 8px;
		border: 1px solid var(--border);
		border-radius: 6px;
		background: var(--bg);
		color: var(--text-muted);
		font-size: 12px;
	}

	.demo {
		display: grid;
		grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
		gap: 20px;
		align-items: start;
		padding-top: 24px;
	}
	.demo figure {
		margin: 0;
	}
	.demo :global(pre) {
		margin: 0;
		padding: 16px 18px;
		overflow-x: auto;
		line-height: 1.6;
		tab-size: 2;
	}

	.features ul {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.features li {
		padding: 22px;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background: var(--bg-soft);
	}
	.features h3 {
		margin: 0 0 6px;
		font-size: 1.05rem;
	}
	.features p {
		margin: 0;
		color: var(--text-muted);
		font-size: 15px;
	}

	.fit {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 48px;
	}
	.fit h2 {
		font-size: 1.35rem;
		margin-bottom: 12px;
	}
	.fit ul {
		margin: 0;
		padding-left: 20px;
		color: var(--text-muted);
	}
	.fit li {
		margin: 6px 0;
	}
	.fit code {
		font-size: 0.85em;
	}

	.faq {
		max-width: 760px;
	}
	details {
		border-bottom: 1px solid var(--border);
	}
	summary {
		padding: 16px 0;
		font-weight: 600;
		cursor: pointer;
	}
	details p {
		margin: 0 0 16px;
		color: var(--text-muted);
	}

	.final {
		padding-bottom: 96px;
		text-align: center;
	}

	@media (max-width: 900px) {
		.demo,
		.fit {
			grid-template-columns: minmax(0, 1fr);
		}
		.features ul {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 560px) {
		main {
			padding: 0 16px;
		}
		.hero {
			padding-top: 56px;
		}
		.features ul {
			grid-template-columns: minmax(0, 1fr);
		}
		.fit {
			gap: 24px;
		}
	}
</style>
