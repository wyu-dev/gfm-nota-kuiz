import { useEffect, useState } from "preact/hooks";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const iosStandalone = (window.navigator as Navigator & {
    standalone?: boolean;
  }).standalone;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    iosStandalone === true
  );
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [installed, setInstalled] = useState(isStandalone);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;
  if (!deferred && !isIos()) return null;

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setDeferred(null);
  };

  return (
    <div class="card mt-4 flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
      <span class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
        <svg
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
          <path d="M12 7v7M9.5 9.5 12 7l2.5 2.5M10.5 18h3" />
        </svg>
      </span>

      <div class="min-w-0 flex-1">
        <p class="text-[15px] font-bold text-slate-950">
          Pasang sebagai aplikasi
        </p>
        {deferred ? (
          <p class="mt-1 text-[13.5px] leading-relaxed text-slate-500">
            Buka nota dan kuiz terus dari skrin utama, termasuk ketika offline.
          </p>
        ) : (
          <p class="mt-1 text-[13.5px] leading-relaxed text-slate-500">
            Di Safari, tekan butang <strong>Kongsi</strong> kemudian pilih{" "}
            <strong>Tambah ke Skrin Utama</strong>.
          </p>
        )}
      </div>

      {deferred && (
        <button
          type="button"
          class="btn-primary w-full shrink-0 sm:w-auto"
          onClick={install}
        >
          Pasang
        </button>
      )}
    </div>
  );
}
