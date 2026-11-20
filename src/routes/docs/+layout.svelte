<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import Header from '#lib/components/Header.svelte';

	let { children, data } = $props();

	let open = $state(false);
	afterNavigate(() => (open = false));
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (open = false)} />

<Header onmenu={() => (open = true)} />

<div class="shell">
	<aside class:open aria-label="Documentation">
		<nav>
			{#each data.navigation as section}
				<p class="section">{section.title}</p>
				<ul>
					{#each section.items as item}
						<li>
							<a href={item.href} aria-current={page.url.pathname === item.href ? 'page' : undefined}>
								{item.title}
							</a>
						</li>
					{/each}
				</ul>
			{/each}
		</nav>
	</aside>

	{#if open}
		<button class="backdrop" type="button" aria-label="Close navigation" onclick={() => (open = false)}></button>
	{/if}

	{@render children()}
</div>

<style>
	.shell {
		display: grid;
		grid-template-columns: 250px minmax(0, 1fr);
		max-width: 1400px;
		margin: 0 auto;
	}
	aside {
		position: sticky;
		top: var(--header-h);
		height: calc(100vh - var(--header-h));
		overflow-y: auto;
		padding: 28px 16px 28px 24px;
		border-right: 1px solid var(--border);
	}
	.section {
		margin: 20px 0 6px;
		padding: 0 10px;
		color: var(--text);
		font-size: 13px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.section:first-child {
		margin-top: 0;
	}
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li a {
		display: block;
		padding: 6px 10px;
		border-radius: 6px;
		color: var(--text-muted);
		font-size: 15px;
	}
	li a:hover {
		background: var(--bg-soft);
		color: var(--text);
		text-decoration: none;
	}
	li a[aria-current='page'] {
		background: color-mix(in srgb, var(--brand) 10%, transparent);
		color: var(--brand-text);
		font-weight: 600;
	}
	.backdrop {
		display: none;
	}

	@media (max-width: 900px) {
		.shell {
			grid-template-columns: minmax(0, 1fr);
		}
		aside {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 40;
			width: min(300px, 85vw);
			height: 100vh;
			background: var(--bg);
			transform: translateX(-100%);
			transition: transform 0.2s ease;
		}
		aside.open {
			transform: none;
			box-shadow: 0 0 40px rgb(0 0 0 / 0.2);
		}
		.backdrop {
			display: block;
			position: fixed;
			inset: 0;
			z-index: 30;
			border: 0;
			background: rgb(0 0 0 / 0.4);
		}
	}
</style>
