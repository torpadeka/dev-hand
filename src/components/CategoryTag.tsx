interface CategoryTagProps {
  category: string;
  availableCategories: Map<number, string>;
}

export default function CategoryTag({
  category,
  availableCategories,
}: CategoryTagProps) {
  const categoryColors: Record<string, string> = {
    "Dynamic Programming": "text-chart-1",
    Greedy: "text-chart-2",
    "Graph Theory": "text-chart-3",
    Sorting: "text-chart-4",
  };

  function getKeyFromValue(map: Map<number, string>, value: string): number {
    for (const [key, val] of map.entries()) {
      if (val === value) return key; // ✅ Return key if value matches
    }
    return -1; // ❌ No match found
  }

  return (
    <div
      className={`border-2 rounded-full p-1 px-2 w-fit text-xs text-chart-${
        (getKeyFromValue(availableCategories, category) % 5) + 1
      }`}
    >
      {category}
    </div>
  );
}
