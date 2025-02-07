interface CategoryTagProps {
  category: string;
}

export default function CategoryTag({ category }: CategoryTagProps) {
  const categoryColors: Record<string, string> = {
    "Dynamic Programming": "text-chart-1",
    Greedy: "text-chart-2",
    "Graph Theory": "text-chart-3",
    Sorting: "text-chart-4",
  };

  return (
    <div
      className={`border-2 rounded-full p-1 px-2 w-fit text-xs ${
        categoryColors[category] || "text-foreground"
      }`}
    >
      {category}
    </div>
  );
}
