import React from "react";
import { CategoryId } from "../types";
import { CATEGORIES } from "../data/products";
import { CategoryCard } from "./CategoryCard";

interface CategoriesOverviewProps {
  onSelectCategory: (id: CategoryId) => void;
}

export const CategoriesOverview: React.FC<CategoriesOverviewProps> = ({
  onSelectCategory,
}) => {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-[#1A1A1A]/10">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#737373] font-medium mb-2">
              Curated Wardrobe
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
              Shop by Category
            </h2>
          </div>
          <p className="text-sm text-[#525252] mt-2 md:mt-0 max-w-md">
            Explore our curated collections tailored specifically for formal presence, casual comfort, and everyday sophistication.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onSelect={() => onSelectCategory(cat.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
