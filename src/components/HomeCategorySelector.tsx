import { forwardRef, useImperativeHandle, useState, useEffect } from "react";

interface CategorySelectorProps {
  onCategoryChange: (selected: string[]) => void; // ✅ Nama lebih jelas
  showMore: boolean;
  categories: Map<number, string>;
}

const HomeCategorySelector = forwardRef(
  ({ onCategoryChange, showMore, categories }: CategorySelectorProps, ref) => {
    const categoryNames = [...categories.values()];
    const [availableCategories, setAvailableCategories] = useState([
      ...categories.values(),
    ]);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
      onCategoryChange(selectedCategories);
    }, [selectedCategories, onCategoryChange]);

    const selectCategory = (category: string) => {
      setSelectedCategories([...selectedCategories, category]);
    };

    const removeCategory = (category: string) => {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    };

    useImperativeHandle(ref, () => ({
      getSelectedCategories: () => onCategoryChange(selectedCategories),
    }));

    // 🔎 Filter kategori berdasarkan input pencarian
    const filteredCategories = availableCategories.filter((category) =>
      category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 🔄 Gabungkan kategori yang sudah dipilih di awal daftar
    const orderedCategories = [
      ...selectedCategories,
      ...filteredCategories.filter((c) => !selectedCategories.includes(c)),
    ];

    useEffect(() => {
      setSearchQuery("");
    }, [showMore]);

    return (
      <div className="w-full">
        <div className={` ${showMore ? "flex" : "hidden"}`}>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 mb-2 rounded-md border  text-primary-foreground"
          />
        </div>

        <div
          className={`flex gap-2 bg-background rounded-md ${
            showMore ? "flex-wrap" : ""
          }`}
        >
          {orderedCategories.length > 0 ? (
            orderedCategories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  selectedCategories.includes(category)
                    ? removeCategory(category)
                    : selectCategory(category)
                }
                className={`px-3 py-1 max-h-7 rounded-md text-sm transition w-fit whitespace-nowrap ${
                  selectedCategories.includes(category)
                    ? "bg-chart-3 text-white hover:bg-chart-3/90"
                    : "bg-secondary text-primary hover:bg-primary-foreground/70"
                }`}
              >
                {category} {selectedCategories.includes(category) && "✖"}
              </button>
            ))
          ) : (
            <p className="text-foreground text-sm">
              No matching categories found.
            </p>
          )}
        </div>
      </div>
    );
  }
);

export default HomeCategorySelector;
