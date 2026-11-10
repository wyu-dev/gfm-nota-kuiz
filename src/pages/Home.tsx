import { InstallPrompt } from "../components/InstallPrompt";
import { TopicCard } from "../components/TopicCard";
import { totalQuestions, topics } from "../lib/content";
import { href } from "../lib/router";
import { getTopicProgress } from "../lib/storage";

export function HomePage() {
  const challengeBest = getTopicProgress("semua");

  return (
    <div class="mx-auto max-w-5xl px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-8">
      <section class="relative overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10 sm:p-10 lg:p-12">
        <div
          class="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -bottom-28 left-1/4 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl"
          aria-hidden="true"
        />
        <span
          class="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 select-none text-[260px] font-black leading-none text-white/[0.035] lg:block"
          aria-hidden="true"
        >
          π
        </span>

        <div class="relative">
          <div class="flex flex-wrap items-center gap-3">
            <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">
              <span class="h-1.5 w-1.5 rounded-full bg-amber-300" />
              GFM031 · Matematik TVET
            </span>
            <span class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Boleh offline
            </span>
          </div>

          <h1 class="mt-6 max-w-2xl text-[38px] font-black leading-[1.05] tracking-[-0.03em] sm:text-6xl">
            Belajar matematik
            <span class="mt-1 block text-amber-300">tanpa rasa keliru.</span>
          </h1>
          <p class="mt-4 max-w-xl text-[16px] leading-relaxed text-slate-300 sm:text-lg">
            Nota padat dan kuiz interaktif untuk lima topik GFM031. Faham
            konsep, jawab soalan, dan semak penjelasan — semuanya dalam satu
            aplikasi.
          </p>

          <div class="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={href("/kuiz/semua")}
              class="btn min-h-[52px] bg-white px-6 text-slate-950 shadow-sm hover:bg-slate-100"
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
                <path d="m5 3 14 9-14 9V3z" />
              </svg>
              Cabaran 20 soalan
            </a>
            <a
              href={href("/nota/pengukuran")}
              class="btn min-h-[52px] border border-white/20 bg-white/[0.04] px-6 text-white hover:bg-white/10"
            >
              Baca nota dahulu
            </a>
          </div>

          {challengeBest && (
            <p class="mt-4 text-[13px] font-medium text-slate-400">
              Rekod terbaik cabaran:{" "}
              <strong class="font-bold text-white">
                {challengeBest.best}/{challengeBest.total}
              </strong>
            </p>
          )}

          <dl class="mt-9 grid max-w-lg grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-4">
            <div class="px-1 text-center first:pl-0">
              <dd class="text-[26px] font-black leading-none">{topics.length}</dd>
              <dt class="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Topik
              </dt>
            </div>
            <div class="px-1 text-center">
              <dd class="text-[26px] font-black leading-none">
                {totalQuestions}
              </dd>
              <dt class="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Soalan
              </dt>
            </div>
            <div class="px-1 text-center">
              <dd class="text-[26px] font-black leading-none">100%</dd>
              <dt class="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Offline
              </dt>
            </div>
          </dl>
        </div>
      </section>

      <InstallPrompt />

      <section class="mt-12" aria-labelledby="topik-heading">
        <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p class="eyebrow">Kurikulum</p>
            <h2
              id="topik-heading"
              class="mt-2 text-[26px] font-black tracking-tight text-slate-950 sm:text-3xl"
            >
              Pilih topik
            </h2>
            <p class="mt-2 text-[15px] leading-relaxed text-slate-500">
              Setiap topik ada nota ringkas dan kuiz berpenjelasan.
            </p>
          </div>
          <span class="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] font-semibold text-slate-500">
            {topics.length} topik · {totalQuestions} soalan
          </span>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      <section class="mt-12" aria-labelledby="cara-heading">
        <div class="mb-5">
          <p class="eyebrow">Rutin belajar</p>
          <h2
            id="cara-heading"
            class="mt-2 text-[26px] font-black tracking-tight text-slate-950 sm:text-3xl"
          >
            Tiga langkah, cukup.
          </h2>
        </div>

        <div class="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Baca nota",
              text: "Formula, contoh dan gambarajah yang jelas untuk setiap topik.",
            },
            {
              title: "Jawab kuiz",
              text: "Soalan dan pilihan jawapan diacak supaya latihan lebih jujur.",
            },
            {
              title: "Semak jawapan",
              text: "Penjelasan penuh selepas setiap soalan, termasuk rajah.",
            },
          ].map((step, index) => (
            <div class="card p-5" key={step.title}>
              <span class="text-[32px] font-black leading-none tracking-tight text-slate-200">
                0{index + 1}
              </span>
              <h3 class="mt-4 text-[17px] font-bold tracking-tight text-slate-950">
                {step.title}
              </h3>
              <p class="mt-1.5 text-[14px] leading-relaxed text-slate-500">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section class="mt-12 overflow-hidden rounded-2xl bg-indigo-600 px-6 py-7 text-white shadow-lg shadow-indigo-600/15 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.16em] text-indigo-200">
            Cabaran pantas
          </p>
          <h2 class="mt-2 text-2xl font-black tracking-tight">
            Dah baca nota? Uji diri sekarang.
          </h2>
          <p class="mt-2 max-w-xl text-[15px] leading-relaxed text-indigo-100">
            20 soalan rawak daripada keseluruhan bank. Tiada tekanan — ulang
            sehingga anda yakin.
          </p>
        </div>
        <a
          href={href("/kuiz/semua")}
          class="btn mt-5 min-h-[50px] shrink-0 bg-white px-6 text-indigo-700 hover:bg-indigo-50 sm:mt-0"
        >
          Mula cabaran
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
    </div>
  );
}
