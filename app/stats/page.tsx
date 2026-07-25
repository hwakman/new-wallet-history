import SummaryBox from "../components/ui/SummaryBox";
import ExpenseStats from "../components/ui/ExpenseStats";
import ExpenseSummaryTable from "../components/ui/ExpenseSummaryTable";
import ExpenseReportDownload from "../components/ui/ExpenseReportDownload";
import { getExpenseByCategory, getTotals } from "@/lib/data";

export default async function StatsPage() {
  const [totals, expenseByCategory] = await Promise.all([getTotals(), getExpenseByCategory()]);

  return (
    <div className="flex flex-1 flex-col gap-6 pt-6">
      <SummaryBox {...totals} />
      <ExpenseReportDownload>
        <ExpenseStats data={expenseByCategory} />
        <ExpenseSummaryTable data={expenseByCategory} />
      </ExpenseReportDownload>
    </div>
  );
}
