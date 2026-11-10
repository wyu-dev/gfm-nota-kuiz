import { useEffect, useState } from "preact/hooks";

function normalize(path: string): string {
  const clean = path.replace(/\/+$/, "");
  return clean || "/";
}

function currentPath(): string {
  if (typeof window === "undefined") return "/";
  return normalize(window.location.pathname);
}

export function href(path: string): string {
  return path;
}

export function navigate(path: string): void {
  const next = normalize(path);
  if (currentPath() === next) {
    window.scrollTo(0, 0);
    return;
  }

  window.history.pushState({}, "", next);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}

export function useRoute(): string {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const onPop = () => {
      setPath(currentPath());
      window.scrollTo(0, 0);
    };

    // Semua pautan dalaman menggunakan <a href="/..."> supaya boleh
    // dikongsi, tetapi navigasi sebenar dilakukan tanpa reload.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      if (!(event.target instanceof Element)) return;

      const anchor = event.target.closest("a");
      if (!anchor) return;

      const target = anchor.getAttribute("href");
      if (!target || !target.startsWith("/")) return;
      if (anchor.hasAttribute("download") || anchor.getAttribute("target")) {
        return;
      }

      event.preventDefault();
      navigate(target);
    };

    window.addEventListener("popstate", onPop);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return path;
}
