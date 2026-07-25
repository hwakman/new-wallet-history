"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createTransaction } from "@/app/actions";
import type { Categories } from "@/lib/data";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

export default function NumberPad({ categories }: { categories: Categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") === "income" ? "income" : "expense";
  const [value, setValue] = useState("0");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // The category list changes with the type, so drop a now-invalid selection.
  useEffect(() => {
    setCategory("");
  }, [type]);

  function formatDisplay(val: string) {
    const [intPart, decimalPart] = val.split(".");
    const num = parseInt(intPart || "0", 10);
    const formatted = num.toLocaleString("en-US");

    if (val.includes(".")) {
      return formatted + "." + (decimalPart || "");
    }
    return formatted;
  }

  function pressKey(key: string) {
    if (key === "⌫") {
      setValue((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      return;
    }
    if (key === "." && value.includes(".")) return;
    setValue((prev) => (prev === "0" && key !== "." ? key : prev + key));
  }

  async function handleSave() {
    const amount = parseFloat(value);
    if (!amount || amount <= 0 || !category) return;

    setSaving(true);
    setError("");
    try {
      await createTransaction({ amount, category, type });
      router.push("/");
    } catch {
      setError("Could not save. Please try again.");
      setSaving(false);
    }
  }

  const canSave = parseFloat(value) > 0 && !!category && !saving;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-right text-4xl font-semibold text-neutral-900 py-2">{formatDisplay(value)}</p>
      <div className="grid grid-cols-3 gap-2">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => pressKey(key)}
            className="rounded-xl bg-neutral-100 py-4 text-xl font-medium text-neutral-900"
          >
            {key}
          </button>
        ))}
      </div>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-xl border border-black/10 bg-white px-4 py-3 text-base text-neutral-900"
      >
        <option value="">Select category</option>
        {categories[type].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={handleSave}
        disabled={!canSave}
        className={`rounded-xl py-4 text-base font-semibold ${
          canSave
            ? "bg-neutral-900 text-white"
            : "cursor-not-allowed bg-neutral-200 text-neutral-500"
        }`}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
