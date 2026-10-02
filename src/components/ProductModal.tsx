import React, { useState } from "react";
import {
  X,
  Share2,
  Ruler,
  Minus,
  Plus,
  Check,
  MessageCircle,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { Product, ColorOption } from "../types";
import { formatPKR, getWhatsAppProductOrderUrl } from "../utils";
import { STORE_PHONE } from "../data/products";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    size: string,
    color: ColorOption,
    quantity: number
  ) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes.length > 0 ? product.sizes[0] : "Standard"
  );
  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    product.colors.length > 0
      ? product.colors[0]
      : { name: "Standard", hex: "#1A1A1A" }
  );
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const totalPrice = product.price * quantity;
  const whatsappUrl = getWhatsAppProductOrderUrl({
    product,
    price: product.price,
    size: selectedSize,
    color: selectedColor,
    quantity,
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#FAF8F5] text-[#1A1A1A] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-[#1A1A1A]/10 z-10 max-h-[92vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#1A1A1A] shadow-sm transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image & Badges */}
        <div className="md:w-1/2 bg-[#EFECE6] relative overflow-hidden flex flex-col justify-center min-h-[300px] md:min-h-[520px]">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center max-h-[360px] md:max-h-full"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
            <span className="bg-[#1A1A1A]/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded">
              {product.stockStatus}
            </span>
            <span className="bg-white/90 text-[#1A1A1A] text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded">
              SKU: {product.sku}
            </span>
          </div>
        </div>

        {/* Right Column: Product Config & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between max-h-[60vh] md:max-h-[92vh]">
          <div>
            {/* Header info & Share */}
            <div className="flex items-center justify-between text-xs text-[#737373] mb-2">
              <div className="flex items-center gap-1.5">
                <span className="uppercase tracking-widest font-semibold">
                  {product.category}
                </span>
                <span aria-hidden="true">·</span>
                <span>{product.subcategory}</span>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-[#737373] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                title="Share link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? "Link Copied" : "Share"}</span>
              </button>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] leading-tight mb-3">
              {product.name}
            </h2>

            {/* Price Box */}
            <div className="bg-white border border-[#1A1A1A]/8 p-3 rounded-lg mb-5 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono tabular-nums text-[#1A1A1A]">
                    PKR {formatPKR(totalPrice)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#8C8C8C] line-through font-mono tabular-nums">
                      PKR {formatPKR(product.originalPrice * quantity)}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#8C8C8C] block mt-0.5">
                  Sample price (editable placeholder) · Cash on Delivery available
                </span>
              </div>
              {quantity > 1 && (
                <span className="text-xs text-[#525252] font-mono">
                  PKR {formatPKR(product.price)} each
                </span>
              )}
            </div>

            <p className="text-sm text-[#525252] leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                    Select Color:{" "}
                    <span className="font-normal text-[#525252] capitalize">
                      {selectedColor.name}
                    </span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        selectedColor.name === c.name
                          ? "border-[#1A1A1A] bg-white text-[#1A1A1A] shadow-sm ring-1 ring-[#1A1A1A]"
                          : "border-[#1A1A1A]/15 bg-white/50 text-[#525252] hover:border-[#1A1A1A]/40"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                    Select Size:{" "}
                    <span className="font-normal text-[#525252]">{selectedSize}</span>
                  </label>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs text-[#737373] hover:text-[#1A1A1A] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                        selectedSize === s
                          ? "bg-[#1A1A1A] text-[#FAF8F5] border-[#1A1A1A] shadow-sm"
                          : "bg-white text-[#1A1A1A] border-[#1A1A1A]/15 hover:border-[#1A1A1A]/40"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {showSizeGuide && (
                  <div className="mt-3 p-3 bg-white border border-[#1A1A1A]/10 rounded-lg text-xs text-[#525252] animate-in fade-in duration-150">
                    <div className="font-semibold text-[#1A1A1A] mb-1">
                      Standard Pakistan Men&apos;s Sizing
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      All Farnova products conform to standard Pakistani &amp; international sizing standards. If you are between two sizes, we recommend ordering your larger size or asking us on WhatsApp for exact centimeter measurements.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6 flex items-center justify-between">
              <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                Quantity
              </label>
              <div className="flex items-center border border-[#1A1A1A]/20 rounded-lg bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-[#FAF8F5] text-[#1A1A1A] transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-1 text-sm font-semibold font-mono tabular-nums text-[#1A1A1A]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-[#FAF8F5] text-[#1A1A1A] transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Highlights & Material */}
            <div className="mb-6 pt-4 border-t border-[#1A1A1A]/10 text-xs">
              <div className="font-semibold text-[#1A1A1A] mb-2 uppercase tracking-wider">
                Highlights &amp; Composition
              </div>
              <ul className="space-y-1.5 text-[#525252]">
                <li className="flex items-start gap-2">
                  <span className="text-[#1A1A1A] font-medium">Material:</span>
                  <span>{product.material}</span>
                </li>
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#1A1A1A] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-[#1A1A1A]/10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-[0.98] cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Order on WhatsApp ({STORE_PHONE})</span>
            </a>

            <button
              onClick={handleAdd}
              className="w-full py-3 px-6 bg-[#1A1A1A] hover:bg-black text-[#FAF8F5] font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addedNotice ? "Added to Bag!" : "Add to Shopping Bag"}</span>
            </button>

            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-[#737373] text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#1A1A1A]" />
                <span>3-5 Days Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1A1A1A]" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-[#1A1A1A]" />
                <span>7-Day Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
