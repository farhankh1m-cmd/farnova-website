import React, { useState, useMemo } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data/products";
import { formatPKR } from "../utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  products?: Product[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  products,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const results = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    const source = products || PRODUCTS;
    return source.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  const popularSearches = [
    "Leather Sneakers",
    "Penny Loafers",
    "Chronograph Watch",
    "Oxford Shirt",
    "Tailored Chinos",
    "Selvedge Jeans",
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-6 md:p-10 flex items-start justify-center animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#FAF8F5] text-[#1A1A1A] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#1A1A1A]/10 overflow-hidden z-10 mt-8 sm:mt-16">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#1A1A1A]/10 bg-white flex items-center gap-3">
          <Search className="w-5 h-5 text-[#737373] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search shoes, watches, shirts, pants, loafers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-[#1A1A1A] placeholder:text-[#8C8C8C] focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="p-1 text-[#737373] hover:text-[#1A1A1A] cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] text-[#525252] hover:text-[#1A1A1A] transition-colors ml-1 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          {searchTerm.trim() === "" ? (
            <div className="text-center py-8">
              <span className="text-xs uppercase tracking-wider text-[#737373] block mb-3">
                Suggested Popular Searches
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-3 py-1.5 bg-white border border-[#1A1A1A]/10 rounded-lg text-xs text-[#525252] hover:text-[#1A1A1A] hover:border-[#1A1A1A]/30 transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
                No products found for &quot;{searchTerm}&quot;
              </p>
              <p className="text-xs text-[#737373]">
                Try searching for shoes, watches, shirts, or pants.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-[#737373] px-1 mb-2">
                Found {results.length} results
              </div>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="group flex items-center gap-4 p-3 bg-white hover:bg-[#F2EFE9] border border-[#1A1A1A]/8 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="w-14 h-14 rounded-lg bg-[#EFECE6] overflow-hidden shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#737373]">
                      <span className="uppercase tracking-wider font-semibold">
                        {product.category}
                      </span>
                      <span>·</span>
                      <span>{product.subcategory}</span>
                    </div>

                    <h4 className="font-serif text-sm font-semibold text-[#1A1A1A] truncate group-hover:text-[#4A0E17]">
                      {product.name}
                    </h4>

                    <span className="text-xs font-mono font-bold text-[#1A1A1A] tabular-nums">
                      PKR {formatPKR(product.price)}
                    </span>
                  </div>

                  <div className="p-2 text-[#737373] group-hover:text-[#1A1A1A] group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
