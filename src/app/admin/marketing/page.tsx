import {getLocale} from "@/lib/i18n-server";
import {MarketingStudio} from "@/components/admin/marketing-studio";
export const dynamic="force-dynamic";
export default async function MarketingPage(){return <MarketingStudio locale={await getLocale()}/>;}
