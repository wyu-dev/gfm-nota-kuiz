import { useEffect, useState } from "preact/hooks";

export function OfflineBanner() {
  const [offline, setOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );

  useEffect(() => {
    const goOnline = () => setOffline(false);
    const goOffline = () => setOffline(true);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      class="flex items-center justify-center gap-2 bg-amber-500 px-4 py-2.5 text-center text-[13px] font-semibold text-white"
      role="status"
    >
      <svg
        class="h-4 w-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M2 2l20 20M8.5 8.5a5 5 0 0 1 7 0M5 5a10 10 0 0 1 4.5-2.4M12 20h.01" />
      </svg>
      <span class="text-balance">
        Anda sedang offline. Nota dan kuiz yang telah dimuatkan masih boleh
        digunakan.
      </span>
    </div>
  );
}
