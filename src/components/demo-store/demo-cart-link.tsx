"use client";
import Link from "next/link";
import {ShoppingCart} from "lucide-react";
import {useDemoCart} from "./demo-cart-provider";
import {demoLabels} from "@/lib/demo/catalog";
import type {Locale} from "@/lib/i18n";
export function DemoCartLink({locale}:{locale:Locale}){
 const {count,ready}=useDemoCart();
 return <Link className="inline-flex items-center gap-1 font-bold text-indigo-800" href="/demo-store/cart" aria-label={demoLabels[locale].cart}><ShoppingCart size={16}/>{demoLabels[locale].cart} ({ready?count:0})</Link>;
}
