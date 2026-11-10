import { useRegisterSW } from "virtual:pwa-register/preact";

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div
      class="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl bg-slate-950 p-4 text-white shadow-2xl shadow-slate-900/30 ring-1 ring-white/10 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[380px]"
      role="status"
    >
      <div class="flex items-start gap-3">
        <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10">
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
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
        </span>
        <div class="min-w-0 flex-1 pt-0.5">
          <p class="text-[14px] font-bold">Versi baharu tersedia</p>
          <p class="mt-0.5 text-[12.5px] leading-snug text-slate-400">
            Muat semula untuk mendapatkan nota dan kuiz terkini.
          </p>
        </div>
        <button
          type="button"
          class="-mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white"
          onClick={() => setNeedRefresh(false)}
          aria-label="Tutup notis kemas kini"
        >
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
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <button
        type="button"
        class="mt-3 h-11 w-full rounded-xl bg-white text-[14px] font-bold text-slate-950 transition hover:bg-slate-100 active:scale-[0.99]"
        onClick={() => updateServiceWorker(true)}
      >
        Muat semula sekarang
      </button>
    </div>
  );
}
