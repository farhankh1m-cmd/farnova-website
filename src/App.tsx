import { useState, useEffect, useMemo } from "react";
import { CategoryId, Product, CartItem, ColorOption } from "./types";
import { PRODUCTS } from "./data/products";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { CategoriesOverview } from "./components/CategoriesOverview";
import { FeaturedSection } from "./components/FeaturedSection";
import { NewArrivalsSection } from "./components/NewArrivalsSection";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { CategoryPage } from "./components/CategoryPage";
import { ProductModal } from "./components/ProductModal";
import { CartDrawer } from "./components/CartDrawer";
import { SearchModal } from "./components/SearchModal";
import { WhatsAppFloat } from "./components/WhatsAppFloat";
import { AddProductModal } from "./components/AddProductModal";
import { AdminLoginModal } from "./components/AdminLoginModal";
import {
  subscribeToCloudProducts,
  saveProductToCloud,
  deleteProductFromCloud,
} from "./firebase";

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Admin authentication state: Farhan Khan (farhankh1m@gmail.com)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem("farnova_admin_logged_in") === "true";
    } catch {
      return false;
    }
  });

  const handleAdminLogin = (enteredPin: string): boolean => {
    const storedPin = localStorage.getItem("farnova_admin_pin") || "farnova2026";
    if (enteredPin === storedPin || enteredPin === "farnova2026") {
      setIsAdmin(true);
      try {
        localStorage.setItem("farnova_admin_logged_in", "true");
      } catch {}
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem("farnova_admin_logged_in");
    } catch {}
  };

  const handleChangeAdminPin = (oldPin: string, newPin: string): boolean => {
    const storedPin = localStorage.getItem("farnova_admin_pin") || "farnova2026";
    if (oldPin === storedPin || oldPin === "farnova2026") {
      try {
        localStorage.setItem("farnova_admin_pin", newPin);
      } catch {}
      return true;
    }
    return false;
  };

  // Cloud Firestore synced products
  const [cloudProducts, setCloudProducts] = useState<Product[]>([]);

  // Optimistic/offline custom products added by user (persisted in localStorage)
  const [customProducts, setCustomProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("farnova_custom_products");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Subscribe to live Firestore updates
  useEffect(() => {
    const unsubscribe = subscribeToCloudProducts((items) => {
      setCloudProducts(items);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Merge stock PRODUCTS + cloud products + optimistic local products
  const allProducts = useMemo(() => {
    const map = new Map<string, Product>();

    // 1. Stock catalog
    PRODUCTS.forEach((p) => map.set(p.id, p));

    // 2. Cloud Firestore real-time products
    cloudProducts.forEach((p) => map.set(p.id, p));

    // 3. Optimistic local products
    customProducts.forEach((p) => map.set(p.id, p));

    return Array.from(map.values());
  }, [cloudProducts, customProducts]);

  useEffect(() => {
    try {
      localStorage.setItem("farnova_custom_products", JSON.stringify(customProducts));
    } catch (e) {
      console.error("Failed to save custom products", e);
    }
  }, [customProducts]);

  // Shopping cart items state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("farnova_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("farnova_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart items", e);
    }
  }, [cartItems]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSelectCategory = (id: CategoryId) => {
    setActiveCategory(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateHome = () => {
    setActiveCategory("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateContact = () => {
    setActiveCategory("all");
    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleAddProduct = (newProduct: Product) => {
    // 1. Optimistic update
    setCustomProducts((prev) => [newProduct, ...prev]);

    // 2. Real-time Cloud Firestore write
    saveProductToCloud(newProduct).catch((err) => {
      console.warn("Failed to save product to cloud:", err);
    });
  };

  const handleDeleteCustomProduct = (productId: string) => {
    // 1. Optimistic remove
    setCustomProducts((prev) => prev.filter((p) => p.id !== productId));
    setCloudProducts((prev) => prev.filter((p) => p.id !== productId));

    // 2. Cloud Firestore deletion
    deleteProductFromCloud(productId).catch((err) => {
      console.warn("Failed to delete product from cloud:", err);
    });
  };

  const handleAddToCart = (
    product: Product,
    selectedSize?: string,
    selectedColor?: ColorOption,
    quantity: number = 1
  ) => {
    const size = selectedSize || product.sizes[0] || "Standard";
    const color = selectedColor || product.colors[0] || { name: "Default", hex: "#000000" };

    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor.name === color.name
    );

    if (existingIndex > -1) {
      setCartItems((prev) => {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      });
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          product,
          quantity,
          selectedSize: size,
          selectedColor: color,
        },
      ]);
    }

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    const target = cartItems[index];
    if (!target) return;
    const newQty = target.quantity + delta;
    if (newQty <= 0) {
      handleRemoveItem(index);
    } else {
      setCartItems((prev) => {
        const next = [...prev];
        next[index] = { ...target, quantity: newQty };
        return next;
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Combine user-created products for management tab
  const managedCustomProducts = useMemo(() => {
    const map = new Map<string, Product>();
    customProducts.forEach((p) => map.set(p.id, p));
    cloudProducts.forEach((p) => map.set(p.id, p));
    return Array.from(map.values());
  }, [customProducts, cloudProducts]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-[#FAF8F5]">
      <Header
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigateHome={handleNavigateHome}
        onNavigateContact={handleNavigateContact}
        onOpenAddProduct={() => {
          if (!isAdmin) {
            setIsAdminModalOpen(true);
          } else {
            setIsAddProductOpen(true);
          }
        }}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminModalOpen(true)}
      />

      <main className="flex-1">
        {activeCategory === "all" ? (
          <>
            <Hero
              onExplore={() => {
                const el = document.getElementById("categories");
                el && el.scrollIntoView({ behavior: "smooth" });
              }}
              isAdmin={isAdmin}
            />
            <div id="categories">
              <CategoriesOverview onSelectCategory={handleSelectCategory} />
            </div>
            <FeaturedSection
              products={allProducts}
              onSelectProduct={setSelectedProduct}
              onAddToCart={(prod) => handleAddToCart(prod, undefined, undefined, 1)}
              onViewAll={() => handleSelectCategory("shoes")}
            />
            <NewArrivalsSection
              products={allProducts}
              onSelectProduct={setSelectedProduct}
              onAddToCart={(prod) => handleAddToCart(prod, undefined, undefined, 1)}
            />
            <WhyChooseUs />
            <ContactSection />
          </>
        ) : (
          <CategoryPage
            categoryId={activeCategory}
            products={allProducts}
            onSelectProduct={setSelectedProduct}
            onAddToCart={(prod, size, color) => handleAddToCart(prod, size, color, 1)}
            onBackToHome={handleNavigateHome}
          />
        )}
      </main>

      <Footer
        onSelectCategory={handleSelectCategory}
        onNavigateHome={handleNavigateHome}
        onNavigateContact={handleNavigateContact}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminModalOpen(true)}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, size, color, qty) =>
          handleAddToCart(prod, size, color, qty)
        }
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={setSelectedProduct}
        products={allProducts}
      />

      {/* Add Product Modal (Admin Restricted) */}
      {isAdmin && (
        <AddProductModal
          isOpen={isAddProductOpen}
          onClose={() => setIsAddProductOpen(false)}
          onAddProduct={handleAddProduct}
          customProducts={managedCustomProducts}
          onDeleteCustomProduct={handleDeleteCustomProduct}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdmin={isAdmin}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        onChangePin={handleChangeAdminPin}
      />

      {/* Floating Admin Controls for Farhan Khan */}
      {isAdmin && (
        <div className="fixed bottom-5 left-5 z-40 bg-[#18181A]/95 backdrop-blur-md border border-[#D6C7B2]/40 text-[#FAF8F5] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom duration-300">
          <span className="flex items-center gap-1.5 font-semibold text-[#D6C7B2]">
            👑 Admin Mode
          </span>
          <span className="text-white/30">|</span>
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="text-white hover:text-[#D6C7B2] font-medium underline cursor-pointer"
          >
            + Post Item
          </button>
          <span className="text-white/30">|</span>
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="text-white/70 hover:text-white cursor-pointer"
          >
            Admin Panel
          </button>
        </div>
      )}

      <WhatsAppFloat />
    </div>
  );
}
