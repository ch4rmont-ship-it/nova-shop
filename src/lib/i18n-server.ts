import { cookies } from "next/headers";
import { isLocale, type Locale } from "@/lib/i18n";
export async function getLocale(): Promise<Locale> {
 const value=(await cookies()).get("smartshop_locale")?.value;
 return isLocale(value)?value:"mn";
}
