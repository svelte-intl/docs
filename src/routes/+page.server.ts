import { highlight } from '#lib/server/markdown.ts';

const dictionary = `{
	"Hello, {name}!": "Hallo, {name}!",
	"{count} new messages": "{count} nieuwe berichten"
}`;

const component = `<script lang="ts">
	import { useI18n } from '#lib/i18n.ts';

	const { t, setLocale } = useI18n();
</script>

<h1>{t('Hello, {name}!', { name: 'Richard' })}</h1>
<p>{t('{count} new messages', { count: 3 })}</p>

<button onclick={() => setLocale('nl')}>Nederlands</button>`;

export const load = async () => ({
	code: {
		dictionary: await highlight(dictionary, 'json'),
		component: await highlight(component, 'svelte')
	}
});
