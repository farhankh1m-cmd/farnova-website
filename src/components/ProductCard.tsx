import React, { useState } from "react";
import { Eye, MessageCircle } from "lucide-react";
import { Product } from "../types";
import { formatPKR, getWhatsAppProductOrderUrl } from "../utils";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const selectedColor = product.colors[selectedColorIndex] || {
    name: "Standard",
    hex: "#1A1A1A",
  };

  const whatsappUrl = getWhatsAppProductOrderUrl({
    product,
    size: product.sizes[0] || "Standard",
    color: selectedColor,
    quantity: 1,
  });

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group cursor-pointer flex flex-col bg-white border border-[#1A1A1A]/8 rounded-xl overflow-hidden shadow-subtle hover:shadow-card transition-all duration-300 relative"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] bg-[#F2EFE9] overflow-hidden">
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#EAE6DF] text-[#737373] p-4 text-center">
            <span className="font-serif text-lg font-bold text-[#1A1A1A]">
              {product.name}
            </span>
            <span className="text-xs uppercase tracking-wider mt-1">
              {product.category}
            </span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-1.5 items-start">
          <span className="bg-[#FAF8F5]/95 backdrop-blur-sm text-[#1A1A1A] text-[9px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5 rounded shadow-xs">
            {product.stockStatus}
          </span>
          {product.isNewArrival && (
            <span className="bg-[#1A1A1A] text-[#FAF8F5] text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold px-1.5 sm:px-2 py-0.5 rounded shadow-xs">
              New Arrival
            </span>
          )}
        </div>

        {/* Hover overlay with quick view */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center justify-center gap-2 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="px-4 py-2 bg-white/95 text-[#1A1A1A] text-xs font-semibold rounded-lg shadow-md hover:bg-white flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-[#737373] mb-1 sm:mb-1.5">
            <span className="uppercase tracking-wider font-medium text-[9px] sm:text-[11px]">
              {product.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.subcategory}</span>
          </div>

          <h3 className="font-serif text-sm sm:text-lg font-semibold text-[#1A1A1A] group-hover:text-[#4A0E17] transition-colors leading-snug line-clamp-1 mb-1 sm:mb-1.5">
            {product.name}
          </h3>

          <p className="text-[11px] sm:text-xs text-[#666666] line-clamp-2 leading-relaxed mb-2 sm:mb-3">
            {product.shortDescription}
          </p>

          {/* Color swatches */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-[11px] text-[#737373]">Colors:</span>
              <div className="flex items-center gap-1 sm:gap-1.5">
                {product.colors.map((color, idx) => (
                  <button
                    key={color.name}
                    type="button"
                    title={color.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColorIndex(idx);
                    }}
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border transition-all cursor-pointer ${
                      selectedColorIndex === idx
                        ? "border-[#1A1A1A] ring-1 ring-[#1A1A1A] ring-offset-1 scale-110"
                        : "border-black/20 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#525252] truncate max-w-[70px] sm:max-w-[100px]">
                {selectedColor.name}
              </span>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#737373] mb-2 sm:mb-3">
              <span>Sizes:</span>
              <span className="text-[#1A1A1A] font-medium truncate">
                {product.sizes.slice(0, 2).join(", ")}
                {product.sizes.length > 2 ? ` +${product.sizes.length - 2}` : ""}
              </span>
            </div>
          )}
        </div>

        {/* Pricing and Action Buttons */}
        <div className="pt-2 sm:pt-3 border-t border-[#1A1A1A]/8 mt-auto">
          <div className="flex items-baseline justify-between mb-2 sm:mb-3">
            <div>
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-lg font-bold font-mono tabular-nums text-[#1A1A1A]">
                  PKR {formatPKR(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-[10px] sm:text-xs text-[#8C8C8C] line-through font-mono tabular-nums">
                    PKR {formatPKR(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-[9px] sm:text-[10px] text-[#8C8C8C] block truncate">
                Cash on Delivery
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              className="w-full py-2 sm:py-2.5 px-1 sm:px-2 bg-[#FAF8F5] hover:bg-[#EBE7DF] text-[#1A1A1A] border border-[#1A1A1A]/15 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer"
            >
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>Details</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full py-2 sm:py-2.5 px-1 sm:px-2 bg-[#25D366] hover:bg-[#20BD5A] text-white text-[11px] sm:text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1 sm:gap-1.5"
              title="Order directly on WhatsApp"
            >
              <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current shrink-0" />
              <span className="truncate">Order</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
