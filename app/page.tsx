import IncomeExpenseButtons from "./components/ui/IncomeExpenseButtons";
import SummaryBox from "./components/ui/SummaryBox";
import TransactionHistory from "./components/ui/TransactionHistory";
import { getTotals, getTransactions } from "@/lib/data";

export default async function Home() {
  const [totals, transactions] = await Promise.all([getTotals(), getTransactions(10)]);

  return (
    <div className="flex flex-1 flex-col gap-6 pt-6">
      <IncomeExpenseButtons />
      <SummaryBox {...totals} />
      <TransactionHistory transactions={transactions} />
    </div>
  );
}
