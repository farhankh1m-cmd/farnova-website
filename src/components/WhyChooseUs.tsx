import React from "react";
import { Feather, Compass, Award, CheckCircle2 } from "lucide-react";
import { STORE_PHONE } from "../data/products";

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#1A1A1A] text-[#FAF8F5] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#FAF8F5_1px,transparent_1px)] [background-size:24px_24px]" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-block text-[#D6C7B2] text-xs uppercase tracking-[0.3em] font-semibold mb-4 border-b border-[#D6C7B2]/40 pb-1">
          Your Choice, A Good One.
        </div>
        
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight max-w-3xl mx-auto">
          Crafted for the Discerning Gentleman
        </h2>
        
        <p className="text-base sm:text-lg text-[#D1D1D1] font-light leading-relaxed max-w-3xl mx-auto mb-16">
          At <strong className="text-white font-medium">Farnova</strong>, we believe men’s fashion should be straightforward, distinguished, and accessible without compromise. Born with a singular mission to redefine men&apos;s wardrobe essentials in Pakistan, we merge classic tailored cuts with modern casual ease.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-white/10 pt-12">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <Feather className="w-6 h-6 text-[#D6C7B2] mb-3" />
            <h3 className="font-serif text-lg font-semibold text-white mb-2">
              Uncompromising Fabrics
            </h3>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              From combed long-staple cotton and Belgian flax linen to Italian micro-leathers, every piece is chosen for tactile durability in the local climate.
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <Compass className="w-6 h-6 text-[#D6C7B2] mb-3" />
            <h3 className="font-serif text-lg font-semibold text-white mb-2">
              Timeless Versatility
            </h3>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              We design modular menswear that transitions smoothly from corporate boardrooms in Karachi to weekend dinners in Lahore and Islamabad.
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <Award className="w-6 h-6 text-[#D6C7B2] mb-3" />
            <h3 className="font-serif text-lg font-semibold text-white mb-2">
              Direct-to-Customer Trust
            </h3>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Direct WhatsApp order confirmation, full Cash on Delivery nationwide, and transparent size support ensure you order with absolute confidence.
            </p>
          </div>
        </div>

        <div className="mt-14 inline-flex flex-wrap items-center justify-center gap-6 text-xs text-[#A3A3A3]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D6C7B2]" />
            <span>100% Cash on Delivery</span>
          </div>
          <span className="opacity-30">·</span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D6C7B2]" />
            <span>Verified Pakistan Delivery</span>
          </div>
          <span className="opacity-30">·</span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D6C7B2]" />
            <span>Dedicated WhatsApp Hotline: {STORE_PHONE}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
