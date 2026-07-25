import Link from "next/link";

export default function IncomeExpenseButtons() {
  return (
    <div className="flex gap-2">
      <Link
        href="/new?type=income"
        className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-base font-semibold text-emerald-700"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M6 11l6-6 6 6" />
        </svg>
        Income
      </Link>
      <Link
        href="/new?type=expense"
        className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3 text-base font-semibold text-rose-700"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M6 13l6 6 6-6" />
        </svg>
        Expense
      </Link>
    </div>
  );
}
