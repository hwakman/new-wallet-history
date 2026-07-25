import CategoryEditor from "../components/ui/CategoryEditor";
import CompactResetButton from "../components/ui/CompactResetButton";
import { getCategories, getExpenseByCategory } from "@/lib/data";

export default async function SettingsPage() {
  const [categories, expenseByCategory] = await Promise.all([
    getCategories(),
    getExpenseByCategory(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-6 pt-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <CategoryEditor categories={categories} />
      <CompactResetButton data={expenseByCategory} />
    </div>
  );
}
