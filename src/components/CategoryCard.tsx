import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Category } from "../types";

interface CategoryCardProps {
  category: Category;
  onSelect: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      onClick={onSelect}
      className="group cursor-pointer flex flex-col bg-white border border-[#1A1A1A]/8 rounded-xl overflow-hidden shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] bg-[#EFECE6] overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-[#1A1A1A] flex items-center justify-center shadow-md group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-base sm:text-xl font-bold text-[#1A1A1A] group-hover:text-[#4A0E17] transition-colors mb-1">
            {category.name}
          </h3>
          <p className="text-[11px] sm:text-xs text-[#666666] line-clamp-2 leading-relaxed">
            {category.tagline}
          </p>
        </div>

        <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-[#1A1A1A]/5 flex flex-wrap gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] text-[#737373]">
          {category.subcategories
            .filter((sub) => sub !== "All")
            .slice(0, 3)
            .map((sub) => (
              <span key={sub} className="bg-[#FAF8F5] px-1.5 sm:px-2 py-0.5 rounded text-[#525252]">
                {sub}
              </span>
            ))}
          {category.subcategories.filter((sub) => sub !== "All").length > 3 && (
            <span className="hidden sm:inline bg-[#FAF8F5] px-1.5 sm:px-2 py-0.5 rounded text-[#525252]">
              +{category.subcategories.filter((sub) => sub !== "All").length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
