"use client";

import { useEffect, useState, type CSSProperties } from "react";

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

  useEffect(() => {
    const start = () => setActiveRequests((count) => count + 1);
    const end = () => setActiveRequests((count) => Math.max(0, count - 1));
    window.addEventListener("binzeo:loading:start", start);
    window.addEventListener("binzeo:loading:end", end);
    return () => {
      window.removeEventListener("binzeo:loading:start", start);
      window.removeEventListener("binzeo:loading:end", end);
    };
  }, []);

  if (activeRequests === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/35 backdrop-blur-[3px]"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="rounded-full border border-white/70 bg-white/75 px-5 py-4 text-black/75 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <Loader size="md" label="Loading…" />
      </div>
    </div>
  );
}
