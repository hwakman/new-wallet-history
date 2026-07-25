import type { CategoryTotal } from "@/lib/data";
import { colorForIndex } from "./chartColors";

function formatAmount(amount: number) {
  return amount.toLocaleString("en-US");
}

export default function ExpenseSummaryTable({ data }: { data: CategoryTotal[] }) {
  const rows = [...data].sort((a, b) => b.amount - a.amount);
  const total = rows.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-neutral-600">Expense Summary</h2>
      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/10 bg-neutral-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600">Category</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-600">Percentage</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-neutral-400">
                  No expenses yet
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={r.category} className="border-b border-black/5 last:border-b-0">
                  <td
                    className="px-4 py-3 text-sm font-medium"
                    style={{ color: colorForIndex(i) }}
                  >
                    {r.category}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-neutral-500">
                    {total > 0 ? ((r.amount / total) * 100).toFixed(1) : "0"}%
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-neutral-900">
                    {formatAmount(r.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
