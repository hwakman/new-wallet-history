"use client";

import { useRef, useState } from "react";
import ExpenseStats from "./ExpenseStats";
import ExpenseSummaryTable from "./ExpenseSummaryTable";
import { resetTransactions } from "@/app/actions";
import type { CategoryTotal } from "@/lib/data";

export default function CompactResetButton({ data }: { data: CategoryTotal[] }) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    if (text !== "confirm" || !captureRef.current) return;
    setBusy(true);
    setError("");
    try {
      // Download first — the reset only runs once the image is saved.
      const html2canvas = (await import("html2canvas-pro")).default;
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = "expense-report.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      await resetTransactions();

      setOpen(false);
      setText("");
    } catch {
      setError("Could not complete. Nothing was reset.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl border border-rose-200 bg-rose-50 py-4 text-base font-semibold text-rose-700"
      >
        Compact &amp; Reset
      </button>

      {/* Offscreen copy of the stats page content, so it can be captured from here. */}
      <div ref={captureRef} className="fixed top-0 -left-[9999px] w-[360px] bg-white p-4">
        <div className="flex flex-col gap-6">
          <ExpenseStats data={data} />
          <ExpenseSummaryTable data={data} />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl bg-white p-5">
            <h3 className="text-base font-semibold text-neutral-900">Compact &amp; Reset</h3>
            <p className="text-sm text-neutral-600">
              This downloads the current stats as an image, then resets all records to 0. Type{" "}
              <span className="font-semibold text-neutral-900">confirm</span> to continue.
            </p>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="confirm"
              autoFocus
              className="rounded-xl border border-black/10 px-4 py-3 text-sm"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setText("");
                  setError("");
                }}
                className="flex-1 rounded-xl border border-black/10 py-3 text-sm font-semibold text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={text !== "confirm" || busy}
                className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-semibold text-white disabled:bg-neutral-200 disabled:text-neutral-500"
              >
                {busy ? "Working..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
