import {getLocale} from "@/lib/i18n-server";
import {ProductStudio} from "@/components/ai/product-studio";
export const dynamic="force-dynamic";
export default async function AIStudio(){return <ProductStudio locale={await getLocale()}/>;}
