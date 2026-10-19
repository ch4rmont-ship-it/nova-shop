import type { MetadataRoute } from "next";
import { safeSiteUrl } from "@/lib/utils";
export default function robots():MetadataRoute.Robots{const base=safeSiteUrl();return {rules:[{userAgent:"*",allow:"/",disallow:["/admin/","/account/","/api/"]}],sitemap:`${base}/sitemap.xml`};}
