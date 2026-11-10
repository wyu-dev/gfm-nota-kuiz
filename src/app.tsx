import { useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { Header } from "./components/Header";
import { OfflineBanner } from "./components/OfflineBanner";
import { UpdatePrompt } from "./components/UpdatePrompt";
import { useRoute } from "./lib/router";
import { clearProgress } from "./lib/storage";
import { HomePage } from "./pages/Home";
import { NotePage } from "./pages/Note";
import { NotFoundPage } from "./pages/NotFound";
import { QuizPage } from "./pages/Quiz";

export function App() {
  const path = useRoute();
  const segments = path.split("/").filter(Boolean);

  let page: ComponentChildren;

  if (segments.length === 0) {
    page = <HomePage />;
  } else if (segments[0] === "nota" && segments[1]) {
    page = <NotePage key={segments[1]} id={segments[1]} />;
  } else if (segments[0] === "kuiz" && segments[1]) {
    page = <QuizPage key={segments[1]} id={segments[1]} />;
  } else {
    page = <NotFoundPage />;
  }

  return (
    <div class="flex min-h-dvh flex-col">
      <Header isHome={segments.length === 0} />
      <OfflineBanner />
      <main class="flex-1">{page}</main>
      <SiteFooter />
      <UpdatePrompt />
    </div>
  );
}

function SiteFooter() {
  const [showConfirm, setShowConfirm] = useState(false);

  const reset = () => {
    clearProgress();
    setShowConfirm(false);
    window.location.reload();
  };

  return (
    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="flex items-center gap-2.5 text-[15px] font-black tracking-tight text-slate-950">
              <span class="grid h-8 w-8 place-items-center rounded-lg bg-slate-950 text-sm font-black text-white">
                π
              </span>
              Matematik TVET
              <span class="font-semibold text-slate-400">GFM031</span>
            </p>
            <p class="mt-2.5 max-w-sm text-[13px] leading-relaxed text-slate-500">
              Kemajuan kuiz disimpan pada peranti ini sahaja — tiada akaun,
              tiada data dihantar.
            </p>
          </div>

          <div class="sm:text-right">
            {showConfirm ? (
              <div class="rounded-xl border border-rose-200 bg-rose-50 p-3 sm:inline-block">
                <p class="text-[13px] font-semibold text-rose-800">
                  Padam semua rekod kuiz?
                </p>
                <div class="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg bg-rose-600 px-4 text-[13px] font-bold text-white hover:bg-rose-700"
                    onClick={reset}
                  >
                    Ya, padam
                  </button>
                  <button
                    type="button"
                    class="inline-flex min-h-[44px] items-center justify-center rounded-lg px-4 text-[13px] font-semibold text-slate-600 hover:bg-white"
                    onClick={() => setShowConfirm(false)}
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                class="inline-flex min-h-[44px] items-center rounded-lg px-2 text-[13px] font-semibold text-slate-400 transition hover:text-rose-600"
                onClick={() => setShowConfirm(true)}
              >
                Padam kemajuan
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
