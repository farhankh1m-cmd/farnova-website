export interface ColorOption {
  name: string;
  hex: string;
}

export type CategoryId = 'shoes' | 'watches' | 'shirts' | 'pants' | 'bundles';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: CategoryId;
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  shortDescription: string;
  description: string;
  features: string[];
  sizes: string[];
  colors: ColorOption[];
  stockStatus: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  material: string;
  rating: number;
  reviewCount: number;
}

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  image: string;
  subcategories: string[];
}

export interface BundleDeal {
  id: string;
  title: string;
  productIds: string[];
  includedProductNames: string[];
  originalPrice: number;
  offerPrice: number;
  discountBadge: string;
  image: string;
  description?: string;
  createdAt: string;
}

export interface CustomBundleDiscounts {
  twoItems: number; // default 15
  threeItems: number; // default 25
  fourItems: number; // default 35
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: ColorOption;
  isBundle?: boolean;
  bundleDealId?: string;
  includedItems?: string[];
}
