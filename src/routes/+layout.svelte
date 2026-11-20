<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { SITE } from '#lib/site.ts';

	let { children } = $props();

	// One listener for every "Copy" button rendered from Markdown.
	onMount(() => {
		const onclick = async (event: MouseEvent) => {
			const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-code]');
			if (!button) return;
			try {
				await navigator.clipboard.writeText(button.dataset.code ?? '');
				button.textContent = 'Copied';
				button.dataset.copied = '';
				setTimeout(() => {
					button.textContent = 'Copy';
					delete button.dataset.copied;
				}, 1500);
			} catch {
				button.textContent = 'Press Ctrl+C';
			}
		};
		document.addEventListener('click', onclick);
		return () => document.removeEventListener('click', onclick);
	});
</script>

{@render children()}

<footer>
	<p>
		Released under the <a href="{SITE.github}/blob/main/LICENSE.md" rel="noopener">MIT License</a>.
		Made by {SITE.author}.
		<a href="{SITE.github}" rel="noopener">GitHub</a> ·
		<a href="{SITE.npm}" rel="noopener">npm</a> ·
		<a href="/llms.txt">llms.txt</a>
	</p>
</footer>

<style>
	footer {
		border-top: 1px solid var(--border);
		padding: 24px 16px;
		color: var(--text-muted);
		font-size: 14px;
		text-align: center;
	}
	footer p {
		margin: 0;
	}
</style>
