import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  Sparkles,
  ShoppingBag,
  Gift,
  Settings,
  Edit2,
  Package,
  Layers,
} from "lucide-react";
import { Product, CategoryId, ColorOption, BundleDeal, CustomBundleDiscounts } from "../types";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  customProducts: Product[];
  onDeleteCustomProduct: (id: string) => void;
  allProducts: Product[];
  bundles: BundleDeal[];
  onSaveBundle: (bundle: BundleDeal) => void;
  onDeleteBundle: (id: string) => void;
  bundleDiscounts: CustomBundleDiscounts;
  onSaveBundleDiscounts: (discounts: CustomBundleDiscounts) => void;
  initialTab?: "single" | "bundle" | "manage" | "settings";
  editingBundleToLoad?: BundleDeal | null;
}

const PRESET_COLORS: ColorOption[] = [
  { name: "Onyx Black", hex: "#1A1A1A" },
  { name: "Tan Brown", hex: "#8B5A2B" },
  { name: "Dark Brown", hex: "#4A2F1E" },
  { name: "Navy Blue", hex: "#1B2A4A" },
  { name: "Pure White", hex: "#FFFFFF" },
  { name: "Olive Green", hex: "#4B5320" },
  { name: "Charcoal Grey", hex: "#404040" },
  { name: "Burgundy", hex: "#58111A" },
];

const CATEGORY_SIZES: Record<Exclude<CategoryId, "bundles">, string[]> = {
  shoes: ["EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45"],
  watches: ["Standard (Adjustable)"],
  shirts: ["S (38)", "M (40)", "L (42)", "XL (44)", "XXL (46)"],
  pants: ["30", "32", "34", "36", "38"],
};

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  customProducts,
  onDeleteCustomProduct,
  allProducts,
  bundles,
  onSaveBundle,
  onDeleteBundle,
  bundleDiscounts,
  onSaveBundleDiscounts,
  initialTab = "single",
  editingBundleToLoad = null,
}) => {
  const [activeTab, setActiveTab] = useState<"single" | "bundle" | "manage" | "settings">(initialTab);
  const [manageSubTab, setManageSubTab] = useState<"single" | "bundles">("bundles");

  // Single Item form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Exclude<CategoryId, "bundles">>("shoes");
  const [subcategory, setSubcategory] = useState("Loafers");
  const [price, setPrice] = useState<number | "">("");
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const [imageMode, setImageMode] = useState<"file" | "url">("file");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("Premium Grade");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([
    "EU 40",
    "EU 41",
    "EU 42",
    "EU 43",
  ]);
  const [customSizeInput, setCustomSizeInput] = useState("");
  const [selectedColors, setSelectedColors] = useState<ColorOption[]>([
    { name: "Onyx Black", hex: "#1A1A1A" },
    { name: "Tan Brown", hex: "#8B5A2B" },
  ]);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isNewArrival, setIsNewArrival] = useState(true);

  // Bundle Deal Form States (100% ADMIN CONTROLLED)
  const [editingBundleId, setEditingBundleId] = useState<string | null>(null);
  const [bundleTitle, setBundleTitle] = useState("");
  const [selectedBundleProductIds, setSelectedBundleProductIds] = useState<string[]>([]);
  const [bundleOriginalPrice, setBundleOriginalPrice] = useState<number | "">("");
  const [bundleOfferPrice, setBundleOfferPrice] = useState<number | "">("");
  const [bundleDiscountBadge, setBundleDiscountBadge] = useState("");
  const [bundleImagePreview, setBundleImagePreview] = useState<string>("");
  const [bundleImageUrlInput, setBundleImageUrlInput] = useState<string>("");
  const [bundleImageMode, setBundleImageMode] = useState<"file" | "url">("file");
  const [bundleDescription, setBundleDescription] = useState("");
  const [bundleSuccessMsg, setBundleSuccessMsg] = useState("");
  const [bundleErrorMsg, setBundleErrorMsg] = useState("");
  const [isGeneratingCollage, setIsGeneratingCollage] = useState(false);

  // Settings State for Tiered Discounts
  const [discount2, setDiscount2] = useState<number>(bundleDiscounts.twoItems || 15);
  const [discount3, setDiscount3] = useState<number>(bundleDiscounts.threeItems || 25);
  const [discount4, setDiscount4] = useState<number>(bundleDiscounts.fourItems || 35);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bundleFileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial tab or bundle to edit if passed
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (editingBundleToLoad) {
      loadBundleIntoForm(editingBundleToLoad);
    }
  }, [editingBundleToLoad]);

  useEffect(() => {
    setDiscount2(bundleDiscounts.twoItems);
    setDiscount3(bundleDiscounts.threeItems);
    setDiscount4(bundleDiscounts.fourItems);
  }, [bundleDiscounts]);

  if (!isOpen) return null;

  // Filter single products for bundle selection
  const catalogSingleProducts = allProducts.filter((p) => p.category !== "bundles");

  const toggleBundleProduct = (id: string) => {
    setSelectedBundleProductIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((pId) => pId !== id);
      }
      if (prev.length >= 4) {
        setBundleErrorMsg("You can select maximum 4 products for a bundle.");
        setTimeout(() => setBundleErrorMsg(""), 3000);
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleCategoryChange = (cat: Exclude<CategoryId, "bundles">) => {
    setCategory(cat);
    setSelectedSizes(CATEGORY_SIZES[cat]);
    if (cat === "shoes") setSubcategory("Loafers");
    else if (cat === "watches") setSubcategory("Chronograph");
    else if (cat === "shirts") setSubcategory("Casual Oxford");
    else if (cat === "pants") setSubcategory("Chinos");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBundleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBundleImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const addCustomSize = () => {
    if (customSizeInput.trim() && !selectedSizes.includes(customSizeInput.trim())) {
      setSelectedSizes((prev) => [...prev, customSizeInput.trim()]);
      setCustomSizeInput("");
    }
  };

  const toggleColor = (color: ColorOption) => {
    setSelectedColors((prev) =>
      prev.some((c) => c.name === color.name)
        ? prev.filter((c) => c.name !== color.name)
        : [...prev, color]
    );
  };

  // Helper: auto-sum selected items into Original Price field if admin wants
  const handleAutoSumPrices = () => {
    const selected = catalogSingleProducts.filter((p) =>
      selectedBundleProductIds.includes(p.id)
    );
    const sum = selected.reduce((acc, p) => acc + p.price, 0);
    setBundleOriginalPrice(sum);
    // Suggest badge if offer price is set
    if (typeof bundleOfferPrice === "number" && bundleOfferPrice > 0 && sum > 0) {
      const pct = Math.round(((sum - bundleOfferPrice) / sum) * 100);
      if (pct > 0) setBundleDiscountBadge(`SAVE ${pct}%`);
    }
  };

  // Auto-generate collage on canvas from selected 2-4 items
  const handleGenerateCollage = async () => {
    const selected = catalogSingleProducts.filter((p) =>
      selectedBundleProductIds.includes(p.id)
    );
    if (selected.length < 2) {
      setBundleErrorMsg("Please select at least 2 products first to generate a collage.");
      return;
    }

    setIsGeneratingCollage(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 1000;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      // Background
      ctx.fillStyle = "#18181A";
      ctx.fillRect(0, 0, 1000, 1000);

      const count = Math.min(selected.length, 4);
      const imagesToLoad = selected.slice(0, 4);

      // Load all images safely
      const loadedImgs = await Promise.all(
        imagesToLoad.map(
          (item) =>
            new Promise<HTMLImageElement>((resolve) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = () => resolve(img);
              img.onerror = () => {
                // Return dummy canvas fallback
                const fallback = new Image();
                resolve(fallback);
              };
              img.src = item.image;
            })
        )
      );

      // Draw grid
      if (count === 2) {
        // 2 vertical columns
        if (loadedImgs[0].naturalWidth) ctx.drawImage(loadedImgs[0], 0, 0, 495, 1000);
        if (loadedImgs[1].naturalWidth) ctx.drawImage(loadedImgs[1], 505, 0, 495, 1000);
      } else if (count === 3) {
        // 1 big on left, 2 stacked on right
        if (loadedImgs[0].naturalWidth) ctx.drawImage(loadedImgs[0], 0, 0, 495, 1000);
        if (loadedImgs[1].naturalWidth) ctx.drawImage(loadedImgs[1], 505, 0, 495, 495);
        if (loadedImgs[2].naturalWidth) ctx.drawImage(loadedImgs[2], 505, 505, 495, 495);
      } else {
        // 2x2 grid
        if (loadedImgs[0].naturalWidth) ctx.drawImage(loadedImgs[0], 0, 0, 495, 495);
        if (loadedImgs[1].naturalWidth) ctx.drawImage(loadedImgs[1], 505, 0, 495, 495);
        if (loadedImgs[2].naturalWidth) ctx.drawImage(loadedImgs[2], 0, 505, 495, 495);
        if (loadedImgs[3].naturalWidth) ctx.drawImage(loadedImgs[3], 505, 505, 495, 495);
      }

      const collageDataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setBundleImagePreview(collageDataUrl);
      setBundleSuccessMsg("Collage generated from selected products!");
      setTimeout(() => setBundleSuccessMsg(""), 2500);
    } catch {
      // Fallback to first image
      if (selected[0]?.image) {
        setBundleImagePreview(selected[0].image);
        setBundleSuccessMsg("Used primary product image for bundle.");
        setTimeout(() => setBundleSuccessMsg(""), 2500);
      }
    } finally {
      setIsGeneratingCollage(false);
    }
  };

  const loadBundleIntoForm = (bundle: BundleDeal) => {
    setEditingBundleId(bundle.id);
    setBundleTitle(bundle.title);
    setSelectedBundleProductIds(bundle.productIds || []);
    setBundleOriginalPrice(bundle.originalPrice);
    setBundleOfferPrice(bundle.offerPrice);
    setBundleDiscountBadge(bundle.discountBadge);
    setBundleImagePreview(bundle.image);
    setBundleDescription(bundle.description || "");
    setActiveTab("bundle");
  };

  const resetBundleForm = () => {
    setEditingBundleId(null);
    setBundleTitle("");
    setSelectedBundleProductIds([]);
    setBundleOriginalPrice("");
    setBundleOfferPrice("");
    setBundleDiscountBadge("");
    setBundleImagePreview("");
    setBundleImageUrlInput("");
    setBundleDescription("");
    setBundleErrorMsg("");
  };

  // Submit Single Product
  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = imageMode === "file" ? imagePreview : imageUrlInput;

    if (!finalImage) {
      alert("Please upload an image or provide an image URL.");
      return;
    }
    if (!price || Number(price) <= 0) {
      alert("Please specify a valid price.");
      return;
    }

    const newProd: Product = {
      id: `fn-${Date.now()}`,
      name: name.trim(),
      sku: `FN-${category.slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      category,
      subcategory: subcategory.trim() || "Exclusive",
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      image: finalImage,
      shortDescription: description.trim() || `Authentic Farnova ${name}`,
      description: description.trim() || `Engineered for modern men: ${name}.`,
      features: [material, "Signature tailored fit", "Nationwide Cash on Delivery"],
      sizes: selectedSizes.length > 0 ? selectedSizes : ["Standard"],
      colors: selectedColors.length > 0 ? selectedColors : [{ name: "Onyx Black", hex: "#1A1A1A" }],
      stockStatus: "In Stock",
      isFeatured,
      isNewArrival,
      material,
      rating: 5.0,
      reviewCount: 1,
    };

    onAddProduct(newProd);
    onClose();
  };

  // Submit Bundle Deal
  const handleBundleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBundleErrorMsg("");

    if (!bundleTitle.trim()) {
      setBundleErrorMsg("Please enter a Bundle Title.");
      return;
    }
    if (selectedBundleProductIds.length < 2 || selectedBundleProductIds.length > 4) {
      setBundleErrorMsg("Please select between 2 to 4 products for this bundle.");
      return;
    }
    if (typeof bundleOriginalPrice !== "number" || bundleOriginalPrice <= 0) {
      setBundleErrorMsg("Please enter a valid Original Total Price (number).");
      return;
    }
    if (typeof bundleOfferPrice !== "number" || bundleOfferPrice <= 0) {
      setBundleErrorMsg("Please enter a valid Bundle Offer Price (final selling price).");
      return;
    }
    if (!bundleDiscountBadge.trim()) {
      setBundleErrorMsg("Please enter Discount Badge Text (e.g. SAVE 30%).");
      return;
    }

    const finalImage =
      bundleImageMode === "file"
        ? bundleImagePreview
        : bundleImageUrlInput.trim() || bundleImagePreview;

    if (!finalImage) {
      setBundleErrorMsg("Please generate a collage, upload an image, or provide an image URL.");
      return;
    }

    // Get selected product names
    const names = catalogSingleProducts
      .filter((p) => selectedBundleProductIds.includes(p.id))
      .map((p) => p.name);

    const bundleData: BundleDeal = {
      id: editingBundleId || `bundle-${Date.now()}`,
      title: bundleTitle.trim(),
      productIds: selectedBundleProductIds,
      includedProductNames: names,
      originalPrice: bundleOriginalPrice,
      offerPrice: bundleOfferPrice,
      discountBadge: bundleDiscountBadge.trim(),
      image: finalImage,
      description: bundleDescription.trim() || `Includes: ${names.join(", ")}`,
      createdAt: new Date().toISOString(),
    };

    onSaveBundle(bundleData);
    setBundleSuccessMsg(editingBundleId ? "Bundle updated successfully!" : "Bundle deal created successfully!");
    setTimeout(() => {
      setBundleSuccessMsg("");
      resetBundleForm();
      setActiveTab("manage");
      setManageSubTab("bundles");
    }, 1500);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBundleDiscounts({
      twoItems: Number(discount2) || 15,
      threeItems: Number(discount3) || 25,
      fourItems: Number(discount4) || 35,
    });
    setSettingsSuccessMsg("Bundle discount percentages updated successfully!");
    setTimeout(() => setSettingsSuccessMsg(""), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#1A1A1A]/10 text-[#1A1A1A] rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header & Navigation Tabs */}
        <div className="p-4 sm:p-5 border-b border-[#1A1A1A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-[#FAF8F5] flex items-center justify-center font-bold text-sm">
              FN
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                <span>Admin Management Panel</span>
                <span className="text-[10px] bg-[#25D366]/20 text-[#1EBE5D] px-2 py-0.5 rounded-full font-sans uppercase font-bold tracking-wider">
                  Store Owner
                </span>
              </h2>
              <p className="text-xs text-[#737373]">
                100% Admin Controlled Catalog, Bundles &amp; Pricing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-center">
            {/* Top Tabs */}
            <div className="flex bg-[#F3EFEA] p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  resetBundleForm();
                  setActiveTab("single");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "single"
                    ? "bg-white text-[#1A1A1A] shadow-xs"
                    : "text-[#666666] hover:text-[#1A1A1A]"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Single Item</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  resetBundleForm();
                  setActiveTab("bundle");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "bundle"
                    ? "bg-[#1A1A1A] text-[#FAF8F5] shadow-xs"
                    : "text-[#666666] hover:text-[#1A1A1A]"
                }`}
              >
                <Gift className="w-3.5 h-3.5 text-[#B8986B]" />
                <span>Create Bundle Deal</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("manage")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "manage"
                    ? "bg-white text-[#1A1A1A] shadow-xs"
                    : "text-[#666666] hover:text-[#1A1A1A]"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>All Products</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-white text-[#1A1A1A] shadow-xs"
                    : "text-[#666666] hover:text-[#1A1A1A]"
                }`}
                title="Bundle Discount Percentages"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#737373] hover:text-[#1A1A1A] hover:bg-black/5 rounded-full transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          {/* ========================================================
              TAB 2: CREATE BUNDLE DEAL (100% ADMIN CONTROLLED)
          ======================================================== */}
          {activeTab === "bundle" && (
            <form onSubmit={handleBundleSubmit} className="space-y-6">
              <div className="bg-[#18181A] text-white p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#D6C7B2] font-semibold">
                    <Gift className="w-4 h-4" />
                    <span>{editingBundleId ? "Edit Bundle Deal" : "New Curated Bundle Deal"}</span>
                  </div>
                  <p className="text-xs text-white/70 mt-1">
                    Select 2 to 4 existing products, set your custom prices, badge, and upload or auto-generate a collage.
                  </p>
                </div>
                {editingBundleId && (
                  <button
                    type="button"
                    onClick={resetBundleForm}
                    className="text-xs underline text-[#D6C7B2] hover:text-white"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              {bundleErrorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 text-xs rounded-xl font-medium">
                  {bundleErrorMsg}
                </div>
              )}
              {bundleSuccessMsg && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-700 text-xs rounded-xl font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>{bundleSuccessMsg}</span>
                </div>
              )}

              {/* 1. Bundle Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Bundle Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Full Drip or Royal Groom Pack"
                  value={bundleTitle}
                  onChange={(e) => setBundleTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1A1A1A]/15 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] font-medium"
                />
              </div>

              {/* 2. Select Products (2 to 4 products) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                    Select Products (Choose 2 to 4) *
                  </label>
                  <span className="text-xs text-[#737373] font-semibold">
                    Selected: {selectedBundleProductIds.length} / 4
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-2 bg-white border border-[#1A1A1A]/10 rounded-xl">
                  {catalogSingleProducts.map((prod) => {
                    const isChecked = selectedBundleProductIds.includes(prod.id);
                    return (
                      <div
                        key={prod.id}
                        onClick={() => toggleBundleProduct(prod.id)}
                        className={`p-2 rounded-lg border transition-all flex items-center gap-2.5 cursor-pointer ${
                          isChecked
                            ? "bg-[#FAF8F5] border-[#1A1A1A] ring-1 ring-[#1A1A1A]"
                            : "bg-white border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30"
                        }`}
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-10 rounded object-cover bg-gray-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-semibold text-[#1A1A1A] truncate">
                            {prod.name}
                          </h5>
                          <div className="text-[10px] text-[#737373] flex items-center gap-2">
                            <span className="uppercase font-semibold">{prod.category}</span>
                            <span>•</span>
                            <span className="font-bold text-[#1A1A1A]">PKR {prod.price.toLocaleString()}</span>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                            isChecked ? "bg-[#1A1A1A] text-white" : "border border-black/20"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Pricing: Original Total Price & Bundle Offer Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                      Original Total Price (PKR) *
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoSumPrices}
                      className="text-[10px] text-[#B8986B] font-bold hover:underline cursor-pointer"
                    >
                      ⚡ Auto-Sum Selected
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-semibold text-[#737373]">
                      PKR
                    </span>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 10000"
                      value={bundleOriginalPrice}
                      onChange={(e) =>
                        setBundleOriginalPrice(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full pl-12 pr-3.5 py-2.5 text-xs bg-white border border-[#1A1A1A]/15 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] font-mono font-semibold"
                    />
                  </div>
                  <p className="text-[10px] text-[#888888] mt-1">
                    Will be displayed with strikethrough (e.g. PKR 10,000)
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                    Bundle Offer Price (PKR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-semibold text-[#737373]">
                      PKR
                    </span>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 6999"
                      value={bundleOfferPrice}
                      onChange={(e) =>
                        setBundleOfferPrice(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full pl-12 pr-3.5 py-2.5 text-xs bg-white border border-[#1A1A1A]/15 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] font-mono font-bold text-[#1A1A1A]"
                    />
                  </div>
                  <p className="text-[10px] text-[#888888] mt-1">
                    Final discounted selling price for customer
                  </p>
                </div>
              </div>

              {/* 4. Discount Badge Text */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Discount Badge Text *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. SAVE 30% or FLAT 35% OFF"
                    value={bundleDiscountBadge}
                    onChange={(e) => setBundleDiscountBadge(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-xs bg-white border border-[#1A1A1A]/15 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] font-bold"
                  />
                  {typeof bundleOriginalPrice === "number" &&
                    typeof bundleOfferPrice === "number" &&
                    bundleOriginalPrice > bundleOfferPrice && (
                      <button
                        type="button"
                        onClick={() => {
                          const pct = Math.round(
                            ((bundleOriginalPrice - bundleOfferPrice) /
                              bundleOriginalPrice) *
                              100
                          );
                          setBundleDiscountBadge(`SAVE ${pct}%`);
                        }}
                        className="px-3 py-2 bg-[#FAF8F5] border border-[#1A1A1A]/15 text-xs font-bold rounded-xl hover:bg-[#EBE7DF] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        ⚡ Auto-Calculate %
                      </button>
                    )}
                </div>
              </div>

              {/* 5. Bundle Image: Auto-Generate Collage OR Upload Custom */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                    Bundle Cover Image *
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={isGeneratingCollage || selectedBundleProductIds.length < 2}
                      onClick={handleGenerateCollage}
                      className="px-3 py-1 bg-[#1A1A1A] text-white hover:bg-black text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                    >
                      <Sparkles className="w-3 h-3 text-[#D6C7B2]" />
                      <span>{isGeneratingCollage ? "Stitching..." : "⚡ Auto-Generate Collage"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setBundleImageMode("file")}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium cursor-pointer ${
                      bundleImageMode === "file"
                        ? "bg-[#1A1A1A] text-white"
                        : "bg-white text-[#525252] border border-[#1A1A1A]/10"
                    }`}
                  >
                    Upload / Collage File
                  </button>
                  <button
                    type="button"
                    onClick={() => setBundleImageMode("url")}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium cursor-pointer ${
                      bundleImageMode === "url"
                        ? "bg-[#1A1A1A] text-white"
                        : "bg-white text-[#525252] border border-[#1A1A1A]/10"
                    }`}
                  >
                    Image URL
                  </button>
                </div>

                {bundleImageMode === "file" ? (
                  <div>
                    <input
                      ref={bundleFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBundleFileChange}
                      className="hidden"
                    />

                    {bundleImagePreview ? (
                      <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden bg-black/5 border border-[#1A1A1A]/15">
                        <img
                          src={bundleImagePreview}
                          alt="Bundle Cover Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => bundleFileInputRef.current?.click()}
                          className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/80 hover:bg-black text-white text-xs font-medium rounded-lg backdrop-blur-xs transition-colors cursor-pointer"
                        >
                          Change Photo
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => bundleFileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#1A1A1A]/20 hover:border-[#1A1A1A]/50 rounded-xl p-8 text-center bg-white cursor-pointer transition-colors"
                      >
                        <ImageIcon className="w-8 h-8 text-[#737373] mx-auto mb-2" />
                        <span className="text-xs font-semibold block text-[#1A1A1A]">
                          Click to upload custom bundle photo or tap &ldquo;Auto-Generate Collage&rdquo; above
                        </span>
                        <span className="text-[11px] text-[#737373] block mt-1">
                          Supports PNG, JPG, WEBP
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={bundleImageUrlInput}
                      onChange={(e) => {
                        setBundleImageUrlInput(e.target.value);
                        setBundleImagePreview(e.target.value);
                      }}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1A1A1A]/15 rounded-xl focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Bundle Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Complete black-tie executive combination for weddings, dinners, and luxury occasions."
                  value={bundleDescription}
                  onChange={(e) => setBundleDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1A1A1A]/15 rounded-xl focus:outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 bg-[#1A1A1A] hover:bg-black text-[#FAF8F5] font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Gift className="w-4 h-4 text-[#D6C7B2]" />
                <span>{editingBundleId ? "Update Bundle Deal" : "Publish Bundle Deal to Store"}</span>
              </button>
            </form>
          )}

          {/* ========================================================
              TAB 1: POST SINGLE ITEM (EXISTING PRODUCT CREATION)
          ======================================================== */}
          {activeTab === "single" && (
            <form onSubmit={handleSingleSubmit} className="space-y-6">
              {/* Category selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Category *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["shoes", "watches", "shirts", "pants"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                        category === cat
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs"
                          : "bg-white text-[#525252] border-[#1A1A1A]/15 hover:border-[#1A1A1A]/40"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Product Image *
                </label>
                <div className="flex items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setImageMode("file")}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium cursor-pointer ${
                      imageMode === "file"
                        ? "bg-[#1A1A1A] text-white"
                        : "bg-white text-[#525252] border border-[#1A1A1A]/10"
                    }`}
                  >
                    Upload File / Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode("url")}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium cursor-pointer ${
                      imageMode === "url"
                        ? "bg-[#1A1A1A] text-white"
                        : "bg-white text-[#525252] border border-[#1A1A1A]/10"
                    }`}
                  >
                    Image URL
                  </button>
                </div>

                {imageMode === "file" ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {imagePreview ? (
                      <div className="relative aspect-[4/3] max-w-sm rounded-xl overflow-hidden bg-black/5 border border-[#1A1A1A]/15 mx-auto">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/80 hover:bg-black text-white text-xs font-medium rounded-lg backdrop-blur-xs transition-colors cursor-pointer"
                        >
                          Change Photo
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#1A1A1A]/20 hover:border-[#1A1A1A]/50 rounded-xl p-8 text-center bg-white cursor-pointer transition-colors"
                      >
                        <Upload className="w-8 h-8 text-[#737373] mx-auto mb-2" />
                        <span className="text-xs font-semibold block text-[#1A1A1A]">
                          Tap to select photo from your phone or PC
                        </span>
                        <span className="text-[11px] text-[#737373] block mt-1">
                          PNG, JPG, WEBP up to 5MB
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrlInput}
                      onChange={(e) => {
                        setImageUrlInput(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1A1A1A]/15 rounded-xl focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Oxford Classic Button-Down"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1A1A1A]/15 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] font-medium"
                />
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                    Selling Price (PKR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-semibold text-[#737373]">
                      PKR
                    </span>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 4500"
                      value={price}
                      onChange={(e) =>
                        setPrice(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      className="w-full pl-12 pr-3.5 py-2.5 text-xs bg-white border border-[#1A1A1A]/15 rounded-xl focus:outline-none font-mono font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                    Cut Price (PKR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-semibold text-[#737373]">
                      PKR
                    </span>
                    <input
                      type="number"
                      placeholder="e.g. 5999"
                      value={originalPrice}
                      onChange={(e) =>
                        setOriginalPrice(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full pl-12 pr-3.5 py-2.5 text-xs bg-white border border-[#1A1A1A]/15 rounded-xl focus:outline-none font-mono text-[#737373]"
                    />
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Sizes
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {CATEGORY_SIZES[category].map((s) => {
                    const active = selectedSizes.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSize(s)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                          active
                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                            : "bg-white text-[#525252] border-[#1A1A1A]/15"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Publish Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 bg-[#1A1A1A] hover:bg-black text-[#FAF8F5] font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4 text-[#D6C7B2]" />
                <span>Publish Item to Store</span>
              </button>
            </form>
          )}

          {/* ========================================================
              TAB 3: ALL PRODUCTS & BUNDLES (EDIT / DELETE ANYTIME)
          ======================================================== */}
          {activeTab === "manage" && (
            <div className="space-y-6">
              {/* Sub-tab toggle */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]/10">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setManageSubTab("bundles")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      manageSubTab === "bundles"
                        ? "bg-[#1A1A1A] text-white"
                        : "bg-[#F3EFEA] text-[#666666] hover:text-[#1A1A1A]"
                    }`}
                  >
                    🎁 Bundle Deals ({bundles.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setManageSubTab("single")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      manageSubTab === "single"
                        ? "bg-[#1A1A1A] text-white"
                        : "bg-[#F3EFEA] text-[#666666] hover:text-[#1A1A1A]"
                    }`}
                  >
                    Single Products ({customProducts.length})
                  </button>
                </div>

                {manageSubTab === "bundles" && (
                  <button
                    type="button"
                    onClick={() => {
                      resetBundleForm();
                      setActiveTab("bundle");
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-[#B8986B] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ New Bundle</span>
                  </button>
                )}
              </div>

              {/* BUNDLE DEALS LIST WITH EDIT AND DELETE */}
              {manageSubTab === "bundles" && (
                <div className="space-y-3">
                  {bundles.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#737373] bg-white rounded-xl border border-[#1A1A1A]/10">
                      No bundle deals created yet. Click &ldquo;+ New Bundle&rdquo; to create your first package.
                    </div>
                  ) : (
                    bundles.map((bundle) => (
                      <div
                        key={bundle.id}
                        className="bg-white border border-[#1A1A1A]/10 rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-4 shadow-subtle hover:border-[#1A1A1A]/30 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={bundle.image}
                            alt={bundle.title}
                            className="w-14 h-14 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif text-sm font-bold text-[#1A1A1A] truncate">
                                {bundle.title}
                              </h4>
                              <span className="px-2 py-0.5 bg-[#B8986B] text-white text-[10px] font-bold rounded">
                                {bundle.discountBadge}
                              </span>
                            </div>
                            <div className="text-xs text-[#737373] mt-0.5">
                              {bundle.includedProductNames.length} Products:{" "}
                              <span className="line-clamp-1">{bundle.includedProductNames.join(", ")}</span>
                            </div>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="text-xs font-bold text-[#1A1A1A]">
                                PKR {bundle.offerPrice.toLocaleString()}
                              </span>
                              <span className="text-[11px] text-[#888888] line-through">
                                PKR {bundle.originalPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => loadBundleIntoForm(bundle)}
                            className="p-2 text-[#1A1A1A] hover:bg-black/5 rounded-lg transition-colors cursor-pointer border border-[#1A1A1A]/15"
                            title="Edit Bundle Price & Details"
                          >
                            <Edit2 className="w-4 h-4 text-[#B8986B]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteBundle(bundle.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-red-200"
                            title="Delete Bundle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* SINGLE PRODUCTS LIST */}
              {manageSubTab === "single" && (
                <div className="space-y-3">
                  {customProducts.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#737373] bg-white rounded-xl border border-[#1A1A1A]/10">
                      No custom single products posted yet.
                    </div>
                  ) : (
                    customProducts.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white border border-[#1A1A1A]/10 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-4 shadow-subtle"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-[#1A1A1A] truncate">{p.name}</h4>
                            <div className="text-[11px] text-[#737373] flex items-center gap-2 mt-0.5">
                              <span className="uppercase font-semibold">{p.category}</span>
                              <span>•</span>
                              <span className="font-bold text-[#1A1A1A]">
                                PKR {p.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onDeleteCustomProduct(p.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-red-200 shrink-0"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 4: SETTINGS (PART 3 - CUSTOM BUNDLE DISCOUNT %)
          ======================================================== */}
          {activeTab === "settings" && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="bg-[#18181A] text-white p-4 sm:p-5 rounded-2xl">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#D6C7B2] font-semibold">
                  <Settings className="w-4 h-4" />
                  <span>&ldquo;Build Your Own Bundle&rdquo; Discount Rules</span>
                </div>
                <p className="text-xs text-white/70 mt-1">
                  When a customer uses the live Bundle Builder, these discount percentages are automatically applied based on item count. You can modify them anytime.
                </p>
              </div>

              {settingsSuccessMsg && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-700 text-xs rounded-xl font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>{settingsSuccessMsg}</span>
                </div>
              )}

              <div className="space-y-4 bg-white p-5 rounded-2xl border border-[#1A1A1A]/10">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                    Discount for 2 Items (%) *
                  </label>
                  <div className="relative max-w-xs">
                    <input
                      type="number"
                      required
                      min={1}
                      max={90}
                      value={discount2}
                      onChange={(e) => setDiscount2(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#1A1A1A]/15 rounded-xl font-bold text-[#1A1A1A] focus:outline-none"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-bold text-[#737373]">%</span>
                  </div>
                  <span className="text-[11px] text-[#737373] mt-1 block">
                    Default: 15% discount when customer selects 2 products.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                    Discount for 3 Items (%) *
                  </label>
                  <div className="relative max-w-xs">
                    <input
                      type="number"
                      required
                      min={1}
                      max={90}
                      value={discount3}
                      onChange={(e) => setDiscount3(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#1A1A1A]/15 rounded-xl font-bold text-[#1A1A1A] focus:outline-none"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-bold text-[#737373]">%</span>
                  </div>
                  <span className="text-[11px] text-[#737373] mt-1 block">
                    Default: 25% discount when customer selects 3 products.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                    Discount for 4 Items (%) *
                  </label>
                  <div className="relative max-w-xs">
                    <input
                      type="number"
                      required
                      min={1}
                      max={90}
                      value={discount4}
                      onChange={(e) => setDiscount4(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#1A1A1A]/15 rounded-xl font-bold text-[#1A1A1A] focus:outline-none"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-bold text-[#737373]">%</span>
                  </div>
                  <span className="text-[11px] text-[#737373] mt-1 block">
                    Default: 35% discount when customer selects 4 or more products.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 bg-[#1A1A1A] hover:bg-black text-[#FAF8F5] font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Check className="w-4 h-4 text-[#D6C7B2]" />
                <span>Save Discount Percentages</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
