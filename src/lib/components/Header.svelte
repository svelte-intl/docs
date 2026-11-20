<script lang="ts">
	import { page } from '$app/state';
	import { SITE } from '#lib/site.ts';
	import ThemeToggle from './ThemeToggle.svelte';

	let { onmenu }: { onmenu?: () => void } = $props();

	const links = [
		{ href: '/docs', label: 'Docs', match: (p: string) => p.startsWith('/docs') && p !== '/docs/api' },
		{ href: '/docs/api', label: 'API', match: (p: string) => p === '/docs/api' }
	];
</script>

<header>
	<div class="inner">
		{#if onmenu}
			<button class="icon-btn menu" type="button" onclick={onmenu} aria-label="Open navigation">
				<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
			</button>
		{/if}

		<a class="logo" href="/" aria-label="{SITE.name} home">
			<img class="logo-light" src="/logo-light.svg" alt="" width="139" height="30" />
			<img class="logo-dark" src="/logo-dark.svg" alt="" width="139" height="30" />
		</a>

		<nav aria-label="Main">
			{#each links as link}
				<a href={link.href} aria-current={link.match(page.url.pathname) ? 'page' : undefined}>{link.label}</a>
			{/each}
		</nav>

		<div class="actions">
			<a class="icon-btn" href={SITE.github} aria-label="GitHub repository" title="GitHub" rel="noopener" target="_blank">
				<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
			</a>
			<ThemeToggle />
		</div>
	</div>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 20;
		height: var(--header-h);
		border-bottom: 1px solid var(--border);
		background: color-mix(in srgb, var(--bg) 85%, transparent);
		backdrop-filter: blur(10px);
	}
	.inner {
		display: flex;
		align-items: center;
		gap: 24px;
		height: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 24px;
	}
	.logo {
		display: flex;
		flex-shrink: 0;
	}
	.logo img {
		height: 30px;
		width: auto;
	}
	.logo-dark {
		display: none;
	}
	:global(:root[data-theme='dark']) .logo-light {
		display: none;
	}
	:global(:root[data-theme='dark']) .logo-dark {
		display: block;
	}
	@media (prefers-color-scheme: dark) {
		:global(:root:not([data-theme='light'])) .logo-light {
			display: none;
		}
		:global(:root:not([data-theme='light'])) .logo-dark {
			display: block;
		}
	}
	nav {
		display: flex;
		gap: 20px;
	}
	nav a {
		color: var(--text-muted);
		font-weight: 500;
		font-size: 15px;
	}
	nav a:hover,
	nav a[aria-current='page'] {
		color: var(--text);
		text-decoration: none;
	}
	.actions {
		display: flex;
		gap: 4px;
		margin-left: auto;
	}
	.menu {
		display: none;
	}
	:global(.icon-btn) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
	}
	:global(.icon-btn:hover) {
		background: var(--bg-soft);
		color: var(--text);
	}
	@media (max-width: 900px) {
		.menu {
			display: inline-flex;
			margin-left: -8px;
		}
	}
	@media (max-width: 560px) {
		.inner {
			gap: 12px;
			padding: 0 16px;
		}
		nav {
			display: none;
		}
	}
</style>
