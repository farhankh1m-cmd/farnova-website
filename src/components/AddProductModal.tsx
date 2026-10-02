import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Copy,
  Tag,
  ShoppingBag,
} from "lucide-react";
import { Product, CategoryId, ColorOption } from "../types";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  customProducts: Product[];
  onDeleteCustomProduct: (id: string) => void;
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

const CATEGORY_SIZES: Record<CategoryId, string[]> = {
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
}) => {
  const [activeTab, setActiveTab] = useState<"new" | "manage">("new");

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryId>("shoes");
  const [subcategory, setSubcategory] = useState("");
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
  const [copiedCode, setCopiedCode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle category switch to default sizes
  const handleCategoryChange = (cat: CategoryId) => {
    setCategory(cat);
    setSelectedSizes(CATEGORY_SIZES[cat]);
    if (cat === "shoes") setSubcategory("Loafers");
    else if (cat === "watches") setSubcategory("Chronograph");
    else if (cat === "shirts") setSubcategory("Casual Oxford");
    else if (cat === "pants") setSubcategory("Chinos");
  };

  // Handle local image file upload (converts to base64 data url)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const addCustomSize = () => {
    if (customSizeInput.trim() && !selectedSizes.includes(customSizeInput.trim())) {
      setSelectedSizes([...selectedSizes, customSizeInput.trim()]);
      setCustomSizeInput("");
    }
  };

  const toggleColor = (color: ColorOption) => {
    const exists = selectedColors.some((c) => c.name === color.name);
    if (exists) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter((c) => c.name !== color.name));
      }
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalImage =
      imageMode === "file"
        ? imagePreview ||
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80"
        : imageUrlInput.trim() ||
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80";

    const numericPrice = Number(price) || 4500;
    const numericOriginalPrice = Number(originalPrice) || Math.round(numericPrice * 1.25);

    const newProduct: Product = {
      id: `custom-${Date.now()}`,
      name: name.trim() || "Farnova Signature Item",
      sku: `FN-${category.toUpperCase().slice(0, 2)}-${Math.floor(100 + Math.random() * 900)}`,
      category,
      subcategory: subcategory.trim() || "Exclusive",
      price: numericPrice,
      originalPrice: numericOriginalPrice,
      image: finalImage,
      shortDescription: description.trim().slice(0, 100) || "Premium tailored menswear from Farnova.",
      description:
        description.trim() ||
        "Expertly crafted menswear designed with premium materials, contemporary aesthetics, and everyday durability across Pakistan.",
      features: [
        "100% Guaranteed Quality",
        "Cash on Delivery Nationwide",
        "7-Day Easy Exchange Policy",
        `Material: ${material}`,
      ],
      sizes: selectedSizes.length > 0 ? selectedSizes : ["Standard"],
      colors: selectedColors,
      stockStatus: "In Stock",
      isFeatured,
      isNewArrival,
      material: material || "Tailored Luxury Blend",
      rating: 5.0,
      reviewCount: 1,
    };

    onAddProduct(newProduct);
    onClose();

    // Reset fields
    setName("");
    setPrice("");
    setOriginalPrice("");
    setDescription("");
    setImagePreview("");
    setImageUrlInput("");
  };

  const handleCopyCode = () => {
    const code = JSON.stringify(customProducts, null, 2);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#FAF8F5] text-[#1A1A1A] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#1A1A1A]/10 z-10 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#1A1A1A]/10 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#FAF8F5] flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A]">
                Post New Product (Insta Style)
              </h2>
              <p className="text-[11px] text-[#737373]">
                Add photos, set price &amp; sizes — live on your store instantly!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-[#FAF8F5] border border-[#1A1A1A]/10 rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("new")}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === "new"
                    ? "bg-[#1A1A1A] text-[#FAF8F5]"
                    : "text-[#737373] hover:text-[#1A1A1A]"
                }`}
              >
                + New Item
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("manage")}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === "manage"
                    ? "bg-[#1A1A1A] text-[#FAF8F5]"
                    : "text-[#737373] hover:text-[#1A1A1A]"
                }`}
              >
                My Posts ({customProducts.length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#FAF8F5] text-[#737373] hover:text-[#1A1A1A] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === "manage" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
                    Your Uploaded Products
                  </h3>
                  <p className="text-xs text-[#737373]">
                    These are stored in your browser and live on your site.
                  </p>
                </div>

                {customProducts.length > 0 && (
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#1A1A1A]/15 text-xs font-medium rounded-lg hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCode ? "Copied JSON!" : "Copy Code"}</span>
                  </button>
                )}
              </div>

              {customProducts.length === 0 ? (
                <div className="text-center py-16 bg-white border border-[#1A1A1A]/8 rounded-xl p-8">
                  <ShoppingBag className="w-10 h-10 text-[#A3A3A3] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
                    No custom products uploaded yet.
                  </p>
                  <p className="text-xs text-[#737373] mb-4">
                    Switch to &ldquo;+ New Item&rdquo; tab to create your first post!
                  </p>
                  <button
                    onClick={() => setActiveTab("new")}
                    className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Create Post
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white p-3 rounded-xl border border-[#1A1A1A]/8 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-14 h-14 rounded-lg object-cover bg-[#EFECE6] shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-serif text-xs font-semibold text-[#1A1A1A] truncate">
                            {p.name}
                          </h4>
                          <span className="text-[11px] text-[#737373] block">
                            PKR {p.price.toLocaleString("en-PK")} · {p.category}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteCustomProduct(p.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Media Section (Like Insta Photo Picker) */}
              <div className="bg-white p-4 rounded-xl border border-[#1A1A1A]/10">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#D6C7B2]" />
                    <span>Product Photo</span>
                  </label>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setImageMode("file")}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        imageMode === "file"
                          ? "bg-[#1A1A1A] text-white font-medium"
                          : "text-[#737373]"
                      }`}
                    >
                      From Phone/PC
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        imageMode === "url"
                          ? "bg-[#1A1A1A] text-white font-medium"
                          : "text-[#737373]"
                      }`}
                    >
                      Image Link (URL)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Photo Preview Card */}
                  <div className="sm:col-span-5 aspect-[4/3] bg-[#F2EFE9] rounded-xl overflow-hidden border border-[#1A1A1A]/10 flex flex-col items-center justify-center relative group">
                    {imageMode === "file" && imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : imageMode === "url" && imageUrlInput ? (
                      <img
                        src={imageUrlInput}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80";
                        }}
                      />
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="w-8 h-8 text-[#A3A3A3] mx-auto mb-2" />
                        <span className="text-xs font-medium text-[#525252] block">
                          No Photo Selected
                        </span>
                        <span className="text-[10px] text-[#8C8C8C] block mt-0.5">
                          Tap button to upload
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Upload Actions */}
                  <div className="sm:col-span-7 space-y-2">
                    {imageMode === "file" ? (
                      <div>
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
                          className="w-full py-3 px-4 bg-[#FAF8F5] hover:bg-[#EBE7DF] border border-dashed border-[#1A1A1A]/20 rounded-xl text-xs font-semibold text-[#1A1A1A] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          <Upload className="w-4 h-4 text-[#1A1A1A]" />
                          <span>
                            {imagePreview ? "Change Photo" : "Upload Photo from Gallery"}
                          </span>
                        </button>
                        <p className="text-[11px] text-[#737373] mt-1.5">
                          Supports PNG, JPG, WEBP. Converted instantly with zero servers needed.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="url"
                          placeholder="Paste image URL (https://...)"
                          value={imageUrlInput}
                          onChange={(e) => setImageUrlInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#1A1A1A]/15 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                        />
                        <p className="text-[11px] text-[#737373] mt-1">
                          Paste any direct photo link from Instagram, Unsplash, or ImgBB.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Suede Penny Loafers"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1A1A1A]/15 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                    Subcategory / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Penny Loafers, Casual, Formal"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1A1A1A]/15 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                  />
                </div>
              </div>

              {/* Category Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Select Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { id: "shoes", label: "👞 Shoes & Loafers" },
                      { id: "watches", label: "⌚ Luxury Watches" },
                      { id: "shirts", label: "👔 Tailored Shirts" },
                      { id: "pants", label: "👖 Chinos & Jeans" },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`py-2.5 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                        category === cat.id
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs"
                          : "bg-white text-[#525252] border-[#1A1A1A]/15 hover:border-[#1A1A1A]/40"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing (PKR) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full pl-12 pr-3.5 py-2.5 text-xs bg-white border border-[#1A1A1A]/15 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] font-mono font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                    Original Price / Cut Price (PKR)
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
                      className="w-full pl-12 pr-3.5 py-2.5 text-xs bg-white border border-[#1A1A1A]/15 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] font-mono text-[#737373]"
                    />
                  </div>
                </div>
              </div>

              {/* Caption / Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Product Description / Instagram Caption
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell your customers about the material, finish, comfort, and occasion..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#1A1A1A]/15 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] resize-none"
                />
              </div>

              {/* Sizes Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Available Sizes
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
                            : "bg-white text-[#525252] border-[#1A1A1A]/15 hover:border-[#1A1A1A]/40"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add custom size (e.g. EU 46 or XXL)"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-[#1A1A1A]/15 rounded-lg focus:outline-none w-48"
                  />
                  <button
                    type="button"
                    onClick={addCustomSize}
                    className="px-3 py-1.5 bg-[#FAF8F5] border border-[#1A1A1A]/15 text-xs font-medium rounded-lg hover:bg-[#EBE7DF] transition-colors cursor-pointer"
                  >
                    + Add Size
                  </button>
                </div>
              </div>

              {/* Colors Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Available Colors
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((col) => {
                    const isSelected = selectedColors.some((c) => c.name === col.name);
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => toggleColor(col)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white border-[#1A1A1A] shadow-xs ring-1 ring-[#1A1A1A] text-[#1A1A1A]"
                            : "bg-white/60 border-[#1A1A1A]/10 text-[#737373]"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#1A1A1A]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles: Featured & New Arrival */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#1A1A1A]/10">
                <label className="flex items-center gap-2 text-xs font-medium text-[#1A1A1A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1A1A1A] focus:ring-[#1A1A1A]"
                  />
                  <span>Show in Featured Section</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-[#1A1A1A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1A1A1A] focus:ring-[#1A1A1A]"
                  />
                  <span>Mark as &ldquo;New Arrival&rdquo;</span>
                </label>
              </div>

              {/* Post Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 bg-[#1A1A1A] hover:bg-black text-[#FAF8F5] font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4 text-[#D6C7B2]" />
                <span>Publish to Farnova Store Now</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
