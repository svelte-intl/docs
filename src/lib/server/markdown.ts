import { Marked, type Tokens } from 'marked';
import { createHighlighter, type Highlighter } from 'shiki';

export type TocItem = { depth: 2 | 3; id: string; text: string };

const LANGS = ['ts', 'js', 'svelte', 'json', 'jsonc', 'html', 'bash', 'diff', 'text'] as const;

let highlighter: Promise<Highlighter> | undefined;
function getHighlighter() {
	highlighter ??= createHighlighter({
		themes: ['github-light', 'github-dark'],
		langs: [...LANGS]
	});
	return highlighter;
}

const escapeHtml = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const decodeEntities = (s: string) =>
	s
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, '&');

export const slugify = (s: string) =>
	s
		.toLowerCase()
		.replace(/<[^>]+>/g, '')
		.replace(/&[a-z]+;/g, '')
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-');

const CALLOUTS: Record<string, string> = {
	NOTE: 'Note',
	TIP: 'Tip',
	WARNING: 'Warning',
	IMPORTANT: 'Important'
};

/**
 * Renders a docs Markdown file to HTML.
 *
 * Supported extras on top of GitHub-flavoured Markdown:
 * - code fence meta: ```ts title="src/routes/+layout.ts"
 * - callouts: > [!NOTE] / [!TIP] / [!WARNING] / [!IMPORTANT]
 */
export async function render(markdown: string) {
	const hl = await getHighlighter();
	const toc: TocItem[] = [];
	const usedIds = new Set<string>();

	const marked = new Marked({ gfm: true });

	marked.use({
		renderer: {
			heading({ tokens, depth }: Tokens.Heading) {
				const inner = this.parser.parseInline(tokens);
				if (depth === 1) return `<h1>${inner}</h1>\n`;

				let id = slugify(inner);
				for (let n = 2; usedIds.has(id); n++) id = `${slugify(inner)}-${n}`;
				usedIds.add(id);

				if (depth === 2 || depth === 3) {
					toc.push({ depth, id, text: decodeEntities(inner.replace(/<[^>]+>/g, '')) });
				}

				return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${inner}</h${depth}>\n`;
			},

			code({ text, lang }: Tokens.Code) {
				const [language = 'text', ...metaParts] = (lang ?? '').trim().split(/\s+/);
				const meta = metaParts.join(' ');
				const title = /title="([^"]+)"/.exec(meta)?.[1];
				const known = (LANGS as readonly string[]).includes(language);

				const highlighted = hl.codeToHtml(text, {
					lang: known ? language : 'text',
					themes: { light: 'github-light', dark: 'github-dark' },
					defaultColor: false
				});

				const header = title
					? `<div class="code-title"><span>${escapeHtml(title)}</span></div>`
					: '';

				return `<figure class="code">${header}<button class="copy" type="button" aria-label="Copy code" data-code="${escapeHtml(text)}">Copy</button>${highlighted}</figure>\n`;
			},

			blockquote({ tokens }: Tokens.Blockquote) {
				const body = this.parser.parse(tokens);
				const match = /^<p>\[!(NOTE|TIP|WARNING|IMPORTANT)\]\s*/.exec(body);
				if (!match) return `<blockquote>${body}</blockquote>\n`;

				const kind = match[1];
				const rest = '<p>' + body.slice(match[0].length);
				return `<aside class="callout callout-${kind.toLowerCase()}"><p class="callout-title">${CALLOUTS[kind]}</p>${rest}</aside>\n`;
			},

			table(token: Tokens.Table) {
				const cell = (c: Tokens.TableCell, tag: 'th' | 'td') =>
					`<${tag}${c.align ? ` style="text-align:${c.align}"` : ''}>${this.parser.parseInline(c.tokens)}</${tag}>`;
				const head = `<tr>${token.header.map((c) => cell(c, 'th')).join('')}</tr>`;
				const rows = token.rows
					.map((row) => `<tr>${row.map((c) => cell(c, 'td')).join('')}</tr>`)
					.join('');
				return `<div class="table"><table><thead>${head}</thead><tbody>${rows}</tbody></table></div>\n`;
			},

			link({ href, title, tokens }: Tokens.Link) {
				const text = this.parser.parseInline(tokens);
				const external = /^https?:\/\//.test(href);
				const t = title ? ` title="${escapeHtml(title)}"` : '';
				const rel = external ? ' rel="noopener" target="_blank"' : '';
				return `<a href="${escapeHtml(href)}"${t}${rel}>${text}</a>`;
			}
		}
	});

	const html = await marked.parse(markdown);
	return { html, toc };
}

/** Highlight a standalone snippet (used on the landing page). */
export async function highlight(code: string, lang: (typeof LANGS)[number]) {
	const hl = await getHighlighter();
	return hl.codeToHtml(code.trim(), {
		lang,
		themes: { light: 'github-light', dark: 'github-dark' },
		defaultColor: false
	});
}
