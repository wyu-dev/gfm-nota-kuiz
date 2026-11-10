import { countForTopic, getTopic, nextTopic } from "../lib/content";
import { href } from "../lib/router";
import { NotFoundPage } from "./NotFound";

interface Heading {
  id: string;
  text: string;
}

interface EnhancedNote {
  html: string;
  headings: Heading[];
}

function enhanceNote(html: string): EnhancedNote {
  const headings: Heading[] = [];

  const enhanced = html.replace(
    /<h4([^>]*)>([\s\S]*?)<\/h4>/gi,
    (match, rawAttrs: string, inner: string) => {
      const text = inner
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/\s+/g, " ")
        .trim();

      if (!text) return match;

      const attrs = rawAttrs.replace(/\sid\s*=\s*"[^"]*"/gi, "");
      const id = `bahagian-${headings.length + 1}`;
      headings.push({ id, text });
      return `<h4${attrs} id="${id}">${inner}</h4>`;
    },
  );

  return { html: enhanced, headings };
}

interface Props {
  id: string;
}

export function NotePage({ id }: Props) {
  const topic = getTopic(id);
  if (!topic) return <NotFoundPage />;

  const { html, headings } = enhanceNote(topic.note);
  const count = countForTopic(topic.id);
  const next = nextTopic(topic.id);

  return (
    <div class="mx-auto max-w-3xl px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-8">
      <nav
        class="mb-4 text-[13px] font-medium text-slate-500"
        aria-label="Jejak"
      >
        <a href={href("/")} class="hover:text-indigo-600">
          Laman utama
        </a>
        <span class="mx-1.5" aria-hidden="true">
          /
        </span>
        <span class="text-slate-800">{topic.title}</span>
      </nav>

      <header class="mb-6">
        <span class="chip bg-white text-indigo-700 ring-1 ring-inset ring-slate-200">
          {topic.module} · Nota
        </span>
        <h1 class="mt-3 text-[32px] font-black leading-[1.08] tracking-[-0.025em] text-slate-950 sm:text-4xl">
          {topic.title}
        </h1>
        <p class="mt-2 text-[16px] leading-relaxed text-slate-500">
          {topic.subtitle}
        </p>

        <div class="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <a href={href(`/kuiz/${topic.id}`)} class="btn-primary">
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m5 3 14 9-14 9V3z" />
            </svg>
            Mula kuiz · {count} soalan
          </a>
          <a href={href("/")} class="btn-secondary">
            Semua topik
          </a>
        </div>
      </header>

      {headings.length > 1 && (
        <details class="card mb-5 px-5 py-4">
          <summary class="flex cursor-pointer select-none items-center gap-2 text-[15px] font-bold text-slate-900">
            <svg
              class="h-5 w-5 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h10" />
            </svg>
            Kandungan nota
            <span class="ml-auto text-[13px] font-semibold text-slate-400">
              {headings.length} bahagian
            </span>
          </summary>
          <ol class="mt-4 space-y-2 border-t border-slate-100 pt-4">
            {headings.map((heading, index) => (
              <li key={heading.id} class="flex gap-3">
                <span class="w-5 shrink-0 pt-0.5 text-right text-[13px] font-bold tabular-nums text-slate-300">
                  {index + 1}
                </span>
                <a
                  href={`#${heading.id}`}
                  class="text-[15px] leading-snug text-slate-600 hover:text-indigo-600"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </details>
      )}

      <article class="card overflow-hidden p-5 sm:p-8">
        <div class="note-content" dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      <section class="mt-6 overflow-hidden rounded-2xl bg-slate-950 p-6 text-white shadow-lg shadow-slate-900/10 sm:p-8">
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
          Semak kefahaman
        </p>
        <h2 class="mt-2 text-2xl font-black tracking-tight">
          Sudah faham topik ini?
        </h2>
        <p class="mt-2 max-w-lg text-[15px] leading-relaxed text-slate-300">
          Uji diri dengan {count} soalan kuiz. Setiap jawapan disertakan
          penjelasan penuh.
        </p>
        <a
          href={href(`/kuiz/${topic.id}`)}
          class="btn mt-5 min-h-[50px] bg-white px-6 text-slate-950 hover:bg-slate-100"
        >
          Mula kuiz sekarang
          <svg
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </a>
      </section>

      {next && (
        <a
          href={href(`/nota/${next.id}`)}
          class="card mt-4 flex items-center justify-between gap-4 p-5 transition hover:border-indigo-200 hover:shadow-md"
        >
          <span class="min-w-0">
            <span class="block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Topik seterusnya
            </span>
            <span class="mt-1 block truncate text-[16px] font-bold text-slate-950">
              {next.title}
            </span>
          </span>
          <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600">
            <svg
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </span>
        </a>
      )}
    </div>
  );
}
