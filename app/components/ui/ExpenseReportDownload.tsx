"use client";

import { useRef, useState } from "react";

export default function ExpenseReportDownload({ children }: { children: React.ReactNode }) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    if (!captureRef.current) return;
    setBusy(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const canvas = await html2canvas(captureRef.current, { backgroundColor: "#ffffff", scale: 2 });
      const link = document.createElement("a");
      link.download = "expense-report.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div ref={captureRef} className="flex flex-col gap-6">
        {children}
      </div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={busy}
        className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-4 text-base font-semibold text-white disabled:bg-neutral-200 disabled:text-neutral-500"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>
        {busy ? "Preparing..." : "Download"}
      </button>
    </div>
  );
}
