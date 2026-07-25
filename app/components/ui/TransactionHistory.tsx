import moment from "moment";
import type { Transaction } from "@/lib/data";

function formatRelativeDay(date: string) {
  const diff = moment().startOf("day").diff(moment(date).startOf("day"), "days");
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
}

function formatAmount(amount: number) {
  return amount.toLocaleString("en-US");
}

export default function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-neutral-600">Recent Transactions</h2>
      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/10 bg-neutral-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600">Category</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-neutral-400">
                  No transactions yet
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="border-b border-black/5 last:border-b-0">
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-neutral-500">
                    {formatRelativeDay(t.date)}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-900">{t.category}</td>
                  <td
                    className={`px-4 py-3 text-right text-sm font-medium ${
                      t.type === "expense" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {t.type === "expense" ? "-" : "+"}
                    {formatAmount(t.amount)}
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
