import { Suspense } from "react";
import TypeSwitch from "../components/ui/TypeSwitch";
import NumberPad from "../components/ui/NumberPad";
import { getCategories } from "@/lib/data";

export default async function NewPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-1 flex-col gap-6 pt-6">
      <Suspense fallback={null}>
        <TypeSwitch />
        <NumberPad categories={categories} />
      </Suspense>
    </div>
  );
}
