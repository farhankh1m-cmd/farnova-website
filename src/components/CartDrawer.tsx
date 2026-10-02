import React from "react";
import { ShoppingBag, X, Truck, Trash2, Minus, Plus, MessageCircle } from "lucide-react";
import { CartItem } from "../types";
import { formatPKR, getWhatsAppCartOrderUrl } from "../utils";
import { STORE_PHONE } from "../data/products";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isFreeShipping = subtotal >= 5000;
  const shippingFee = isFreeShipping ? 0 : 250;
  const grandTotal = subtotal + shippingFee;
  const whatsappUrl = getWhatsAppCartOrderUrl(items);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] text-[#1A1A1A] shadow-2xl flex flex-col justify-between border-l border-[#1A1A1A]/10">
          {/* Header */}
          <div className="p-5 border-b border-[#1A1A1A]/10 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1A1A1A]" />
              <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
                Shopping Bag
              </h2>
              <span className="text-xs text-[#737373] font-mono">
                ({totalCount} items)
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-[#737373] hover:text-[#1A1A1A] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free delivery tracker */}
          <div className="px-5 py-2.5 bg-[#FAF8F5] border-b border-[#1A1A1A]/5 text-xs text-[#525252] flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#1A1A1A] shrink-0" />
            <span>
              {isFreeShipping ? (
                <strong className="text-emerald-700">
                  You unlocked FREE Delivery across Pakistan!
                </strong>
              ) : (
                <span>
                  Add PKR {formatPKR(5000 - subtotal)} more for Free Shipping
                </span>
              )}
            </span>
          </div>

          {/* Items List */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="w-12 h-12 text-[#A3A3A3] mx-auto mb-3 stroke-[1.5]" />
                <h3 className="font-serif text-base font-semibold text-[#1A1A1A] mb-1">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-[#737373] max-w-xs mx-auto mb-6">
                  Browse our shoes, watches, shirts, and pants to start building your wardrobe.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-lg hover:bg-black transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}-${idx}`}
                  className="bg-white p-3.5 rounded-xl border border-[#1A1A1A]/8 flex gap-3 shadow-2xs"
                >
                  <div className="w-20 h-20 bg-[#EFECE6] rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif text-sm font-semibold text-[#1A1A1A] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-[#A3A3A3] hover:text-red-600 p-0.5 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#737373] mt-0.5">
                        <span>
                          Size: <strong>{item.selectedSize}</strong>
                        </span>
                        <span className="mx-1">·</span>
                        <span>
                          Color: <strong>{item.selectedColor.name}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#1A1A1A]/20 rounded-md bg-[#FAF8F5] overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                          className="p-1 hover:bg-[#EBE7DF] text-[#1A1A1A] cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-semibold tabular-nums text-[#1A1A1A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="p-1 hover:bg-[#EBE7DF] text-[#1A1A1A] cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono text-xs font-bold tabular-nums text-[#1A1A1A]">
                        PKR {formatPKR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout info */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-[#1A1A1A]/10 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#737373]">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-[#1A1A1A]">
                    PKR {formatPKR(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-[#737373]">
                  <span>Shipping</span>
                  <span className="font-mono tabular-nums text-[#1A1A1A]">
                    {isFreeShipping ? "FREE" : "PKR 250 (COD)"}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-[#1A1A1A] pt-2 border-t border-[#1A1A1A]/8">
                  <span>Total Amount</span>
                  <span className="font-mono tabular-nums">
                    PKR {formatPKR(grandTotal)}
                  </span>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Order on WhatsApp ({STORE_PHONE})</span>
              </a>

              <p className="text-[11px] text-[#737373] text-center">
                Clicking opens WhatsApp with your pre-filled cart. No card or login required. Pay via Cash on Delivery.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
