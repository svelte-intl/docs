<script lang="ts">
	import { page } from '$app/state';
	import Header from '#lib/components/Header.svelte';
</script>

<svelte:head>
	<title>Page not found · svelte-i18n</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Header />
<main>
	<h1>{page.status === 404 ? 'Page not found' : 'Something went wrong'}</h1>
	<p>The page you're looking for doesn't exist or has moved.</p>
	<p><a class="btn btn-primary" href="/docs">Go to the docs</a></p>
</main>

<style>
	main {
		max-width: 640px;
		min-height: 60vh;
		margin: 0 auto;
		padding: 96px 16px;
		text-align: center;
	}
</style>
