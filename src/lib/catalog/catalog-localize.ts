import type {Locale} from "@/lib/i18n";
import {catalogSeed} from "@/lib/catalog/catalog-seed";
const languages=["mn","zh","en"] as const;
type Translation={name:string;short:string;description:string};
type I18n=Partial<Record<Locale,Translation>>;
export function localizeProduct(raw:{name:string;short_description:string;description:string;specifications:unknown},locale:Locale){
 const source=(raw.specifications&&typeof raw.specifications==="object"&&!Array.isArray(raw.specifications)?raw.specifications:{}) as Record<string,unknown>;
 const i18n=(source._i18n && typeof source._i18n==="object" ? source._i18n : {}) as I18n;
 const match=i18n[locale];
 const name=match?.name||raw.name;
 const short=match?.short||raw.short_description;
 const description=match?.description||raw.description;
 const visible=Object.fromEntries(Object.entries(source).filter(([key,value])=>!key.startsWith("_")&&typeof value==="string")) as Record<string,string>;
 const searchTerms=languages.flatMap(l=>[i18n[l]?.name||""]).filter(Boolean);
 return {name,short,description,visible,searchTerms,isPreview:source._catalog_stage==="unverified-preview"};
}
export function localizeCategory(slug:string,defaultName:string,locale:Locale){
 const match=catalogSeed.categories.find(c=>c.slug===slug);
 return match?.names?.[locale]||defaultName;
}
