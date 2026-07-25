// Shared by the pie chart and the summary table so a category reads the same
// colour in both. Both render the data in amount-desc order, so index matches.
export const CHART_COLORS = [
  "#d97706",
  "#059669",
  "#2563eb",
  "#7c3aed",
  "#be185d",
  "#0d9488",
];

export function colorForIndex(index: number) {
  return CHART_COLORS[index % CHART_COLORS.length];
}
