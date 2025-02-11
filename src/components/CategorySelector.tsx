import { forwardRef, useImperativeHandle, useState } from "react";

interface CategorySelectorProps {
  onSubmit: (selected: string[]) => void; // ✅ Function to send selected categories
}

const CategorySelector = forwardRef(
  ({ onSubmit }: CategorySelectorProps, ref) => {
    const [availableCategories, setAvailableCategories] = useState([
      "React",
      "JavaScript",
      "CSS",
      "Tailwind",
      "Node.js",
      "Next.js",
      "TypeScript",
      "GraphQL",
    ]);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const selectCategory = (category: string) => {
      setAvailableCategories(availableCategories.filter((c) => c !== category));
      setSelectedCategories([...selectedCategories, category]);
    };

    const removeCategory = (category: string) => {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
      setAvailableCategories([...availableCategories, category]);
    };

    useImperativeHandle(ref, () => ({
      getSelectedCategories: () => onSubmit(selectedCategories),
    }));

    return (
      <div className="max-w-lg mx-3">
        <div className="mb-2 text-xl font-semibold text-primary-foreground">
          Select Category
        </div>
        <div className="flex flex-wrap gap-2 p-3 bg-background rounded-md min-h-[50px]">
          {selectedCategories.length > 0 ? (
            selectedCategories.map((category) => (
              <button
                key={category}
                onClick={() => removeCategory(category)}
                className="bg-chart-3 items-center text-white px-3 py-1 rounded-md text-sm hover:bg-chart-3/90 transition"
              >
                {category} ✖
              </button>
            ))
          ) : (
            <p className="text-foreground text-sm">No categories selected.</p>
          )}
        </div>

        <h2 className="text-xl font-semibold mt-4 mb-2 text-primary-foreground">
          Available Categories
        </h2>
        <div className="flex flex-wrap gap-2 p-3 bg-background rounded-md min-h-[50px]">
          {availableCategories.length > 0 ? (
            availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => selectCategory(category)}
                className="bg-secondary text-primary px-3 py-1 rounded-md text-sm hover:bg-primary-foreground/70 transition"
              >
                {category}
              </button>
            ))
          ) : (
            <p className="text-foreground text-sm">All categories selected.</p>
          )}
        </div>
        <button
          onClick={() => console.log(selectedCategories)}
          className="hidden"
        />
      </div>
    );
  }
);

export default CategorySelector;
