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
import {
  subscribeToCloudProducts,
  saveProductToCloud,
  deleteProductFromCloud,
  testFirestoreConnection,
} from "./firebase";

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

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

  // Test connection and subscribe to live Firestore updates
  useEffect(() => {
    testFirestoreConnection();
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("farnova_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const handleSelectCategory = (id: CategoryId) => {
    setActiveCategory(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateHome = () => {
    setActiveCategory("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateContact = () => {
    if (activeCategory !== "all") {
      setActiveCategory("all");
      setTimeout(() => {
        const el = document.getElementById("contact");
        el && el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById("contact");
      el && el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAddProduct = async (newProduct: Product) => {
    // Optimistic local update
    setCustomProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== newProduct.id)]);
    setSelectedProduct(newProduct);

    // Save to Cloud Firestore so all visitors globally see it live!
    try {
      await saveProductToCloud(newProduct);
    } catch (err) {
      console.error("Cloud Firestore sync notice:", err);
    }
  };

  const handleDeleteCustomProduct = async (id: string) => {
    setCustomProducts((prev) => prev.filter((p) => p.id !== id));
    setCloudProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteProductFromCloud(id);
    } catch (err) {
      console.error("Cloud Firestore delete notice:", err);
    }
  };

  const handleAddToCart = (
    product: Product,
    size?: string,
    color?: ColorOption,
    quantity: number = 1
  ) => {
    const selectedSize =
      size || (product.sizes.length > 0 ? product.sizes[0] : "Standard");
    const selectedColor =
      color ||
      (product.colors.length > 0
        ? product.colors[0]
        : { name: "Standard", hex: "#1A1A1A" });

    setCartItems((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor.name === selectedColor.name
      );
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [
        ...prev,
        {
          product,
          selectedSize,
          selectedColor,
          quantity,
        },
      ];
    });
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(index);
    } else {
      setCartItems((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], quantity };
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
        onOpenAddProduct={() => setIsAddProductOpen(true)}
      />

      <main className="flex-1">
        {activeCategory === "all" ? (
          <>
            <Hero
              onExplore={() => {
                const el = document.getElementById("categories");
                el && el.scrollIntoView({ behavior: "smooth" });
              }}
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

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProduct}
        customProducts={managedCustomProducts}
        onDeleteCustomProduct={handleDeleteCustomProduct}
      />

      <WhatsAppFloat />
    </div>
  );
}
