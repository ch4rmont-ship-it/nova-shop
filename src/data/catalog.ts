import type { Category, Product } from "@/types";
export const categories: Category[] = [
  {
    "id": "11111111-1111-4111-8111-111111111111",
    "name": "Drive",
    "slug": "drive",
    "description": "Машинд өдөр бүр хэрэг болох цэвэрхэн, практик аксессуарууд.",
    "imageUrl": "/products/ugreen-35057-aux-0.jpg",
    "active": true
  },
  {
    "id": "22222222-2222-4222-8222-222222222222",
    "name": "Desk",
    "slug": "desk",
    "description": "Ажил, хичээлийн ширээг цэгцтэй, тухтай болгох хэрэгслүүд.",
    "imageUrl": "/products/ugreen-70585-clips-0.jpg",
    "active": true
  },
  {
    "id": "33333333-3333-4333-8333-333333333333",
    "name": "Organize",
    "slug": "organize",
    "description": "Гэр, шүүгээ, өдөр тутмын жижиг зүйлсийн ухаалаг эмх цэгц.",
    "imageUrl": "/products/green-storage-baskets-0.png",
    "active": true
  },
  {
    "id": "44444444-4444-4444-8444-444444444444",
    "name": "Carry",
    "slug": "carry",
    "description": "Аялал, сургууль, оффист авч явахад зориулсан хөнгөн organizer.",
    "imageUrl": "/products/banzheni-tech-pouch-0.jpg",
    "active": true
  }
];
import productData from "./products.json";
export const products = productData as unknown as Product[];
