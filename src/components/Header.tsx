import { href } from "../lib/router";

interface Props {
  isHome: boolean;
}

export function Header({ isHome }: Props) {
  return (
    <header class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div class="mx-auto flex min-h-16 max-w-5xl items-center gap-2 px-4 sm:px-6">
        {!isHome && (
          <a
            href={href("/")}
            class="btn-ghost -ml-2 h-11 w-11 shrink-0 rounded-full px-0"
            aria-label="Kembali ke laman utama"
          >
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
              <path d="m15 18-6-6 6-6" />
            </svg>
          </a>
        )}

        <a
          href={href("/")}
          class="flex min-w-0 items-center gap-3 rounded-xl"
          aria-label="Matematik TVET GFM031 — laman utama"
        >
          <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-950 text-xl font-black text-white shadow-sm">
            π
          </span>
          <span class="min-w-0 leading-tight">
            <span class="block truncate text-[15px] font-bold tracking-tight text-slate-950">
              Matematik TVET
            </span>
            <span class="mt-0.5 block truncate text-[12px] font-medium text-slate-500">
              GFM031 · Nota &amp; Kuiz
            </span>
          </span>
        </a>

        <span class="ml-auto hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 sm:inline-flex">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Boleh offline
        </span>
      </div>
    </header>
  );
}
