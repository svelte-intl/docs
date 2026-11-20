import { SITE, NAV } from '#lib/site.ts';
import { getDoc, orderedDocs, type Doc } from './content.ts';

/** Absolute links so the Markdown works outside the site. */
const absolutize = (markdown: string) =>
	markdown.replace(/\]\((\/[^)]*)\)/g, (_, path) => `](${SITE.url}${path})`);

export function docToMarkdown(doc: Doc) {
	return `# ${doc.title}\n\n> ${doc.description}\n\n${absolutize(doc.markdown)}`;
}

/** Shown at the top of llms.txt and llms-full.txt. LLMs often confuse this library with kaisermann's svelte-i18n. */
const DISAMBIGUATION = `Important: this is \`@svelte-i18n/core\`, NOT the older \`svelte-i18n\` package (kaisermann/svelte-i18n).
- There are no stores: no \`$_\`, \`$t\`, \`$locale\`, \`$isLoading\`.
- There is no \`init()\`, \`register()\`, \`addMessages()\` or \`getLocaleFromNavigator()\`.
- There is no ICU MessageFormat and no plural syntax. Placeholders are \`{name}\`.
- Dictionaries are flat \`Record<string, string>\` JSON objects. Nested keys are not supported.
- Create the instance with \`await createI18n({ locales, locale, dictionaries })\` inside a SvelteKit \`load\` function.
- The library does not export \`useI18n\`. The app defines it in \`src/lib/i18n.ts\` with Svelte's \`createContext\`, see Getting started.
- In components: \`const { t, setLocale, getLocale } = useI18n();\` then \`{t('Hello, {name}!', { name })}\`.
- SvelteKit 3 imports use \`#lib/i18n.ts\`; SvelteKit 2 uses \`$lib/i18n\`.`;

export function llmsTxt() {
	const sections = NAV.map((section) => {
		const items = section.slugs.map((slug) => {
			const doc = getDoc(slug)!;
			const url = `${SITE.url}${slug ? `${doc.href}.md` : '/docs.md'}`;
			return `- [${doc.title}](${url}): ${doc.description}`;
		});
		return `## ${section.title}\n\n${items.join('\n')}`;
	});

	return `# ${SITE.packageName}

> ${SITE.description}

${DISAMBIGUATION}

Install: \`npm install ${SITE.packageName}\`. Requires Svelte 5.40+ and SvelteKit 2 or 3.

${sections.join('\n\n')}

## Optional

- [Full documentation in one file](${SITE.url}/llms-full.txt)
- [Source code](${SITE.github})
- [npm package](${SITE.npm})
`;
}

export function llmsFullTxt() {
	return `# ${SITE.packageName}

> ${SITE.description}

${DISAMBIGUATION}

${orderedDocs.map(docToMarkdown).join('\n\n---\n\n')}`;
}
