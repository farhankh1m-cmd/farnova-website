import React from "react";
import { ArrowRight } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data/products";
import { ProductCard } from "./ProductCard";

interface FeaturedSectionProps {
  products?: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onViewAll: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onViewAll,
}) => {
  const list = products || PRODUCTS;
  const featured = list.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#1A1A1A]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-[#1A1A1A]/10">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#737373] font-medium mb-1.5">
              Handpicked Essentials
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
              Featured Products
            </h2>
          </div>

          <button
            onClick={onViewAll}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] hover:text-[#4A0E17] transition-colors group cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
