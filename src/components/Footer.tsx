import React from "react";
import { MessageCircle, Instagram, Facebook, Lock, ShieldCheck } from "lucide-react";
import { CategoryId } from "../types";
import { STORE_PHONE, STORE_WHATSAPP } from "../data/products";

interface FooterProps {
  onSelectCategory: (id: CategoryId) => void;
  onNavigateHome: () => void;
  onNavigateContact: () => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigateHome,
  onNavigateContact,
  isAdmin = false,
  onOpenAdminLogin,
}) => {
  return (
    <footer className="bg-[#141416] text-[#FAF8F5] border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={onNavigateHome}
              className="text-left focus:outline-none cursor-pointer"
            >
              <span className="font-serif text-3xl font-bold tracking-[0.2em] text-[#FAF8F5] block">
                FARNOVA
              </span>
              <span className="text-xs tracking-[0.25em] text-[#A3A3A3] uppercase block mt-1">
                The Men&apos;s Fashion Store
              </span>
            </button>

            <p className="text-xs sm:text-sm text-[#A3A3A3] max-w-sm leading-relaxed font-light">
              &ldquo;Your Choice, A Good One.&rdquo; Providing premium, modern essentials for the Pakistani man. Handcrafted footwear, horological precision, tailored shirts, and custom-feel trousers.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={`${STORE_WHATSAPP}?text=Assalam-o-Alaikum%20Farnova%2C%20I%20want%20to%20connect.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-xs font-medium text-[#FAF8F5] rounded-lg transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp: {STORE_PHONE}</span>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A3A3A3]">
              <li>
                <button
                  onClick={() => onSelectCategory("shoes")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Men&apos;s Shoes &amp; Loafers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("watches")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Classic &amp; Casual Watches
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("shirts")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Oxford &amp; Linen Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("pants")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Chinos &amp; Raw Denim Jeans
                </button>
              </li>
            </ul>
          </div>

          {/* Order Assistance */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-white mb-4">
              Order Assistance
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A3A3A3]">
              <li>
                <button
                  onClick={onNavigateContact}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Cash on Delivery Info
                </button>
              </li>
              <li>
                <a
                  href={`${STORE_WHATSAPP}?text=Assalam-o-Alaikum%2C%20I%20need%20size%20guidance%20for%20an%20order.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Size Consultation via WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`${STORE_WHATSAPP}?text=Assalam-o-Alaikum%2C%20I%20want%20to%20track%20my%20courier%20parcel.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Track Order (TCS / Leopards)
                </a>
              </li>
              <li>
                <a
                  href={`${STORE_WHATSAPP}?text=Assalam-o-Alaikum%2C%20I%20need%20to%20exchange%20a%20size.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  7-Day Size Exchange
                </a>
              </li>
            </ul>
          </div>

          {/* Delivery & Socials */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-white mb-4">
              Nationwide Delivery
            </h4>
            <p className="text-xs text-[#A3A3A3] leading-relaxed mb-4">
              Delivering to Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Peshawar, Multan, Sialkot, Gujranwala, and across Pakistan.
            </p>
            <div className="flex items-center gap-3 text-[#A3A3A3]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors"
                aria-label="Farnova Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors"
                aria-label="Farnova Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={STORE_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 flex items-center justify-center text-[#25D366] transition-colors"
                aria-label="Farnova WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#737373] gap-4">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Farnova. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <span>The Men&apos;s Fashion Store · Pakistan</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Payment Method: Cash on Delivery (COD)</span>
            <span aria-hidden="true">·</span>
            <span>WhatsApp Ordering System</span>
            {onOpenAdminLogin && (
              <>
                <span aria-hidden="true">·</span>
                <button
                  onClick={onOpenAdminLogin}
                  className="flex items-center gap-1 hover:text-[#D6C7B2] transition-colors cursor-pointer text-[11px] underline opacity-70 hover:opacity-100"
                  title="Store Owner Portal"
                >
                  {isAdmin ? (
                    <>
                      <ShieldCheck className="w-3 h-3 text-[#25D366]" />
                      <span className="text-[#25D366]">Admin Active</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-[#A3A3A3]" />
                      <span>Admin Login</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
