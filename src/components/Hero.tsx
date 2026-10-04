import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Camera,
  Check,
} from "lucide-react";
import { HERO_BANNER_IMAGE, STORE_PHONE, STORE_WHATSAPP } from "../data/products";
import { saveHeroImageToCloud, subscribeToCloudHero } from "../firebase";

interface HeroProps {
  onExplore: () => void;
  isAdmin?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, isAdmin = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [heroImage, setHeroImage] = useState<string>(() => {
    try {
      return localStorage.getItem("farnova_hero_image") || HERO_BANNER_IMAGE;
    } catch {
      return HERO_BANNER_IMAGE;
    }
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync hero image in real-time from Cloud Firestore
  useEffect(() => {
    const unsub = subscribeToCloudHero((cloudImg) => {
      if (cloudImg) {
        setHeroImage(cloudImg);
        try {
          localStorage.setItem("farnova_hero_image", cloudImg);
        } catch {
          // ignore storage error
        }
      }
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  // Handle direct file upload from user device (gallery/files)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setHeroImage(result);
        setImageLoaded(true);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);

        try {
          localStorage.setItem("farnova_hero_image", result);
        } catch {
          // ignore storage error
        }

        // Save to Cloud Firestore so all visitors globally see the exact photo
        saveHeroImageToCloud(result).catch((err) =>
          console.warn("Failed to save hero photo to cloud", err)
        );
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#18181A] text-[#FAF8F5]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px] items-stretch">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-16 lg:py-24 z-10">
            {/* Top-Left Branding Block (Embroidered Font & Subtext) */}
            <div className="mb-6 select-none">
              <div className="flex items-center">
                <svg
                  viewBox="0 0 286 46"
                  className="h-7 sm:h-8 w-auto overflow-visible"
                  aria-label="FARNOVA"
                  role="img"
                >
                  <defs>
                    {/* Embroidered thread satin texture gradient */}
                    <linearGradient id="threadGloss" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#141414" />
                      <stop offset="25%" stopColor="#333333" />
                      <stop offset="50%" stopColor="#4D4D4D" />
                      <stop offset="75%" stopColor="#242424" />
                      <stop offset="100%" stopColor="#0D0D0D" />
                    </linearGradient>
                    {/* Subtle thread relief & specular stitch edge */}
                    <filter id="embroideredStitch" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="1" stdDeviation="0.6" floodColor="#FFFFFF" floodOpacity="0.45" />
                      <feDropShadow dx="0" dy="-1" stdDeviation="0.6" floodColor="#000000" floodOpacity="0.85" />
                    </filter>
                  </defs>

                  {/* Base embroidered letterforms matching exact reference geometry */}
                  <g
                    stroke="url(#threadGloss)"
                    strokeWidth="6.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#embroideredStitch)"
                    fill="none"
                  >
                    {/* F */}
                    <path d="M 6 41 L 6 7 M 6 8.5 L 31 8.5 M 6 22 L 26 22" />
                    {/* A (chevron inverted V - strictly no crossbar) */}
                    <path d="M 43 41 L 58 7 L 73 41" />
                    {/* R */}
                    <path d="M 85 41 L 85 7 M 85 8.5 L 100 8.5 C 109 8.5 109 22 100 22 L 85 22 M 97 22 L 110 41" />
                    {/* N */}
                    <path d="M 122 41 L 122 7 M 122 8 L 147 40 M 147 7 L 147 41" />
                    {/* O */}
                    <ellipse cx="173" cy="24" rx="14.5" ry="17" />
                    {/* V */}
                    <path d="M 199 7 L 214 41 L 229 7" />
                    {/* A (chevron inverted V - strictly no crossbar) */}
                    <path d="M 240 41 L 255 7 L 270 41" />
                  </g>

                  {/* Embroidered thread spine highlight (stitch grain texture) */}
                  <g
                    stroke="#888888"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="2 1.5"
                    opacity="0.6"
                    fill="none"
                  >
                    {/* F */}
                    <path d="M 6 40 L 6 8 M 6 8.5 L 30 8.5 M 6 22 L 25 22" />
                    {/* A */}
                    <path d="M 44 40 L 58 8 L 72 40" />
                    {/* R */}
                    <path d="M 85 40 L 85 8 M 85 8.5 L 100 8.5 C 107.5 8.5 107.5 22 100 22 L 85 22 M 97 23 L 109 40" />
                    {/* N */}
                    <path d="M 122 40 L 122 8 M 123 9 L 146 39 M 147 8 L 147 40" />
                    {/* O */}
                    <ellipse cx="173" cy="24" rx="14.5" ry="17" />
                    {/* V */}
                    <path d="M 200 8 L 214 40 L 228 8" />
                    {/* A */}
                    <path d="M 241 40 L 255 8 L 269 40" />
                  </g>
                </svg>
              </div>

              {/* Sub text */}
              <p className="text-[11px] sm:text-xs tracking-[0.28em] text-[#A3A3A3] uppercase font-sans mt-1.5 font-medium">
                The Men&apos;s Fashion Store
              </p>
            </div>

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
          <div className="lg:col-span-6 relative min-h-[440px] sm:min-h-[520px] lg:min-h-full bg-[#18181A] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#121214] via-[#1A1A1C] to-[#202024]" />
            <img
              src={heroImage}
              alt="Farnova Men's Signature Collection"
              referrerPolicy="no-referrer"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover object-[center_20%] sm:object-center absolute inset-0 transition-all duration-700 ${
                imageLoaded ? "opacity-95 scale-100" : "opacity-0 scale-105"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#18181A] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#18181A] lg:via-[#18181A]/40 lg:to-transparent pointer-events-none" />

            {/* Direct 1-Click Upload Button to Set Exact User Photo (ADMIN ONLY) */}
            {isAdmin && (
              <div className="absolute top-4 right-4 z-30">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer shadow-2xl active:scale-95 ${
                    uploadSuccess
                      ? "bg-[#25D366] text-white border-[#25D366]"
                      : "bg-black/75 hover:bg-black text-[#FAF8F5] border-white/25 hover:border-[#D6C7B2]"
                  }`}
                  title="Select your exact WhatsApp photo from your device (Admin Only)"
                >
                  {uploadSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Exact Photo Applied!</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 text-[#D6C7B2]" />
                      <span>📸 Tap to Set Your Exact Photo</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="absolute bottom-6 right-6 bg-[#1A1A1A]/85 backdrop-blur-md border border-white/15 px-4 py-3 rounded-lg text-xs max-w-xs shadow-2xl hidden sm:block pointer-events-none">
              <span className="text-[#D6C7B2] font-semibold block text-[11px] uppercase tracking-wider">
                Farnova Signature
              </span>
              <span className="text-[#E5E5E5] font-light mt-0.5 block">
                Tailored menswear &amp; modern sartorial elegance
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
