import type { Category, Product } from "@/types";

export const categories: Category[] = [
  {
    "id": "11111111-1111-4111-8111-111111111111",
    "name": "Apparel",
    "slug": "apparel",
    "description": "Elevated everyday essentials with modern silhouettes.",
    "imageUrl": "/categories/apparel.svg",
    "active": true
  },
  {
    "id": "22222222-2222-4222-8222-222222222222",
    "name": "Footwear",
    "slug": "footwear",
    "description": "Comfort-first footwear for city life and weekends.",
    "imageUrl": "/categories/footwear.svg",
    "active": true
  },
  {
    "id": "33333333-3333-4333-8333-333333333333",
    "name": "Tech",
    "slug": "tech",
    "description": "Minimal, useful technology for work and home.",
    "imageUrl": "/categories/tech.svg",
    "active": true
  },
  {
    "id": "44444444-4444-4444-8444-444444444444",
    "name": "Home",
    "slug": "home",
    "description": "Thoughtful objects that make daily spaces feel better.",
    "imageUrl": "/categories/home.svg",
    "active": true
  },
  {
    "id": "55555555-5555-4555-8555-555555555555",
    "name": "Beauty",
    "slug": "beauty",
    "description": "Simple routines, refined formulas, calm packaging.",
    "imageUrl": "/categories/beauty.svg",
    "active": true
  }
];

export const products: Product[] = [
  {
    "id": "00000000-0000-4000-8000-000000000001",
    "categoryId": "11111111-1111-4111-8111-111111111111",
    "name": "Essential Overshirt",
    "slug": "essential-overshirt",
    "sku": "NV-APP-001",
    "shortDescription": "A refined apparel essential designed for everyday use.",
    "description": "Essential Overshirt is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 8900,
    "salePriceCents": 6900,
    "stock": 14,
    "featured": true,
    "bestseller": true,
    "active": true,
    "rating": 4.8,
    "reviewCount": 128,
    "specifications": {
      "Material": "Organic cotton twill",
      "Fit": "Relaxed",
      "Care": "Machine wash cold"
    },
    "images": [
      "/products/essential-overshirt.svg"
    ],
    "createdAt": "2026-01-03T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000002",
    "categoryId": "11111111-1111-4111-8111-111111111111",
    "name": "Studio Knit Tee",
    "slug": "studio-knit-tee",
    "sku": "NV-APP-002",
    "shortDescription": "A refined apparel essential designed for everyday use.",
    "description": "Studio Knit Tee is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 4200,
    "salePriceCents": null,
    "stock": 28,
    "featured": false,
    "bestseller": true,
    "active": true,
    "rating": 4.7,
    "reviewCount": 86,
    "specifications": {
      "Material": "Heavyweight cotton",
      "Fit": "Regular",
      "Weight": "240 gsm"
    },
    "images": [
      "/products/studio-knit-tee.svg"
    ],
    "createdAt": "2026-02-06T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000003",
    "categoryId": "11111111-1111-4111-8111-111111111111",
    "name": "Transit Trousers",
    "slug": "transit-trousers",
    "sku": "NV-APP-003",
    "shortDescription": "A refined apparel essential designed for everyday use.",
    "description": "Transit Trousers is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 7600,
    "salePriceCents": 6400,
    "stock": 9,
    "featured": true,
    "bestseller": false,
    "active": true,
    "rating": 4.6,
    "reviewCount": 64,
    "specifications": {
      "Material": "Stretch woven",
      "Fit": "Tapered",
      "Pockets": "5"
    },
    "images": [
      "/products/transit-trousers.svg"
    ],
    "createdAt": "2026-03-09T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000004",
    "categoryId": "11111111-1111-4111-8111-111111111111",
    "name": "Merino Zip Cardigan",
    "slug": "merino-zip-cardigan",
    "sku": "NV-APP-004",
    "shortDescription": "A refined apparel essential designed for everyday use.",
    "description": "Merino Zip Cardigan is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 11800,
    "salePriceCents": null,
    "stock": 7,
    "featured": false,
    "bestseller": false,
    "active": true,
    "rating": 4.9,
    "reviewCount": 31,
    "specifications": {
      "Material": "Merino blend",
      "Fit": "Relaxed",
      "Closure": "Two-way zip"
    },
    "images": [
      "/products/merino-zip-cardigan.svg"
    ],
    "createdAt": "2026-04-12T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000005",
    "categoryId": "22222222-2222-4222-8222-222222222222",
    "name": "City Runner 01",
    "slug": "city-runner-01",
    "sku": "NV-FTW-001",
    "shortDescription": "A refined footwear essential designed for everyday use.",
    "description": "City Runner 01 is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 12900,
    "salePriceCents": 10900,
    "stock": 18,
    "featured": true,
    "bestseller": true,
    "active": true,
    "rating": 4.9,
    "reviewCount": 213,
    "specifications": {
      "Upper": "Engineered mesh",
      "Outsole": "Rubber",
      "Drop": "8 mm"
    },
    "images": [
      "/products/city-runner-01.svg"
    ],
    "createdAt": "2026-05-15T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000006",
    "categoryId": "22222222-2222-4222-8222-222222222222",
    "name": "Court Minimal",
    "slug": "court-minimal",
    "sku": "NV-FTW-002",
    "shortDescription": "A refined footwear essential designed for everyday use.",
    "description": "Court Minimal is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 9900,
    "salePriceCents": null,
    "stock": 11,
    "featured": false,
    "bestseller": true,
    "active": true,
    "rating": 4.7,
    "reviewCount": 144,
    "specifications": {
      "Upper": "Leather",
      "Lining": "Recycled textile",
      "Sole": "Rubber"
    },
    "images": [
      "/products/court-minimal.svg"
    ],
    "createdAt": "2026-06-18T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000007",
    "categoryId": "22222222-2222-4222-8222-222222222222",
    "name": "Trail Lite",
    "slug": "trail-lite",
    "sku": "NV-FTW-003",
    "shortDescription": "A refined footwear essential designed for everyday use.",
    "description": "Trail Lite is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 13900,
    "salePriceCents": 11900,
    "stock": 6,
    "featured": true,
    "bestseller": false,
    "active": true,
    "rating": 4.8,
    "reviewCount": 97,
    "specifications": {
      "Upper": "Ripstop mesh",
      "Grip": "All-terrain",
      "Weight": "286 g"
    },
    "images": [
      "/products/trail-lite.svg"
    ],
    "createdAt": "2026-07-21T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000008",
    "categoryId": "22222222-2222-4222-8222-222222222222",
    "name": "Softstep Slide",
    "slug": "softstep-slide",
    "sku": "NV-FTW-004",
    "shortDescription": "A refined footwear essential designed for everyday use.",
    "description": "Softstep Slide is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 4900,
    "salePriceCents": null,
    "stock": 22,
    "featured": false,
    "bestseller": false,
    "active": true,
    "rating": 4.5,
    "reviewCount": 53,
    "specifications": {
      "Upper": "EVA",
      "Footbed": "Contoured",
      "Use": "Indoor / outdoor"
    },
    "images": [
      "/products/softstep-slide.svg"
    ],
    "createdAt": "2026-08-24T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000009",
    "categoryId": "33333333-3333-4333-8333-333333333333",
    "name": "Arc Wireless Headphones",
    "slug": "arc-wireless-headphones",
    "sku": "NV-TEC-001",
    "shortDescription": "A refined tech essential designed for everyday use.",
    "description": "Arc Wireless Headphones is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 19900,
    "salePriceCents": 16900,
    "stock": 13,
    "featured": true,
    "bestseller": true,
    "active": true,
    "rating": 4.9,
    "reviewCount": 308,
    "specifications": {
      "Battery": "38 hours",
      "Charging": "USB-C",
      "ANC": "Adaptive"
    },
    "images": [
      "/products/arc-wireless-headphones.svg"
    ],
    "createdAt": "2026-09-27T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000010",
    "categoryId": "33333333-3333-4333-8333-333333333333",
    "name": "Desk Dock Pro",
    "slug": "desk-dock-pro",
    "sku": "NV-TEC-002",
    "shortDescription": "A refined tech essential designed for everyday use.",
    "description": "Desk Dock Pro is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 14900,
    "salePriceCents": null,
    "stock": 8,
    "featured": false,
    "bestseller": true,
    "active": true,
    "rating": 4.7,
    "reviewCount": 121,
    "specifications": {
      "Ports": "9",
      "Display": "Dual 4K",
      "Power": "100W PD"
    },
    "images": [
      "/products/desk-dock-pro.svg"
    ],
    "createdAt": "2026-01-03T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000011",
    "categoryId": "33333333-3333-4333-8333-333333333333",
    "name": "Pocket Power 10K",
    "slug": "pocket-power-10k",
    "sku": "NV-TEC-003",
    "shortDescription": "A refined tech essential designed for everyday use.",
    "description": "Pocket Power 10K is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 6900,
    "salePriceCents": 5900,
    "stock": 31,
    "featured": false,
    "bestseller": false,
    "active": true,
    "rating": 4.6,
    "reviewCount": 77,
    "specifications": {
      "Capacity": "10,000 mAh",
      "Output": "30W",
      "Weight": "184 g"
    },
    "images": [
      "/products/pocket-power-10k.svg"
    ],
    "createdAt": "2026-02-06T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000012",
    "categoryId": "33333333-3333-4333-8333-333333333333",
    "name": "Halo Desk Lamp",
    "slug": "halo-desk-lamp",
    "sku": "NV-TEC-004",
    "shortDescription": "A refined tech essential designed for everyday use.",
    "description": "Halo Desk Lamp is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 11900,
    "salePriceCents": null,
    "stock": 10,
    "featured": true,
    "bestseller": false,
    "active": true,
    "rating": 4.8,
    "reviewCount": 88,
    "specifications": {
      "Brightness": "5 levels",
      "Temperature": "3 modes",
      "Charging": "Qi2 wireless"
    },
    "images": [
      "/products/halo-desk-lamp.svg"
    ],
    "createdAt": "2026-03-09T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000013",
    "categoryId": "44444444-4444-4444-8444-444444444444",
    "name": "Stoneware Mug Set",
    "slug": "stoneware-mug-set",
    "sku": "NV-HOM-001",
    "shortDescription": "A refined home essential designed for everyday use.",
    "description": "Stoneware Mug Set is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 5800,
    "salePriceCents": null,
    "stock": 24,
    "featured": true,
    "bestseller": true,
    "active": true,
    "rating": 4.8,
    "reviewCount": 102,
    "specifications": {
      "Material": "Stoneware",
      "Pieces": "4",
      "Dishwasher safe": "Yes"
    },
    "images": [
      "/products/stoneware-mug-set.svg"
    ],
    "createdAt": "2026-04-12T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000014",
    "categoryId": "44444444-4444-4444-8444-444444444444",
    "name": "Linen Throw",
    "slug": "linen-throw",
    "sku": "NV-HOM-002",
    "shortDescription": "A refined home essential designed for everyday use.",
    "description": "Linen Throw is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 9200,
    "salePriceCents": 7900,
    "stock": 5,
    "featured": false,
    "bestseller": false,
    "active": true,
    "rating": 4.7,
    "reviewCount": 43,
    "specifications": {
      "Material": "Linen cotton",
      "Size": "130 × 180 cm",
      "Care": "Gentle wash"
    },
    "images": [
      "/products/linen-throw.svg"
    ],
    "createdAt": "2026-05-15T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000015",
    "categoryId": "44444444-4444-4444-8444-444444444444",
    "name": "Scented Candle No. 04",
    "slug": "scented-candle-no-04",
    "sku": "NV-HOM-003",
    "shortDescription": "A refined home essential designed for everyday use.",
    "description": "Scented Candle No. 04 is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 4600,
    "salePriceCents": null,
    "stock": 19,
    "featured": false,
    "bestseller": true,
    "active": true,
    "rating": 4.9,
    "reviewCount": 156,
    "specifications": {
      "Burn time": "55 hours",
      "Wax": "Soy blend",
      "Scent": "Fig / cedar"
    },
    "images": [
      "/products/scented-candle-no-04.svg"
    ],
    "createdAt": "2026-06-18T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000016",
    "categoryId": "44444444-4444-4444-8444-444444444444",
    "name": "Modular Tray",
    "slug": "modular-tray",
    "sku": "NV-HOM-004",
    "shortDescription": "A refined home essential designed for everyday use.",
    "description": "Modular Tray is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 6400,
    "salePriceCents": null,
    "stock": 16,
    "featured": true,
    "bestseller": false,
    "active": true,
    "rating": 4.6,
    "reviewCount": 49,
    "specifications": {
      "Material": "Powder-coated steel",
      "Size": "30 × 20 cm",
      "Finish": "Matte"
    },
    "images": [
      "/products/modular-tray.svg"
    ],
    "createdAt": "2026-07-21T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000017",
    "categoryId": "55555555-5555-4555-8555-555555555555",
    "name": "Barrier Serum",
    "slug": "barrier-serum",
    "sku": "NV-BTY-001",
    "shortDescription": "A refined beauty essential designed for everyday use.",
    "description": "Barrier Serum is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 5200,
    "salePriceCents": 4400,
    "stock": 27,
    "featured": true,
    "bestseller": true,
    "active": true,
    "rating": 4.9,
    "reviewCount": 264,
    "specifications": {
      "Size": "30 ml",
      "Skin type": "All",
      "Fragrance": "Free"
    },
    "images": [
      "/products/barrier-serum.svg"
    ],
    "createdAt": "2026-08-24T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000018",
    "categoryId": "55555555-5555-4555-8555-555555555555",
    "name": "Mineral Daily SPF 40",
    "slug": "mineral-daily-spf-40",
    "sku": "NV-BTY-002",
    "shortDescription": "A refined beauty essential designed for everyday use.",
    "description": "Mineral Daily SPF 40 is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 3800,
    "salePriceCents": null,
    "stock": 34,
    "featured": false,
    "bestseller": true,
    "active": true,
    "rating": 4.8,
    "reviewCount": 198,
    "specifications": {
      "Size": "50 ml",
      "Finish": "Natural",
      "Water resistant": "40 min"
    },
    "images": [
      "/products/mineral-daily-spf-40.svg"
    ],
    "createdAt": "2026-09-27T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000019",
    "categoryId": "55555555-5555-4555-8555-555555555555",
    "name": "Cloud Cleanser",
    "slug": "cloud-cleanser",
    "sku": "NV-BTY-003",
    "shortDescription": "A refined beauty essential designed for everyday use.",
    "description": "Cloud Cleanser is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 3200,
    "salePriceCents": null,
    "stock": 40,
    "featured": false,
    "bestseller": false,
    "active": true,
    "rating": 4.7,
    "reviewCount": 91,
    "specifications": {
      "Size": "150 ml",
      "Texture": "Gel cream",
      "Fragrance": "Free"
    },
    "images": [
      "/products/cloud-cleanser.svg"
    ],
    "createdAt": "2026-01-03T09:00:00Z"
  },
  {
    "id": "00000000-0000-4000-8000-000000000020",
    "categoryId": "55555555-5555-4555-8555-555555555555",
    "name": "Night Recovery Cream",
    "slug": "night-recovery-cream",
    "sku": "NV-BTY-004",
    "shortDescription": "A refined beauty essential designed for everyday use.",
    "description": "Night Recovery Cream is part of the NOVA core collection: practical, understated, and built around materials and details that feel considered in daily use.",
    "priceCents": 6200,
    "salePriceCents": 5400,
    "stock": 12,
    "featured": true,
    "bestseller": false,
    "active": true,
    "rating": 4.8,
    "reviewCount": 73,
    "specifications": {
      "Size": "50 ml",
      "Texture": "Rich cream",
      "Use": "PM"
    },
    "images": [
      "/products/night-recovery-cream.svg"
    ],
    "createdAt": "2026-02-06T09:00:00Z"
  }
];

export const productBySlug = (slug: string) => products.find((product) => product.slug === slug);
export const categoryBySlug = (slug: string) => categories.find((category) => category.slug === slug);
