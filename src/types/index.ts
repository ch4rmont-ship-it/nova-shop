export type Role = "customer" | "admin";
export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  active: boolean;
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  priceCents: number;
  salePriceCents: number | null;
  stock: number;
  featured: boolean;
  bestseller: boolean;
  active: boolean;
  rating: number;
  reviewCount: number;
  specifications: Record<string, string>;
  images: string[];
  createdAt: string;
};

export type CartLine = { productId: string; quantity: number };

export type AddressInput = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  state: string;
  addressLine1: string;
  postalCode: string;
};
