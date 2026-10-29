import {getLocale} from "@/lib/i18n-server";
import {FinanceCalculator} from "@/components/admin/finance-calculator";
export const dynamic="force-dynamic";
export default async function FinancePage(){return <FinanceCalculator locale={await getLocale()}/>;}
