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
