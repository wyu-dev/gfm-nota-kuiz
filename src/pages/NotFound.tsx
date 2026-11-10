import { href } from "../lib/router";

export function NotFoundPage() {
  return (
    <div class="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
      <span class="grid h-20 w-20 place-items-center rounded-3xl bg-white text-3xl font-black text-slate-300 ring-1 ring-slate-200">
        404
      </span>
      <h1 class="mt-6 text-2xl font-black tracking-tight text-slate-950">
        Halaman tidak dijumpai
      </h1>
      <p class="mt-2 max-w-sm text-[15px] leading-relaxed text-slate-500">
        Pautan mungkin sudah berubah atau topik yang dicari tidak wujud.
      </p>
      <a href={href("/")} class="btn-primary mt-7">
        Kembali ke laman utama
      </a>
    </div>
  );
}
