"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type LoaderVariant =
  | "auto"
  | "home"
  | "dashboard"
  | "security"
  | "addresses"
  | "profile"
  | "contacts"
  | "devices"
  | "sectors"
  | "auth"
  | "public-profile";

type LoaderProps = {
  variant?: LoaderVariant;
};

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-black/[0.09] ${className}`} aria-hidden="true" />;
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-black/[0.07] bg-white/[0.62] p-5 shadow-sm backdrop-blur-xl ${className}`}>{children}</section>;
}

function CardRows({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-2xl border border-black/[0.05] bg-white/50 p-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-2xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-2.5 w-4/5" />
          </div>
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function Hero({ wide = false }: { wide?: boolean }) {
  return (
    <Panel className="mb-5 overflow-hidden p-6 sm:p-9">
      <Skeleton className="mb-5 h-3 w-28 rounded-full" />
      <Skeleton className={`${wide ? "h-10 w-4/5" : "h-9 w-3/5"} mb-4`} />
      <Skeleton className="h-3 w-4/5 max-w-xl" />
      <Skeleton className="mt-2 h-3 w-3/5 max-w-md" />
    </Panel>
  );
}

function PageSkeleton({ variant }: { variant: Exclude<LoaderVariant, "auto"> }) {
  switch (variant) {
    case "home":
      return (
        <>
          <Hero wide />
          <div className="grid gap-4 md:grid-cols-3">
            <Panel className="h-44"><Skeleton className="mb-8 h-10 w-10 rounded-2xl" /><Skeleton className="mb-3 h-5 w-3/5" /><Skeleton className="h-3 w-4/5" /></Panel>
            <Panel className="h-44"><Skeleton className="mb-8 h-10 w-10 rounded-2xl" /><Skeleton className="mb-3 h-5 w-2/3" /><Skeleton className="h-3 w-3/4" /></Panel>
            <Panel className="h-44"><Skeleton className="mb-8 h-10 w-10 rounded-2xl" /><Skeleton className="mb-3 h-5 w-1/2" /><Skeleton className="h-3 w-4/5" /></Panel>
          </div>
        </>
      );
    case "dashboard":
      return (
        <>
          <Hero wide />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => <Panel key={index} className="h-32"><Skeleton className="mb-7 h-3 w-2/5" /><Skeleton className="h-7 w-1/2" /><Skeleton className="mt-2 h-2.5 w-3/4" /></Panel>)}
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => <Panel key={index} className="h-36"><Skeleton className="mb-5 h-5 w-1/2" /><Skeleton className="h-3 w-4/5" /><Skeleton className="mt-2 h-3 w-3/5" /></Panel>)}
          </div>
        </>
      );
    case "security":
      return <><Hero /><div className="grid gap-5 lg:grid-cols-2"><Panel><Skeleton className="mb-5 h-5 w-2/5" /><CardRows count={3} /></Panel><Panel><Skeleton className="mb-5 h-5 w-1/2" /><CardRows count={4} /></Panel></div></>;
    case "addresses":
      return <><Hero /><div className="grid gap-4 md:grid-cols-2"><Panel><Skeleton className="mb-5 h-5 w-2/5" /><CardRows count={2} /></Panel><Panel><Skeleton className="mb-5 h-5 w-1/3" /><CardRows count={2} /></Panel></div></>;
    case "profile":
      return <><Hero /><div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><Panel className="min-h-72"><div className="flex flex-col items-center"><Skeleton className="h-28 w-28 rounded-full" /><Skeleton className="mt-5 h-5 w-2/5" /><Skeleton className="mt-3 h-3 w-1/2" /></div></Panel><Panel><Skeleton className="mb-6 h-5 w-1/3" /><CardRows count={5} /></Panel></div></>;
    case "contacts":
      return <><Hero /><Panel><Skeleton className="mb-5 h-5 w-1/3" /><CardRows count={4} /></Panel></>;
    case "devices":
      return <><Hero /><Panel><Skeleton className="mb-5 h-5 w-1/3" /><CardRows count={4} /></Panel></>;
    case "sectors":
      return <><Hero /><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Panel key={index} className="h-36"><Skeleton className="mb-5 h-6 w-6 rounded-lg" /><Skeleton className="mb-3 h-4 w-3/5" /><Skeleton className="h-3 w-4/5" /></Panel>)}</div></>;
    case "auth":
      return <div className="mx-auto w-full max-w-md"><Panel className="p-7 sm:p-10"><Skeleton className="mx-auto mb-8 h-12 w-12 rounded-2xl" /><Skeleton className="mx-auto mb-3 h-7 w-3/5" /><Skeleton className="mx-auto mb-8 h-3 w-4/5" /><div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full rounded-full" /></div></Panel></div>;
    case "public-profile":
      return <div className="mx-auto w-full max-w-2xl"><Panel className="overflow-hidden p-0"><Skeleton className="h-32 w-full rounded-none" /><div className="p-8 text-center"><Skeleton className="mx-auto -mt-20 h-28 w-28 rounded-full border-4 border-white" /><Skeleton className="mx-auto mt-6 h-7 w-2/5" /><Skeleton className="mx-auto mt-3 h-3 w-1/3" /><div className="mt-8 space-y-3"><Skeleton className="h-14 w-full" /><Skeleton className="h-14 w-full" /></div></div></Panel></div>;
  }
}

function variantFromPath(pathname: string): Exclude<LoaderVariant, "auto"> {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/signin") || pathname.startsWith("/signup") || pathname.startsWith("/forgot-password")) return "auth";
  if (pathname.startsWith("/u/")) return "public-profile";
  const segment = pathname.split("/").filter(Boolean).pop();
  if (segment && ["security", "addresses", "profile", "contacts", "devices", "sectors"].includes(segment)) return segment as Exclude<LoaderVariant, "auto">;
  return "dashboard";
}

export default function Loader({ variant = "auto" }: LoaderProps) {
  const pathname = usePathname();
  const resolvedVariant = variant === "auto" ? variantFromPath(pathname) : variant;
  return (
    <main className="min-h-[calc(100dvh-72px)] w-full bg-white/45 px-3 py-5 sm:px-5 sm:py-8" aria-busy="true" aria-live="polite">
      <div className="mx-auto w-full max-w-6xl"> <PageSkeleton variant={resolvedVariant} /> </div>
    </main>
  );
}
