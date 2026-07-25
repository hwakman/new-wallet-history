function formatAmount(amount: number) {
  return amount.toLocaleString("en-US");
}

export default function SummaryBox({
  income,
  expense,
  balance,
}: {
  income: number;
  expense: number;
  balance: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-4">
      <div>
        <p className="text-xs font-medium text-neutral-500">Balance</p>
        <p className="text-3xl font-semibold text-neutral-900">{formatAmount(balance)}</p>
      </div>
      <div className="flex flex-col items-end gap-1 border-l border-black/10 pl-4">
        <p className="text-sm font-semibold text-green-600">+{formatAmount(income)}</p>
        <p className="text-sm font-semibold text-red-600">-{formatAmount(expense)}</p>
      </div>
    </div>
  );
}
