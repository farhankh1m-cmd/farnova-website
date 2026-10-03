import React, { useState } from "react";
import { MessageCircle, Search, ShoppingBag, Menu, X, Plus, ShieldCheck } from "lucide-react";
import { CategoryId } from "../types";
import { STORE_PHONE, STORE_WHATSAPP } from "../data/products";

interface HeaderProps {
  activeCategory: CategoryId | "all";
  onSelectCategory: (id: CategoryId) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onNavigateHome: () => void;
  onNavigateContact: () => void;
  onOpenAddProduct: () => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  cartCount,
  onOpenCart,
  onOpenSearch,
  onNavigateHome,
  onNavigateContact,
  onOpenAddProduct,
  isAdmin,
  onOpenAdminLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; id: CategoryId }[] = [
    { label: "Shoes", id: "shoes" },
    { label: "Watches", id: "watches" },
    { label: "Shirts", id: "shirts" },
    { label: "Pants", id: "pants" },
    { label: "Bundle Deals 🎁", id: "bundles" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#1A1A1A]/10 transition-all duration-200">
      {/* Top Banner */}
      <div className="bg-[#1A1A1A] text-[#FAF8F5] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs tracking-wider">
            <span className="font-semibold text-[#D6C7B2]">FARNOVA PAKISTAN</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>Cash on Delivery Nationwide</span>
            <span aria-hidden="true" className="hidden md:inline opacity-40">·</span>
            <span className="hidden md:inline">Free Delivery Above PKR 5,000</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            {isAdmin && (
              <button
                onClick={onOpenAdminLogin}
                className="hidden sm:inline-flex items-center gap-1 text-[#D6C7B2] hover:underline cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Active (Farhan)</span>
              </button>
            )}

            <a
              href={`${STORE_WHATSAPP}?text=Assalam-o-Alaikum%2C%20I%20need%20help%20ordering%20from%20Farnova.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#D6C7B2] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp Order:</span>
              <span className="font-medium font-mono">{STORE_PHONE}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                onNavigateHome();
                setMobileMenuOpen(false);
              }}
              className="group text-left focus:outline-none cursor-pointer"
            >
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.18em] text-[#1A1A1A] block leading-none">
                FARNOVA
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#737373] uppercase font-sans block mt-1">
                The Men&apos;s Fashion Store
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <button
              onClick={() => onNavigateHome()}
              className={`transition-colors py-2 relative hover:text-[#1A1A1A] cursor-pointer ${
                activeCategory === "all"
                  ? 'text-[#1A1A1A] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#1A1A1A]'
                  : "text-[#666666]"
              }`}
            >
              Home
            </button>

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onSelectCategory(link.id)}
                className={`transition-colors py-2 relative hover:text-[#1A1A1A] cursor-pointer ${
                  activeCategory === link.id
                    ? 'text-[#1A1A1A] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#1A1A1A]'
                    : "text-[#666666]"
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={onNavigateContact}
              className="transition-colors py-2 relative text-[#666666] hover:text-[#1A1A1A] cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Actions: Search, Add Product (ONLY FOR ADMIN), WhatsApp, Bag, Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* ONLY ADMIN SEES THIS BUTTON */}
            {isAdmin && (
              <button
                onClick={onOpenAddProduct}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1A1A1A] bg-[#EAE6DF] hover:bg-[#DDD8CF] border border-[#1A1A1A]/15 rounded-lg transition-colors cursor-pointer shadow-sm"
                title="Post new product (Admin Only)"
              >
                <Plus className="w-3.5 h-3.5 text-[#B8986B]" />
                <span className="hidden sm:inline">+ Post Item</span>
              </button>
            )}

            <button
              onClick={onOpenSearch}
              className="p-2.5 text-[#1A1A1A] hover:bg-[#1A1A1A]/5 rounded-full transition-colors cursor-pointer"
              aria-label="Search products"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            <a
              href={`${STORE_WHATSAPP}?text=Assalam-o-Alaikum%2C%20I%20want%20to%20inquire%20about%20Farnova%20products.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#1A1A1A] bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 rounded-lg transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-[#1EBE5D]" />
              <span>WhatsApp Us</span>
            </a>

            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-[#1A1A1A] hover:bg-[#1A1A1A]/5 rounded-full transition-colors cursor-pointer"
              aria-label={`View shopping bag (${cartCount} items)`}
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-[#1A1A1A] text-[#FAF8F5] text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-[#1A1A1A] hover:bg-[#1A1A1A]/5 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#1A1A1A]/10 px-4 pt-3 pb-6 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => {
                onNavigateHome();
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 text-base font-medium rounded-md ${
                activeCategory === "all"
                  ? "bg-[#1A1A1A] text-[#FAF8F5]"
                  : "text-[#1A1A1A] hover:bg-[#1A1A1A]/5"
              }`}
            >
              Home
            </button>

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onSelectCategory(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-base font-medium rounded-md ${
                  activeCategory === link.id
                    ? "bg-[#1A1A1A] text-[#FAF8F5]"
                    : "text-[#1A1A1A] hover:bg-[#1A1A1A]/5"
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => {
                onNavigateContact();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-base font-medium text-[#1A1A1A] hover:bg-[#1A1A1A]/5 rounded-md"
            >
              Contact &amp; Delivery Info
            </button>

            <div className="pt-3 border-t border-[#1A1A1A]/10 space-y-2">
              {/* ONLY ADMIN SEES THIS ON MOBILE */}
              {isAdmin && (
                <button
                  onClick={() => {
                    onOpenAddProduct();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1A1A1A] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-black transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#D6C7B2]" />
                  <span>+ Post New Product (Admin Only)</span>
                </button>
              )}

              <a
                href={`${STORE_WHATSAPP}?text=Assalam-o-Alaikum%2C%20I%20want%20to%20order%20from%20Farnova.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-[#20BD5A] transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Order on WhatsApp ({STORE_PHONE})</span>
              </a>

              {isAdmin && (
                <button
                  onClick={() => {
                    onOpenAdminLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-xs text-[#666666] py-1 underline cursor-pointer"
                >
                  Admin Settings (Logged in as Farhan)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
