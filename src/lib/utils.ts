export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatMoney(cents: number, currency = "MNT") {
  // Browser ICU support for mn-MN differs from Node. Keep MNT SSR/client identical.
  if (currency.toUpperCase() === "MNT") return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(cents / 100)}₮`;
  return new Intl.NumberFormat("mn-MN", { style: "currency", currency, maximumFractionDigits: 0 }).format(cents / 100);
}

export function effectivePrice(priceCents: number, salePriceCents: number | null) {
  return salePriceCents && salePriceCents < priceCents ? salePriceCents : priceCents;
}

export function discountPercent(priceCents: number, salePriceCents: number | null) {
  if (!salePriceCents || salePriceCents >= priceCents) return 0;
  return Math.round((1 - salePriceCents / priceCents) * 100);
}

export function safeSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
