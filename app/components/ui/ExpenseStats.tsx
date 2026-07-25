"use client";

import * as echarts from "echarts";
import { useEffect, useRef } from "react";
import type { CategoryTotal } from "@/lib/data";
import { CHART_COLORS } from "./chartColors";

export default function ExpenseStats({ data }: { data: CategoryTotal[] }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;
    const chart = echarts.init(chartRef.current);

    chart.setOption({
      color: CHART_COLORS,
      tooltip: { trigger: "item" },
      series: [
        {
          type: "pie",
          radius: "95%",
          center: ["50%", "50%"],
          data: data.map((s) => ({ name: s.category, value: s.amount })),
          label: {
            position: "inside",
            formatter: "{d}%",
            fontSize: 11,
            color: "#fff",
            fontWeight: "bold",
          },
          labelLine: { show: false },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 2,
          },
          animationType: "scale",
          animationEasing: "elasticOut",
        },
      ],
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [data]);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-neutral-600">Expense Stats</h2>
      <div className="rounded-lg border border-black/10 bg-white p-2">
        {data.length === 0 ? (
          <p className="py-12 text-center text-sm text-neutral-400">No expenses yet</p>
        ) : (
          <div ref={chartRef} className="h-64 w-full" />
        )}
      </div>
    </div>
  );
}
