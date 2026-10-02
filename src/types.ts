export interface ColorOption {
  name: string;
  hex: string;
}

export type CategoryId = 'shoes' | 'watches' | 'shirts' | 'pants';

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

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: ColorOption;
}
