"use client";

import { useState } from "react";
import { IoIosCheckmark } from "react-icons/io";

interface CategoryTagProps {
  category: string;
}

export default function CategoryFilterTag({ category }: CategoryTagProps) {
  const categoryClasses: Record<string, string> = {
    "Dynamic Programming": "bg-chart-1",
    Greedy: "bg-chart-2",
    "Graph Theory": "bg-chart-3",
    Sorting: "bg-chart-4",
  };

  const [active, setActive] = useState(false);

  const toggleActive = () => {
    setActive(!active);
  };

  return (
    <div
      className="flex items-center hover:cursor-pointer select-none pl-2 px-1 border-2 py-1 whitespace-nowrap text-sm w-fit rounded-full text-primary-foreground bg-primary"
      onClick={toggleActive}
    >
      {category}
      <div className={`ml-1  ${active ? "flex" : "hidden"} `}>
        <IoIosCheckmark size={20} />
      </div>
    </div>
  );
}
