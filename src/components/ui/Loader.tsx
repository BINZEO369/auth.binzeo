import type { CSSProperties } from "react";

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
