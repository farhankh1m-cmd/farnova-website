import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer,
  query,
  orderBy,
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";
import { Product } from "./types";

const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with the exact database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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
): never {
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
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot as mandated by Firestore guidelines
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firestore client is offline, check connection.");
    }
  }
}

// Subscribe to real-time products collection from cloud Firestore
export function subscribeToCloudProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (error: Error) => void
) {
  const colPath = "products";
  try {
    const q = query(collection(db, colPath), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
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
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, colPath);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, colPath);
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
