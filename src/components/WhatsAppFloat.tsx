import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { STORE_PHONE, STORE_WHATSAPP } from "../data/products";

export const WhatsAppFloat: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 group">
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-[#1A1A1A] text-[#FAF8F5] text-xs py-2 px-3.5 rounded-full shadow-lg border border-white/10 animate-in fade-in slide-in-from-right duration-300">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span>
            Need help? WhatsApp: <strong>{STORE_PHONE}</strong>
          </span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-white/50 hover:text-white ml-1 p-0.5 cursor-pointer"
            aria-label="Dismiss message"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <a
        href={`${STORE_WHATSAPP}?text=Assalam-o-Alaikum%20Farnova%2C%20I%20want%20to%20inquire%20about%20your%20men%E2%80%99s%20fashion%20collection.`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 cursor-pointer"
        aria-label="Chat with Farnova on WhatsApp"
        title={`Chat with Farnova on WhatsApp: ${STORE_PHONE}`}
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </div>
  );
};
