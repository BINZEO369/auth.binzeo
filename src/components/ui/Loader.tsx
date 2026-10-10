"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";

type LoaderSize = "sm" | "md" | "lg";

type LoaderProps = {
  size?: LoaderSize;
  label?: string;
  fullPage?: boolean;
  className?: string;
};

const sizeMap: Record<LoaderSize, { box: string; stroke: number }> = {
  sm: { box: "h-4 w-4", stroke: 2.4 },
  md: { box: "h-6 w-6", stroke: 2.2 },
  lg: { box: "h-9 w-9", stroke: 2.1 },
};

export default function Loader({
  size = "md",
  label,
  fullPage = false,
  className = "",
}: LoaderProps) {
  const config = sizeMap[size];
  const spinnerStyle: CSSProperties = {
    animation: "spin 0.8s linear infinite",
  };

  const content = (
    <span className={`inline-flex items-center gap-2 ${className}`} role="status" aria-live="polite">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={config.stroke}
        strokeLinecap="round"
        className={config.box}
        style={spinnerStyle}
        aria-hidden={label ? "true" : undefined}
        aria-label={label ? undefined : "Loading"}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      {label && <span>{label}</span>}
    </span>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center" aria-busy="true">
        {content}
      </div>
    );
  }

  return content;
}

export function GlobalLoadingOverlay() {
  const [activeRequests, setActiveRequests] = useState(0);
  const [loadingPath, setLoadingPath] = useState<string | null>(null);
  const pathname = usePathname();
  const routeLoading = loadingPath !== null && loadingPath !== pathname;
  const pageLabel = getPageLabel(pathname);

  useEffect(() => {
    const start = () => setActiveRequests((count) => count + 1);
    const end = () => setActiveRequests((count) => Math.max(0, count - 1));
    const handleNavigation = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest("a");
      if (!anchor || event.defaultPrevented || event.button !== 0) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      try {
        const destination = new URL(href, window.location.href);
        if (destination.origin === window.location.origin && destination.pathname !== window.location.pathname) {
          setLoadingPath(destination.pathname);
        }
      } catch {
        // Ignore malformed or non-navigation href values.
      }
    };

    window.addEventListener("binzeo:loading:start", start);
    window.addEventListener("binzeo:loading:end", end);
    document.addEventListener("click", handleNavigation, true);
    return () => {
      window.removeEventListener("binzeo:loading:start", start);
      window.removeEventListener("binzeo:loading:end", end);
      document.removeEventListener("click", handleNavigation, true);
    };
  }, []);

  if (activeRequests === 0 && !routeLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-md"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="w-[min(88vw,360px)] rounded-3xl border border-white/70 bg-white/70 p-5 text-black/75 shadow-[0_24px_70px_-24px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-2xl bg-black/10" aria-hidden="true" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/5 animate-pulse rounded-full bg-black/15" aria-hidden="true" />
            <div className="h-2.5 w-3/5 animate-pulse rounded-full bg-black/10" aria-hidden="true" />
          </div>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/60">
          Loading {pageLabel}
        </p>
        <div className="mt-3 space-y-2.5" aria-hidden="true">
          <div className="h-2.5 w-full animate-pulse rounded-full bg-black/10" />
          <div className="h-2.5 w-5/6 animate-pulse rounded-full bg-black/10" />
          <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-black/10" />
        </div>
      </div>
    </div>
  );
}

function getPageLabel(pathname: string) {
  if (pathname === "/") return "home";
  const segment = pathname.split("/").filter(Boolean).pop();
  return segment ? segment.replace(/[-_]/g, " ") : "page";
}
