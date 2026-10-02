import React, { useState } from "react";
import { ArrowRight, MessageCircle, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { HERO_BANNER_IMAGE, STORE_PHONE, STORE_WHATSAPP } from "../data/products";

interface HeroProps {
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#18181A] text-[#FAF8F5]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px] items-stretch">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-16 lg:py-24 z-10">
            <div className="flex items-center gap-2 mb-4 text-[#D6C7B2] text-xs uppercase tracking-[0.25em] font-medium">
              <span>Farnova Collection</span>
              <span aria-hidden="true" className="opacity-50">·</span>
              <span>Your Choice, A Good One.</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF8F5] leading-[1.12] mb-6 max-w-xl text-balance">
              Upgrade Your Style with Farnova
            </h1>

            <p className="text-base sm:text-lg text-[#D1D1D1] font-light leading-relaxed mb-8 max-w-lg">
              Discover everyday essentials and timeless styles for the modern man. Handcrafted footwear, precision watches, tailored shirts, and custom-feel chinos crafted for unmatched refinement.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                onClick={onExplore}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FAF8F5] text-[#1A1A1A] font-semibold text-sm rounded-lg hover:bg-[#EBE7DF] transition-all duration-200 active:scale-[0.98] shadow-lg group cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href={`${STORE_WHATSAPP}?text=Assalam-o-Alaikum%20Farnova%2C%20I%20would%20like%20to%20explore%20the%20latest%20men%E2%80%99s%20collection.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#FAF8F5] font-medium text-sm rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp Catalog ({STORE_PHONE})</span>
              </a>
            </div>

            {/* Badges / Guarantees */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#A3A3A3]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#D6C7B2] shrink-0" />
                <span>Cash on Delivery Pakistan-wide</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D6C7B2] shrink-0" />
                <span>Authentic Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#D6C7B2] shrink-0" />
                <span>7-Day Easy Size Exchange</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-6 relative min-h-[360px] sm:min-h-[460px] lg:min-h-full bg-[#1C1C1E] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#141416] via-[#232326] to-[#1A1A1C]" />
            <img
              src={HERO_BANNER_IMAGE}
              alt="Farnova Men's Fashion Editorial Campaign"
              referrerPolicy="no-referrer"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-700 ${
                imageLoaded ? "opacity-90" : "opacity-0"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#18181A] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#18181A] lg:via-transparent lg:to-transparent" />
            
            <div className="absolute bottom-6 right-6 bg-[#1A1A1A]/85 backdrop-blur-md border border-white/15 px-4 py-3 rounded-lg text-xs max-w-xs shadow-2xl hidden sm:block">
              <span className="text-[#D6C7B2] font-semibold block text-[11px] uppercase tracking-wider">
                New Season Signature
              </span>
              <span className="text-[#E5E5E5] font-light mt-0.5 block">
                Tailored for the modern Pakistani wardrobe
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
