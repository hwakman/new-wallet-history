"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TypeSwitch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") === "income" ? "income" : "expense";

  return (
    <div className="flex gap-1 rounded-xl bg-neutral-100 p-1">
      <button
        type="button"
        onClick={() => router.replace("/new?type=income")}
        className={`flex-1 rounded-lg py-4 text-base font-semibold transition-colors ${
          type === "income" ? "bg-white text-emerald-700 shadow-sm" : "text-neutral-500"
        }`}
      >
        Income
      </button>
      <button
        type="button"
        onClick={() => router.replace("/new?type=expense")}
        className={`flex-1 rounded-lg py-4 text-base font-semibold transition-colors ${
          type === "expense" ? "bg-white text-rose-700 shadow-sm" : "text-neutral-500"
        }`}
      >
        Expense
      </button>
    </div>
  );
}
