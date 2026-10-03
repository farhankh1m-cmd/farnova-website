import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  setLogLevel,
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";
import { Product } from "./types";

// Suppress Firestore verbose connection logs in sandbox/iframe environments
setLogLevel("silent");

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Force long-polling to connect immediately without 10s WebSocket timeout in iframes
export const db = initializeFirestore(
  app,
  {
    experimentalForceLongPolling: true,
  },
  firebaseConfig.firestoreDatabaseId
);

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): void {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: false,
      isAnonymous: true,
    },
    operationType,
    path,
  };
  console.debug("Firestore Notice: ", JSON.stringify(errInfo));
}

// Subscribe to real-time products collection from cloud Firestore
export function subscribeToCloudProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (error: Error) => void
) {
  const colPath = "products";
  try {
    const colRef = collection(db, colPath);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: Product[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            name: data.name || "Untitled",
            sku: data.sku || `FN-${docSnap.id.slice(0, 6)}`,
            category: data.category || "shoes",
            subcategory: data.subcategory || "Exclusive",
            price: Number(data.price) || 0,
            originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
            image: data.image || "",
            shortDescription: data.shortDescription || "",
            description: data.description || "",
            features: Array.isArray(data.features) ? data.features : [],
            sizes: Array.isArray(data.sizes) ? data.sizes : ["Standard"],
            colors: Array.isArray(data.colors) ? data.colors : [],
            stockStatus: data.stockStatus || "In Stock",
            isFeatured: Boolean(data.isFeatured),
            isNewArrival: Boolean(data.isNewArrival),
            material: data.material || "Premium Quality",
            rating: 5.0,
            reviewCount: 1,
          });
        });
        onUpdate(items);
      },
      (error) => {
        // Handled silently to allow offline operation
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.debug("Firestore subscription notice:", err);
  }
}

// Save a product to Cloud Firestore
export async function saveProductToCloud(product: Product): Promise<void> {
  const colPath = `products/${product.id}`;
  try {
    const cleanData = {
      id: product.id,
      name: product.name,
      sku: product.sku || `FN-${product.id}`,
      category: product.category,
      subcategory: product.subcategory || "Exclusive",
      price: product.price,
      originalPrice: product.originalPrice || null,
      image: product.image,
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      features: product.features || [],
      sizes: product.sizes || ["Standard"],
      colors: product.colors || [],
      stockStatus: product.stockStatus || "In Stock",
      isFeatured: Boolean(product.isFeatured),
      isNewArrival: Boolean(product.isNewArrival),
      material: product.material || "Premium Quality",
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "products", product.id), cleanData);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, colPath);
  }
}

// Delete a product from Cloud Firestore
export async function deleteProductFromCloud(productId: string): Promise<void> {
  const colPath = `products/${productId}`;
  try {
    await deleteDoc(doc(db, "products", productId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, colPath);
  }
}

// Save custom Hero image to Cloud Firestore
export async function saveHeroImageToCloud(imageUrl: string): Promise<void> {
  const colPath = "settings/hero";
  try {
    await setDoc(doc(db, "settings", "hero"), {
      imageUrl,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, colPath);
  }
}

// Subscribe to Cloud Firestore Hero Image with resilient error handler
export function subscribeToCloudHero(onUpdate: (imageUrl: string) => void) {
  try {
    return onSnapshot(
      doc(db, "settings", "hero"),
      (docSnap) => {
        if (docSnap.exists() && docSnap.data().imageUrl) {
          onUpdate(docSnap.data().imageUrl);
        }
      },
      (_error) => {
        // Handled silently
      }
    );
  } catch (err) {
    console.debug("Failed to subscribe to hero image setting", err);
  }
}
