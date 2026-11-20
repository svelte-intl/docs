# @svelte-i18n/docs

Source of [svelte-i18n.com](https://svelte-i18n.com), the documentation for [`@svelte-i18n/core`](https://www.npmjs.com/package/@svelte-i18n/core).

SvelteKit 3 + `adapter-static`. Every page is prerendered to plain HTML.

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # static site in ./build
pnpm check    # type-check
```

## Writing docs

- Pages live in `src/content/docs/<slug>.md`. `index.md` is `/docs`.
- Frontmatter: `title` (H1 and sidebar), `description` (meta description, ~150 chars), optional `seoTitle` (the `<title>`).
- Add the slug to `NAV` in `src/lib/site.ts`. The build fails if a page is missing from the navigation, or the navigation points to a missing page.
- Code blocks: ` ```ts title="src/lib/i18n.ts" ` shows a file name. Prefer complete files over fragments.
- Callouts: `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`.
- Examples target SvelteKit 3 (`#lib/....ts` imports, `Handle` from `@sveltejs/kit/hooks`).

## Generated for search engines and LLMs

| URL | Source |
|---|---|
| `/sitemap.xml`, `/robots.txt` | `src/routes/sitemap.xml`, `src/routes/robots.txt` |
| `/llms.txt`, `/llms-full.txt` | `src/lib/server/llms.ts` |
| `/docs/<slug>.md` | Raw Markdown of every page |

Old URLs are redirected in `nginx.conf`.
