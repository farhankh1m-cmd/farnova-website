import React, { useState, useMemo } from "react";
import {
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Check,
  Plus,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Edit2,
  Trash2,
  Package,
} from "lucide-react";
import { Product, BundleDeal, CustomBundleDiscounts, ColorOption } from "../types";
import { STORE_PHONE, STORE_WHATSAPP } from "../data/products";

interface BundleDealsPageProps {
  bundles: BundleDeal[];
  allProducts: Product[];
  bundleDiscounts: CustomBundleDiscounts;
  isAdmin: boolean;
  onAddToCart: (
    product: Product,
    selectedSize?: string,
    selectedColor?: ColorOption,
    quantity?: number,
    customBundleInfo?: { isBundle: boolean; includedItems: string[] }
  ) => void;
  onBackToHome: () => void;
  onEditBundle?: (bundle: BundleDeal) => void;
  onDeleteBundle?: (bundleId: string) => void;
  onOpenCreateBundle?: () => void;
}

export const BundleDealsPage: React.FC<BundleDealsPageProps> = ({
  bundles,
  allProducts,
  bundleDiscounts,
  isAdmin,
  onAddToCart,
  onBackToHome,
  onEditBundle,
  onDeleteBundle,
  onOpenCreateBundle,
}) => {
  // Build Your Own Bundle State
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [customFilterCategory, setCustomFilterCategory] = useState<string>("all");
  const [addedCustomSuccess, setAddedCustomSuccess] = useState(false);
  const [addedBundleId, setAddedBundleId] = useState<string | null>(null);

  // Filter out any bundle items themselves from the single products pool
  const singleProducts = useMemo(() => {
    return allProducts.filter((p) => p.category !== "bundles");
  }, [allProducts]);

  const filteredSingleProducts = useMemo(() => {
    if (customFilterCategory === "all") return singleProducts;
    return singleProducts.filter((p) => p.category === customFilterCategory);
  }, [singleProducts, customFilterCategory]);

  const toggleSelectProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const selectedProducts = useMemo(() => {
    return singleProducts.filter((p) => selectedProductIds.includes(p.id));
  }, [singleProducts, selectedProductIds]);

  // Dynamic live calculation based on ADMIN-SET discounts
  const customBundleCalculation = useMemo(() => {
    const count = selectedProducts.length;
    const originalTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);

    let discountPercent = 0;
    if (count === 2) {
      discountPercent = bundleDiscounts.twoItems;
    } else if (count === 3) {
      discountPercent = bundleDiscounts.threeItems;
    } else if (count >= 4) {
      discountPercent = bundleDiscounts.fourItems;
    }

    const discountAmount = Math.round(originalTotal * (discountPercent / 100));
    const finalOfferPrice = Math.max(0, originalTotal - discountAmount);

    return {
      count,
      originalTotal,
      discountPercent,
      discountAmount,
      finalOfferPrice,
      isEligible: count >= 2,
    };
  }, [selectedProducts, bundleDiscounts]);

  // Handle Add to Cart for Admin-Curated Bundle
  const handleAddCuratedBundleToCart = (bundle: BundleDeal) => {
    // Create an adapter Product representing the bundle
    const bundleProduct: Product = {
      id: bundle.id,
      name: `🎁 Bundle: ${bundle.title}`,
      sku: `FN-BDL-${bundle.id.slice(0, 6)}`,
      category: "bundles",
      subcategory: "Curated Set",
      price: bundle.offerPrice,
      originalPrice: bundle.originalPrice,
      image: bundle.image,
      shortDescription: `Curated ${bundle.includedProductNames.length}-piece Farnova bundle.`,
      description: bundle.description || `Includes: ${bundle.includedProductNames.join(", ")}`,
      features: bundle.includedProductNames,
      sizes: ["Standard Set"],
      colors: [{ name: "Curated Set", hex: "#B8986B" }],
      stockStatus: "In Stock",
      isFeatured: true,
      isNewArrival: false,
      material: "Premium Curated Ensemble",
      rating: 5.0,
      reviewCount: 1,
    };

    onAddToCart(
      bundleProduct,
      "Standard Set",
      { name: "Curated Set", hex: "#B8986B" },
      1,
      { isBundle: true, includedItems: bundle.includedProductNames }
    );

    setAddedBundleId(bundle.id);
    setTimeout(() => setAddedBundleId(null), 2500);
  };

  // Handle Add to Cart for Custom Built Bundle
  const handleAddCustomBundleToCart = () => {
    if (!customBundleCalculation.isEligible) return;

    const names = selectedProducts.map((p) => p.name);
    const bundleProduct: Product = {
      id: `custom-bundle-${Date.now()}`,
      name: `🎁 Custom Outfit Bundle (${selectedProducts.length} Items)`,
      sku: `FN-CUST-${Date.now().toString().slice(-6)}`,
      category: "bundles",
      subcategory: "Custom Build",
      price: customBundleCalculation.finalOfferPrice,
      originalPrice: customBundleCalculation.originalTotal,
      image: selectedProducts[0]?.image || "",
      shortDescription: `Custom ${selectedProducts.length}-piece bundle curated by customer.`,
      description: `Includes: ${names.join(", ")}`,
      features: names,
      sizes: ["Custom Sizes"],
      colors: [{ name: "Custom Mix", hex: "#1A1A1A" }],
      stockStatus: "In Stock",
      isFeatured: false,
      isNewArrival: false,
      material: "Mixed Curated Collection",
      rating: 5.0,
      reviewCount: 1,
    };

    onAddToCart(
      bundleProduct,
      "Custom Sizes",
      { name: "Custom Mix", hex: "#1A1A1A" },
      1,
      { isBundle: true, includedItems: names }
    );

    setAddedCustomSuccess(true);
    setTimeout(() => setAddedCustomSuccess(false), 3000);
  };

  // Format WhatsApp Link for Curated Bundle
  const getBundleWhatsAppUrl = (bundle: BundleDeal) => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Farnova, I would like to order the BUNDLE DEAL:\n\n*${bundle.title}*\n• Price: PKR ${bundle.offerPrice.toLocaleString()} (Was PKR ${bundle.originalPrice.toLocaleString()})\n• Badge: ${bundle.discountBadge}\n• Included Items:\n${bundle.includedProductNames.map((n) => `  - ${n}`).join("\n")}\n\nPlease guide me on sizes and Cash on Delivery.`
    );
    return `${STORE_WHATSAPP}?text=${text}`;
  };

  // Format WhatsApp Link for Custom Built Bundle
  const getCustomBundleWhatsAppUrl = () => {
    const names = selectedProducts.map((p) => `  - ${p.name} (PKR ${p.price.toLocaleString()})`).join("\n");
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Farnova, I have built a CUSTOM BUNDLE on your website:\n\n*Custom ${selectedProducts.length}-Piece Bundle*\n${names}\n\n• Original Total: PKR ${customBundleCalculation.originalTotal.toLocaleString()}\n• Bundle Discount: ${customBundleCalculation.discountPercent}% OFF (-PKR ${customBundleCalculation.discountAmount.toLocaleString()})\n• Final Offer Price: *PKR ${customBundleCalculation.finalOfferPrice.toLocaleString()}*\n\nPlease confirm availability and Cash on Delivery delivery.`
    );
    return `${STORE_WHATSAPP}?text=${text}`;
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      {/* Top Breadcrumb & Hero */}
      <div className="bg-[#18181A] text-[#FAF8F5] py-12 sm:py-16 border-b border-white/10 relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#D6C7B2]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#D6C7B2] hover:text-white transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#D6C7B2] font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated Wardrobe Savings · 100% Value</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl">
                Farnova Bundle Deals 🎁
              </h1>
              <p className="text-sm sm:text-base text-[#D1D1D1] font-light mt-3 max-w-2xl leading-relaxed">
                Complete your drip with curated outfits or build your own bespoke combo. Unlock exclusive package pricing on shoes, watches, shirts, and pants.
              </p>
            </div>

            {isAdmin && onOpenCreateBundle && (
              <button
                onClick={onOpenCreateBundle}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#D6C7B2] hover:bg-[#C5B39C] text-[#1A1A1A] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer whitespace-nowrap self-start md:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create Bundle Deal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 space-y-16 sm:space-y-24">
        {/* ========================================================
            PART 3: BUILD YOUR OWN BUNDLE SECTION
        ======================================================== */}
        <section className="bg-white border border-[#1A1A1A]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#1A1A1A]/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] text-[#FAF8F5] rounded-full text-[11px] font-semibold tracking-wider uppercase mb-3">
                <span>🎁 CUSTOM DRIP BUILDER</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                Build Your Own Bundle — Choose Any 2+ Items
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] mt-1 max-w-xl">
                Select any mix of shoes, shirts, pants, or watches. Tiered package discounts apply automatically:
              </p>
            </div>

            {/* Admin-Configured Tier Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <div className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                selectedProducts.length === 2
                  ? "bg-[#1A1A1A] text-white border-[#1A1A1A] scale-105"
                  : "bg-[#FAF8F5] text-[#1A1A1A] border-[#1A1A1A]/15"
              }`}>
                2 Items: <span className="text-[#B8986B] font-bold">{bundleDiscounts.twoItems}% OFF</span>
              </div>
              <div className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                selectedProducts.length === 3
                  ? "bg-[#1A1A1A] text-white border-[#1A1A1A] scale-105"
                  : "bg-[#FAF8F5] text-[#1A1A1A] border-[#1A1A1A]/15"
              }`}>
                3 Items: <span className="text-[#B8986B] font-bold">{bundleDiscounts.threeItems}% OFF</span>
              </div>
              <div className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                selectedProducts.length >= 4
                  ? "bg-[#1A1A1A] text-white border-[#1A1A1A] scale-105"
                  : "bg-[#FAF8F5] text-[#1A1A1A] border-[#1A1A1A]/15"
              }`}>
                4+ Items: <span className="text-[#B8986B] font-bold">{bundleDiscounts.fourItems}% OFF</span>
              </div>
            </div>
          </div>

          {/* Category Filter Pills for Custom Builder */}
          <div className="py-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: "All Items" },
              { id: "shoes", label: "Shoes & Loafers" },
              { id: "shirts", label: "Shirts" },
              { id: "pants", label: "Pants & Chinos" },
              { id: "watches", label: "Watches" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCustomFilterCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  customFilterCategory === cat.id
                    ? "bg-[#1A1A1A] text-white shadow-sm"
                    : "bg-[#F3EFEA] text-[#555555] hover:bg-[#EAE5DE]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid of Products for Custom Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 max-h-[520px] overflow-y-auto p-1 pr-2 no-scrollbar">
            {filteredSingleProducts.map((product) => {
              const isSelected = selectedProductIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => toggleSelectProduct(product.id)}
                  className={`relative group rounded-xl p-2.5 sm:p-3 border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#FAF8F5] border-[#1A1A1A] ring-2 ring-[#1A1A1A] shadow-md"
                      : "bg-white border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30 hover:shadow-subtle"
                  }`}
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-[#EFECE6] mb-2.5">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Checkbox badge */}
                    <div
                      className={`absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center transition-colors shadow-sm ${
                        isSelected
                          ? "bg-[#1A1A1A] text-white"
                          : "bg-white/90 text-[#999999] border border-black/10 group-hover:border-black/30"
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>

                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] uppercase font-semibold px-2 py-0.5 rounded">
                      {product.category}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-[#1A1A1A] line-clamp-1 group-hover:text-[#B8986B] transition-colors">
                      {product.name}
                    </h4>
                    <div className="text-xs font-bold text-[#1A1A1A] mt-1">
                      PKR {product.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky / Live Custom Bundle Bottom Calculation Bar */}
          <div className="mt-8 pt-6 border-t border-[#1A1A1A]/10 bg-[#FAF8F5] rounded-xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                  Your Custom Bundle:
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  customBundleCalculation.isEligible
                    ? "bg-[#25D366]/20 text-[#1EBE5D]"
                    : "bg-[#1A1A1A]/10 text-[#666666]"
                }`}>
                  {selectedProducts.length} Items Selected
                </span>
              </div>

              {customBundleCalculation.isEligible ? (
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-xs text-[#737373] line-through">
                    PKR {customBundleCalculation.originalTotal.toLocaleString()}
                  </span>
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
                    PKR {customBundleCalculation.finalOfferPrice.toLocaleString()}
                  </span>
                  <span className="px-2.5 py-0.5 bg-[#B8986B] text-white text-xs font-bold rounded-md uppercase">
                    SAVE {customBundleCalculation.discountPercent}%
                  </span>
                </div>
              ) : (
                <p className="text-xs text-[#737373]">
                  Select {2 - selectedProducts.length} more item{selectedProducts.length === 1 ? "" : "s"} to unlock package discount!
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                disabled={!customBundleCalculation.isEligible}
                onClick={handleAddCustomBundleToCart}
                className={`flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer ${
                  customBundleCalculation.isEligible
                    ? addedCustomSuccess
                      ? "bg-[#25D366] text-white"
                      : "bg-[#1A1A1A] hover:bg-black text-[#FAF8F5]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                }`}
              >
                {addedCustomSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Custom Bundle to Bag</span>
                  </>
                )}
              </button>

              {customBundleCalculation.isEligible && (
                <a
                  href={getCustomBundleWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order on WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================
            PART 2: ADMIN CURATED BUNDLES SECTION
        ======================================================== */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1A1A1A]/10 pb-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[#737373] font-medium mb-1.5">
                Ready-to-Wear Sets
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                Curated Signature Bundles
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#525252] max-w-md">
              Complete head-to-toe styling hand-picked by Farnova experts. High-impact formal and weekend drip at exclusive package pricing.
            </p>
          </div>

          {bundles.length === 0 ? (
            <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
              <Package className="w-12 h-12 text-[#A3A3A3] mx-auto stroke-1" />
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                No Bundles Created Yet
              </h3>
              <p className="text-xs text-[#666666]">
                Admin can create pre-curated bundles from the Admin Panel to display here.
              </p>
              {isAdmin && onOpenCreateBundle && (
                <button
                  onClick={onOpenCreateBundle}
                  className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold rounded-lg hover:bg-black cursor-pointer"
                >
                  Create First Bundle Deal
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {bundles.map((bundle) => {
                const isJustAdded = addedBundleId === bundle.id;

                return (
                  <div
                    key={bundle.id}
                    className="bg-white border border-[#1A1A1A]/10 rounded-2xl overflow-hidden shadow-subtle hover:shadow-card transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Bundle Image & Badge */}
                      <div className="relative aspect-[4/3] bg-[#EFECE6] overflow-hidden">
                        <img
                          src={bundle.image}
                          alt={bundle.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                        {/* Admin Entered Discount Badge */}
                        <div className="absolute top-3 left-3 bg-[#B8986B] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-md flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          <span>{bundle.discountBadge}</span>
                        </div>

                        {/* Admin Action Buttons on Card */}
                        {isAdmin && (
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                            {onEditBundle && (
                              <button
                                onClick={() => onEditBundle(bundle)}
                                className="p-2 bg-black/75 hover:bg-black text-white rounded-lg transition-colors cursor-pointer shadow-md"
                                title="Edit Bundle Prices / Title"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-[#D6C7B2]" />
                              </button>
                            )}
                            {onDeleteBundle && (
                              <button
                                onClick={() => onDeleteBundle(bundle.id)}
                                className="p-2 bg-black/75 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer shadow-md"
                                title="Delete Bundle"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#D6C7B2]">
                            Curated Combo Pack
                          </div>
                          <h3 className="font-serif text-xl font-bold tracking-tight text-white drop-shadow-sm">
                            {bundle.title}
                          </h3>
                        </div>
                      </div>

                      {/* Included Items Checklist */}
                      <div className="p-5 sm:p-6 space-y-4">
                        <div className="space-y-2">
                          <div className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
                            Included in this Bundle ({bundle.includedProductNames.length} Items):
                          </div>
                          <ul className="space-y-1.5">
                            {bundle.includedProductNames.map((name, idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-2 text-xs text-[#262626] font-medium"
                              >
                                <span className="w-4 h-4 rounded-full bg-[#1A1A1A]/10 text-[#1A1A1A] flex items-center justify-center shrink-0">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </span>
                                <span className="line-clamp-1">{name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {bundle.description && (
                          <p className="text-xs text-[#666666] leading-relaxed line-clamp-2 pt-2 border-t border-[#1A1A1A]/5">
                            {bundle.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Pricing & Actions */}
                    <div className="p-5 sm:p-6 pt-0 border-t border-[#1A1A1A]/5 space-y-3">
                      <div className="flex items-baseline justify-between pt-3">
                        <div className="space-y-0.5">
                          <div className="text-[11px] text-[#737373]">Bundle Offer Price:</div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-serif text-2xl font-bold text-[#1A1A1A]">
                              PKR {bundle.offerPrice.toLocaleString()}
                            </span>
                            <span className="text-xs text-[#8A8A8A] line-through">
                              PKR {bundle.originalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => handleAddCuratedBundleToCart(bundle)}
                          className={`flex items-center justify-center gap-2 py-3 px-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer ${
                            isJustAdded
                              ? "bg-[#25D366] text-white"
                              : "bg-[#1A1A1A] hover:bg-black text-[#FAF8F5]"
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Bag</span>
                            </>
                          )}
                        </button>

                        <a
                          href={getBundleWhatsAppUrl(bundle)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-3 px-3 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm active:scale-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Guarantees Strip */}
        <div className="bg-[#18181A] text-[#FAF8F5] rounded-2xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#D6C7B2] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-xs text-white uppercase tracking-wider">
                100% Guaranteed Fits
              </div>
              <div className="text-[11px] text-[#A3A3A3] mt-0.5">
                Free size consultation via WhatsApp before dispatch
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#D6C7B2] shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-xs text-white uppercase tracking-wider">
                Maximum Savings
              </div>
              <div className="text-[11px] text-[#A3A3A3] mt-0.5">
                Save up to 35% compared to purchasing items separately
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#D6C7B2] shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-xs text-white uppercase tracking-wider">
                VIP Packaging
              </div>
              <div className="text-[11px] text-[#A3A3A3] mt-0.5">
                Complete bundles packaged together with express courier
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
