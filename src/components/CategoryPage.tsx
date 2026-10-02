import React, { useState, useMemo } from "react";
import { ArrowLeft, ArrowUpDown } from "lucide-react";
import { CategoryId, Product, ColorOption } from "../types";
import { CATEGORIES, PRODUCTS } from "../data/products";
import { ProductCard } from "./ProductCard";

interface CategoryPageProps {
  categoryId: CategoryId;
  products?: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product, size?: string, color?: ColorOption) => void;
  onBackToHome: () => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categoryId,
  products,
  onSelectProduct,
  onAddToCart,
  onBackToHome,
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");

  const category = CATEGORIES.find((c) => c.id === categoryId);

  const filteredProducts = useMemo(() => {
    const source = products || PRODUCTS;
    let list = source.filter((p) => p.category === categoryId);

    if (selectedSubcategory !== "All") {
      list = list.filter(
        (p) => p.subcategory.toLowerCase() === selectedSubcategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "low-to-high":
        return [...list].sort((a, b) => a.price - b.price);
      case "high-to-low":
        return [...list].sort((a, b) => b.price - a.price);
      case "newest":
        return [...list].sort((a, b) => +!!b.isNewArrival - +!!a.isNewArrival);
      default:
        return [...list].sort((a, b) => +!!b.isFeatured - +!!a.isFeatured);
    }
  }, [categoryId, selectedSubcategory, searchQuery, sortBy]);

  if (!category) return null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Category Hero Banner */}
      <div className="relative bg-[#18181A] text-[#FAF8F5] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs text-[#D6C7B2] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <span className="text-white/30 text-xs">/</span>
            <span className="text-xs uppercase tracking-wider text-white/70">
              {category.name}
            </span>
          </div>

          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#D6C7B2] font-semibold mb-2">
              Farnova Men&apos;s Collection
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-[#D1D1D1] font-light leading-relaxed">
              {category.tagline}. High-grade materials, meticulous finishing, and quick WhatsApp ordering with nationwide Cash on Delivery.
            </p>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden lg:block overflow-hidden">
          <img
            src={category.image}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#18181A] to-transparent" />
        </div>
      </div>

      {/* Sticky Filters & Search Sub-header */}
      <div className="sticky top-20 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#1A1A1A]/10 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Subcategories Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {category.subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedSubcategory === sub
                    ? "bg-[#1A1A1A] text-[#FAF8F5] shadow-xs"
                    : "bg-white/80 text-[#525252] hover:bg-white hover:text-[#1A1A1A] border border-[#1A1A1A]/10"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Search within category and Sort Dropdown */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder={`Search ${category.name.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-[#1A1A1A]/15 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A] placeholder:text-[#8C8C8C] w-40 sm:w-52"
            />

            <div className="flex items-center gap-1.5 bg-white border border-[#1A1A1A]/15 rounded-lg px-2.5 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#737373]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[#1A1A1A] focus:outline-none cursor-pointer text-xs"
              >
                <option value="featured">Featured</option>
                <option value="newest">New Arrivals</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between text-xs text-[#737373] mb-6">
          <span>
            Showing <strong className="text-[#1A1A1A]">{filteredProducts.length}</strong> styles in {category.name}
            {selectedSubcategory === "All" ? "" : ` (${selectedSubcategory})`}
          </span>
          <span className="text-[11px] text-[#8C8C8C]">
            All prices in PKR (Cash on Delivery)
          </span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onViewDetails={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white border border-[#1A1A1A]/8 rounded-xl p-8 max-w-md mx-auto">
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A] mb-2">
              No styles found
            </h3>
            <p className="text-xs text-[#737373] mb-6">
              We couldn&apos;t find any products matching your current filters. Try changing your search query or selecting &quot;All&quot;.
            </p>
            <button
              onClick={() => {
                setSelectedSubcategory("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
