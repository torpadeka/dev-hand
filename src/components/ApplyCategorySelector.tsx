import { forwardRef, useImperativeHandle, useState } from "react";

interface CategorySelectorProps {
  onSubmit: (selected: string[]) => void; // ✅ Function to send selected categories
  categories: Map<number, string>;
}

const ApplyCategorySelector = forwardRef(
  ({ onSubmit, categories }: CategorySelectorProps, ref) => {
    const categoryNames = [...categories.values()];
    const [availableCategories, setAvailableCategories] =
      useState(categoryNames);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredCategories = availableCategories.filter((category) =>
      category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="">
        <div className="mb-2 text-lg text-primary-foreground">
          Select Your Expertise
        </div>
        <div className="flex flex-wrap gap-2 p-3 bg-background rounded-md min-h-[50px] items-center">
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

        <p className="text-sm font-semibold mt-4 mb-2 text-primary-foreground">
          Available Categories
        </p>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-2 rounded-md border border-[#424242] text-primary-foreground bg-background"
        />
        <div className="flex flex-wrap gap-2 p-3 bg-background rounded-md h-52 overflow-auto">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <button
                key={category}
                onClick={() => selectCategory(category)}
                className={`bg-secondary text-primary px-3 py-1 rounded-md text-sm hover:bg-primary-foreground/70 transition max-h-7`}
              >
                {category}
              </button>
            ))
          ) : (
            <p className="text-foreground text-sm">
              No matching categories found.
            </p>
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

export default ApplyCategorySelector;
