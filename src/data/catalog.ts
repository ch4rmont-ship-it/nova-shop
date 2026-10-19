import type { Category, Product } from "@/types";

export const categories: Category[] = [
  {
    "id": "11111111-1111-4111-8111-111111111111",
    "name": "Drive",
    "slug": "drive",
    "description": "Машинд өдөр бүр хэрэг болох цэвэрхэн, практик аксессуарууд.",
    "imageUrl": "/categories/drive.svg",
    "active": true
  },
  {
    "id": "22222222-2222-4222-8222-222222222222",
    "name": "Desk",
    "slug": "desk",
    "description": "Ажил, хичээлийн ширээг цэгцтэй, тухтай болгох хэрэгслүүд.",
    "imageUrl": "/categories/desk.svg",
    "active": true
  },
  {
    "id": "33333333-3333-4333-8333-333333333333",
    "name": "Organize",
    "slug": "organize",
    "description": "Гэр, шүүгээ, өдөр тутмын жижиг зүйлсийн ухаалаг эмх цэгц.",
    "imageUrl": "/categories/organize.svg",
    "active": true
  },
  {
    "id": "44444444-4444-4444-8444-444444444444",
    "name": "Carry",
    "slug": "carry",
    "description": "Аялал, сургууль, оффист авч явахад зориулсан хөнгөн organizer.",
    "imageUrl": "/categories/carry.svg",
    "active": true
  }
];

export const products: Product[] = [
{
  "id": "00000000-0000-4000-8000-000000000001",
  "categoryId": "11111111-1111-4111-8111-111111111111",
  "brand": "NOVA Select",
  "name": "Magnetic Car Mount",
  "slug": "magnetic-car-mount",
  "sku": "NV-DRV-001",
  "shortDescription": "MagSafe төрлийн утсанд зориулсан жижиг, хүчтэй соронзон машины суурь.",
  "description": "Өдөр тутмын navigation-д зориулагдсан авсаархан соронзон суурь. Хэвтээ/босоо өнцгийг хурдан өөрчилж, dashboard орчмыг цэвэрхэн харагдуулна.",
  "priceCents": 2200000,
  "salePriceCents": null,
  "stock": 28,
  "featured": true,
  "bestseller": true,
  "active": true,
  "rating": 0,
  "reviewCount": 0,
  "specifications": {
    "Суурилуулалт": "Dashboard / төв хэсэг",
    "Тохируулга": "360° эргэлт",
    "Материал": "ABS + silicone",
    "Тохиромж": "MagSafe төрлийн утас"
  },
  "images": [
    "/products/magnetic-car-mount.svg"
  ],
  "createdAt": "2026-10-19T09:00:00Z"
},
{
  "id": "00000000-0000-4000-8000-000000000002",
  "categoryId": "11111111-1111-4111-8111-111111111111",
  "brand": "NOVA Select",
  "name": "Gravity Air-Vent Mount",
  "slug": "gravity-air-vent-mount",
  "sku": "NV-DRV-002",
  "shortDescription": "Утсаа тавихад автоматаар түгжигддэг air-vent суурь.",
  "description": "Нэг гараар утсаа тавьж, авахад зориулсан gravity locking хийц. Хотын өдөр тутмын зам, navigation хэрэглээнд энгийн бөгөөд тогтвортой сонголт.",
  "priceCents": 2300000,
  "salePriceCents": null,
  "stock": 22,
  "featured": false,
  "bestseller": true,
  "active": true,
  "rating": 0,
  "reviewCount": 0,
  "specifications": {
    "Суурилуулалт": "Air vent",
    "Түгжээ": "Gravity auto-lock",
    "Материал": "Aluminum + silicone",
    "Хэрэглээ": "Нэг гараар"
  },
  "images": [
    "/products/gravity-air-vent-mount.svg"
  ],
  "createdAt": "2026-10-18T09:00:00Z"
},
{
  "id": "00000000-0000-4000-8000-000000000003",
  "categoryId": "11111111-1111-4111-8111-111111111111",
  "brand": "NOVA Select",
  "name": "Foldable Trunk Box 30L",
  "slug": "foldable-trunk-box-30l",
  "sku": "NV-DRV-003",
  "shortDescription": "Хэрэглэхгүй үедээ хавтгай эвхэгддэг 30L машины organizer.",
  "description": "Ус, цэвэрлэгээний хэрэгсэл, жижиг цүнх, авто аксессуар зэргийг нэг дор эмхлэхэд зориулсан хөнгөн trunk box.",
  "priceCents": 1800000,
  "salePriceCents": null,
  "stock": 18,
  "featured": true,
  "bestseller": false,
  "active": true,
  "rating": 0,
  "reviewCount": 0,
  "specifications": {
    "Багтаамж": "30L орчим",
    "Хийц": "Эвхэгддэг",
    "Бариул": "2 талдаа",
    "Хэрэглээ": "Машин / пикник"
  },
  "images": [
    "/products/foldable-trunk-box-30l.svg"
  ],
  "createdAt": "2026-10-17T09:00:00Z"
},
{
  "id": "00000000-0000-4000-8000-000000000004",
  "categoryId": "11111111-1111-4111-8111-111111111111",
  "brand": "NOVA Select",
  "name": "Premium Trunk Organizer 60L",
  "slug": "premium-trunk-organizer-60l",
  "sku": "NV-DRV-004",
  "shortDescription": "Том машин, аялал, кемпингт зориулсан 60L эвхэгддэг organizer.",
  "description": "Том багтаамжтай, хэрэглээгүй үед эвхэж хадгалах боломжтой. Машины тээшний хэсгийг цэгцлэхээс гадна аяллын үед сав болгон ашиглаж болно.",
  "priceCents": 8700000,
  "salePriceCents": null,
  "stock": 9,
  "featured": true,
  "bestseller": true,
  "active": true,
  "rating": 0,
  "reviewCount": 0,
  "specifications": {
    "Багтаамж": "60L",
    "Материал": "Oxford fabric",
    "Хэмжээ": "60 × 35 × 30 cm орчим",
    "Хийц": "Эвхэгддэг"
  },
  "images": [
    "/products/premium-trunk-organizer-60l.svg"
  ],
  "createdAt": "2026-10-16T09:00:00Z"
},
{
  "id": "00000000-0000-4000-8000-000000000005",
  "categoryId": "22222222-2222-4222-8222-222222222222",
  "brand": "NOVA Select",
  "name": "Aluminum Laptop Stand X6",
  "slug": "aluminum-laptop-stand-x6",
  "sku": "NV-DSK-001",
  "shortDescription": "16 инч хүртэлх ноутбукт зориулсан эвхэгддэг aluminum stand.",
  "description": "Дэлгэцийг нүдний түвшинд ойртуулж, ширээний суултыг сайжруулахад зориулагдсан. Хөнгөн, эвхэгддэг тул сургууль болон оффист авч явахад тохиромжтой.",
  "priceCents": 2300000,
  "salePriceCents": null,
  "stock": 31,
  "featured": true,
  "bestseller": true,
  "active": true,
  "rating": 0,
  "reviewCount": 0,
  "specifications": {
    "Материал": "Бүхэл aluminum",
    "Тохиромж": "16 inch хүртэл",
    "Жин": "~230g",
    "Хийц": "Foldable / adjustable"
  },
  "images": [
    "/products/aluminum-laptop-stand-x6.svg"
  ],
  "createdAt": "2026-10-15T09:00:00Z"
},
{
  "id": "00000000-0000-4000-8000-000000000006",
  "categoryId": "22222222-2222-4222-8222-222222222222",
  "brand": "NOVA Select",
  "name": "Tech Organizer Pouch",
  "slug": "tech-organizer-pouch",
  "sku": "NV-DSK-002",
  "shortDescription": "Cable, charger, mouse, SSD зэргийг нэг дор хадгалах compact pouch.",
  "description": "Өдөр тутмын tech хэрэгслүүдийг тус тусын тасалгаанд цэгцлэхэд зориулсан жижиг organizer. Оффис, сургууль, аялалд тохиромжтой.",
  "priceCents": 1500000,
  "salePriceCents": null,
  "stock": 36,
  "featured": true,
  "bestseller": true,
  "active": true,
  "rating": 0,
  "reviewCount": 0,
  "specifications": {
    "Материал": "Oxford fabric",
    "Хэмжээ": "~165 × 100 × 55 mm",
    "Дотор": "Олон тасалгаатай",
    "Хэрэглээ": "Office / travel"
  },
  "images": [
    "/products/tech-organizer-pouch.svg"
  ],
  "createdAt": "2026-10-14T09:00:00Z"
},
{
  "id": "00000000-0000-4000-8000-000000000007",
  "categoryId": "22222222-2222-4222-8222-222222222222",
  "brand": "NOVA Select",
  "name": "Magnetic Cable Clips · 3 Pack",
  "slug": "magnetic-cable-clips-3-pack",
  "sku": "NV-DSK-003",
  "shortDescription": "Ширээн дээрх charging cable-уудыг нэг хөдөлгөөнөөр тогтоох 3 ширхэг clip.",
  "description": "Утас, чихэвч, keyboard cable зэрэг ширээн дээр байнга унадаг шугамуудыг тогтоох жижиг magnetic organizer.",
  "priceCents": 1200000,
  "salePriceCents": null,
  "stock": 44,
  "featured": false,
  "bestseller": true,
  "active": true,
  "rating": 0,
  "reviewCount": 0,
  "specifications": {
    "Тоо": "3 ширхэг",
    "Төрөл": "Magnetic clip",
    "Суурь": "Наалттай",
    "Өнгө": "Charcoal"
  },
  "images": [
    "/products/magnetic-cable-clips.svg"
  ],
  "createdAt": "2026-10-13T09:00:00Z"
},
{
  "id": "00000000-0000-4000-8000-000000000008",
  "categoryId": "22222222-2222-4222-8222-222222222222",
  "brand": "NOVA Select",
  "name": "Large PU Desk Mat",
  "slug": "large-pu-desk-mat",
  "sku": "NV-DSK-004",
  "shortDescription": "Keyboard, mouse, notebook-оо нэг гадаргуун дээр цэгцлэх том PU desk mat.",
  "description": "Зөөлөн бичих гадаргуу, ус тосны хамгаалалттай том desk mat. Sage, sand, charcoal өнгийн setup-т сайн зохицно.",
  "priceCents": 6600000,
  "salePriceCents": null,
  "stock": 14,
  "featured": true,
  "bestseller": false,
  "active": true,
  "rating": 0,
  "reviewCount": 0,
  "specifications": {
    "Материал": "PU",
    "Хэмжээ": "60 × 120 cm",
    "Зузаан": "~2 mm",
    "Онцлог": "Water-resistant"
  },
  "images": [
    "/products/large-pu-desk-mat.svg"
  ],
  "createdAt": "2026-10-12T09:00:00Z"
},
{
  "id": "00000000-0000-4000-8000-000000000009",
  "categoryId": "33333333-3333-4333-8333-333333333333",
  "brand": "NOVA Select",
  "name": "A4 Desktop Drawer · 3 Tier",
  "slug": "a4-desktop-drawer-3-tier",
  "sku": "NV-ORG-001",
  "shortDescription": "Бичиг баримт, косметик, жижиг хэрэгслийг ангилах 3 давхар ширээний drawer.",
  "description": "A4 хэмжээний зүйлс багтах 3 давхар drawer organizer. Сургууль, гэрийн office, makeup desk дээр ашиглахад тохиромжтой.",
  "priceCents": 5100000,
  "salePriceCents": null,
  "stock": 12,
  "featured": true,
  "bestseller": false,
  "active": true,
  "rating": 0,
  "reviewCount": 0,
  "specifications": {
    "Давхар": "3",
    "Хэмжээ": "A4 compatible",
    "Хийц": "Transparent drawer",
    "Хэрэглээ": "Desk / vanity"
  },
  "images": [
    "/products/a4-desktop-drawer.svg"
  ],
  "createdAt": "2026-10-11T09:00:00Z"
},
{
  "id": "00000000-0000-4000-8000-000000000010",
  "categoryId": "33333333-3333-4333-8333-333333333333",
  "brand": "NOVA Select",
  "name": "Vacuum Storage Set · 9 Pack",
  "slug": "vacuum-storage-set-9-pack",
  "sku": "NV-ORG-002",
  "shortDescription": "Өвлийн куртка, хөнжил, улирлын хувцасны эзлэхүүнийг багасгах 9-piece set.",
  "description": "Олон хэмжээтэй vacuum bag + гар pump бүхий багц. Монголын улирлын хувцас, хөнжил хадгалалтад практик.",
  "priceCents": 2000000,
  "salePriceCents": null,
  "stock": 24,
  "featured": true,
  "bestseller": true,
  "active": true,
  "rating": 0,
  "reviewCount": 0,
  "specifications": {
    "Багц": "9 piece",
    "Шахалт": "Hand pump",
    "Онцлог": "Water-resistant",
    "Хэрэглээ": "Seasonal storage"
  },
  "images": [
    "/products/vacuum-storage-set.svg"
  ],
  "createdAt": "2026-10-10T09:00:00Z"
},
{
  "id": "00000000-0000-4000-8000-000000000011",
  "categoryId": "44444444-4444-4444-8444-444444444444",
  "brand": "NOVA Select",
  "name": "Travel Organizer · 7 Piece",
  "slug": "travel-organizer-7-piece",
  "sku": "NV-CRY-001",
  "shortDescription": "Хувцас, гутал, жижиг хэрэгслийг тус тусад нь ангилах 7-piece travel set.",
  "description": "Чемоданы доторх зүйлсийг нэг дор цэгцлэх mesh panel бүхий 7 ширхэг organizer. Оюутан, аялал, бизнес trip-д тохиромжтой.",
  "priceCents": 3000000,
  "salePriceCents": null,
  "stock": 27,
  "featured": true,
  "bestseller": true,
  "active": true,
  "rating": 0,
  "reviewCount": 0,
  "specifications": {
    "Багц": "7 piece",
    "Материал": "Fabric + mesh",
    "Төрөл": "Packing cubes",
    "Хэрэглээ": "Travel / dorm"
  },
  "images": [
    "/products/travel-organizer-7-piece.svg"
  ],
  "createdAt": "2026-10-19T09:00:00Z"
},
{
  "id": "00000000-0000-4000-8000-000000000012",
  "categoryId": "44444444-4444-4444-8444-444444444444",
  "brand": "NOVA Select",
  "name": "Compression Travel Bags · 2 Pack",
  "slug": "compression-travel-bags-2-pack",
  "sku": "NV-CRY-002",
  "shortDescription": "Өвлийн зузаан хувцсыг чемоданд илүү бага зай эзлүүлэх 2-piece compression bag.",
  "description": "Double-zip compression хийцтэй, medium + large 2 ширхэг багц. Ялангуяа өвлийн аялал, урт хугацааны trip-д тохиромжтой.",
  "priceCents": 2200000,
  "salePriceCents": null,
  "stock": 30,
  "featured": false,
  "bestseller": true,
  "active": true,
  "rating": 0,
  "reviewCount": 0,
  "specifications": {
    "Багц": "Medium + Large",
    "Материал": "Water-resistant fabric",
    "Шахалт": "Double zipper",
    "Хэрэглээ": "Winter travel"
  },
  "images": [
    "/products/compression-travel-bags.svg"
  ],
  "createdAt": "2026-10-18T09:00:00Z"
},
{
  "id": "00000000-0000-4000-8000-000000000013",
  "categoryId": "44444444-4444-4444-8444-444444444444",
  "brand": "NOVA Select",
  "name": "Foldable Carry-On Bag 21L",
  "slug": "foldable-carry-on-bag-21l",
  "sku": "NV-CRY-003",
  "shortDescription": "Чемоданы бариул дээр тогтоодог, эвхэгддэг 21L нэмэлт аяллын цүнх.",
  "description": "2-3 өдрийн аялал эсвэл нэмэлт carry bag болгон ашиглахад тохиромжтой. Ашиглахгүй үед жижиг болгон эвхэж хадгална.",
  "priceCents": 1900000,
  "salePriceCents": null,
  "stock": 21,
  "featured": true,
  "bestseller": false,
  "active": true,
  "rating": 0,
  "reviewCount": 0,
  "specifications": {
    "Багтаамж": "21L",
    "Материал": "210D Oxford",
    "Онцлог": "Foldable / trolley sleeve",
    "Хэмжээ": "~44 × 33 × 15 cm"
  },
  "images": [
    "/products/foldable-carry-on-bag.svg"
  ],
  "createdAt": "2026-10-17T09:00:00Z"
}
];
