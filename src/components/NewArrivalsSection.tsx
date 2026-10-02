import React from "react";
import { Sparkles } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data/products";
import { ProductCard } from "./ProductCard";

interface NewArrivalsSectionProps {
  products?: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const list = products || PRODUCTS;
  const newArrivals = list.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-[#F5F2EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-[#1A1A1A]/10">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#737373] font-medium mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>Latest Drops</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
              New Arrivals
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#525252] mt-2 sm:mt-0 max-w-sm">
            Fresh silhouettes and modern textures designed for seasonal comfort across Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {newArrivals.map((product) => (
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
