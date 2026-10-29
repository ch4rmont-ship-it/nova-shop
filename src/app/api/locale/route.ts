import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n";
export async function POST(request:Request){
 const origin=request.headers.get("origin");
 const url=new URL(request.url);
 if(origin){
  try{
   const provided=new URL(origin);
   // Framework-local request.url may use localhost even if the browser sent Host 127.0.0.1.
   // Only the actual Host and request URL are accepted, never an arbitrary forwarded host.
   const trustedHosts=[url.host,request.headers.get("host")].filter(Boolean);
   const invalidProtocol=provided.protocol!=="http:" && provided.protocol!=="https:";
   if(invalidProtocol || !trustedHosts.includes(provided.host))
    return NextResponse.json({error:"Cross-origin request denied"},{status:403});
  }catch{return NextResponse.json({error:"Cross-origin request denied"},{status:403});}
 }
 if(Number(request.headers.get("content-length")||0)>256)return NextResponse.json({error:"Too large"},{status:413});
 const data:unknown=await request.json().catch(()=>null);
 const locale=typeof data==="object" && data!==null && "locale" in data?data.locale:undefined;
 if(!isLocale(locale))return NextResponse.json({error:"Unsupported locale"},{status:400});
 const response=NextResponse.json({locale},{headers:{"Cache-Control":"no-store"}});
 const secure=new URL(request.url).protocol==="https:" || request.headers.get("x-forwarded-proto")==="https";
 response.cookies.set("smartshop_locale",locale,{path:"/",sameSite:"lax",secure,httpOnly:true,maxAge:60*60*24*365});
 return response;
}
