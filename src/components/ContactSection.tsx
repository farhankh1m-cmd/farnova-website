import React, { useState } from "react";
import { MessageCircle, Truck, Clock, ShieldCheck, Send } from "lucide-react";
import { STORE_PHONE, STORE_WHATSAPP } from "../data/products";

export const ContactSection: React.FC = () => {
  const [topic, setTopic] = useState("Order Placement");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");

  const topics = [
    "Order Placement",
    "Size Guidance",
    "Custom Order",
    "Delivery Status",
    "Wholesale Inquiry",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Assalam-o-Alaikum Farnova,\n\nMy Name: ${name || "Customer"}\nCity: ${city || "Pakistan"}\nInquiry Topic: ${topic}\nQuestion/Details: ${message || "I would like to inquire about ordering."}`;
    const url = `${STORE_WHATSAPP}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-[#737373] font-medium mb-2">
            Get In Touch
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight mb-3">
            Contact Farnova
          </h2>
          <p className="text-sm text-[#525252] leading-relaxed">
            Have questions about product availability, sizing, or Cash on Delivery in your city? Reach out directly to our dedicated customer support team on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Support Card */}
          <div className="lg:col-span-5 bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#1A1A1A]/8">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/15 flex items-center justify-center text-[#25D366]">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="text-xs text-[#737373] uppercase tracking-wider block">
                  Official WhatsApp Orders
                </span>
                <span className="font-mono text-xl font-bold text-[#1A1A1A]">
                  {STORE_PHONE}
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-8 text-sm">
              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1A1A1A] font-medium">
                    Nationwide Cash on Delivery
                  </strong>
                  <span className="text-xs text-[#666666]">
                    Serving Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, Multan, Quetta, and all tehsils across Pakistan.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1A1A1A] font-medium">
                    Delivery Timeline
                  </strong>
                  <span className="text-xs text-[#666666]">
                    3 to 5 business days via tracked courier services (TCS, Leopards, Call Courier).
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1A1A1A] font-medium">
                    7-Day Size Exchange Guarantee
                  </strong>
                  <span className="text-xs text-[#666666]">
                    Wrong size? Simply message us on WhatsApp and our team will exchange it with zero friction.
                  </span>
                </div>
              </div>
            </div>

            <a
              href={`${STORE_WHATSAPP}?text=Assalam-o-Alaikum%20Farnova%2C%20I%20need%20assistance%20with%20an%20order.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 group cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Chat Now on WhatsApp</span>
            </a>
          </div>

          {/* Right Column: Pre-Filled WhatsApp Form */}
          <div className="lg:col-span-7 bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-card">
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">
              Send a Pre-Filled WhatsApp Message
            </h3>
            <p className="text-xs text-[#737373] mb-6">
              Fill in these quick details and click send. It will launch WhatsApp with your message already composed!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farhan Khan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#1A1A1A]/15 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                    City in Pakistan
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lahore / Karachi / Islamabad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#1A1A1A]/15 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Inquiry Topic
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {topics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                        topic === t
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                          : "bg-[#FAF8F5] text-[#525252] border-[#1A1A1A]/15 hover:border-[#1A1A1A]/40"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Message / Product Questions
                </label>
                <textarea
                  rows={3}
                  placeholder="Which shoes, watch, shirt, or pants are you interested in?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#1A1A1A]/15 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#1A1A1A] hover:bg-black text-[#FAF8F5] font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Open in WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
