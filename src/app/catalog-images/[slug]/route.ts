import {catalogSeed} from "@/lib/catalog/catalog-seed";
export const dynamic="force-dynamic";
function escapeXml(value:string){return value.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]||c));}
const shapes:Record<string,string>={
 lamp:'<path d="M240 445L317 225L395 180" stroke="#4f46e5" stroke-width="21" fill="none" stroke-linecap="round"/><path d="M362 143L456 188L433 220L345 172Z" fill="#6366f1"/><rect x="188" y="446" width="174" height="21" rx="11" fill="#293d69"/>',
 stand:'<rect x="178" y="173" width="290" height="170" rx="17" fill="#293d69"/><rect x="194" y="187" width="260" height="140" rx="8" fill="#9eaaff"/><path d="M312 343L312 451M220 458H413" stroke="#5966a0" stroke-width="22" stroke-linecap="round"/>',
 shelf:'<rect x="157" y="211" width="324" height="135" rx="17" fill="#293d69"/><rect x="174" y="226" width="292" height="106" rx="9" fill="#9eaaff"/><rect x="139" y="366" width="357" height="25" rx="13" fill="#5865bf"/><path d="M175 389V442M460 389V442" stroke="#47547a" stroke-width="24"/>',
 mat:'<rect x="122" y="269" width="390" height="171" rx="29" fill="#333c66"/><path d="M154 312H476" stroke="#a5b4fc" stroke-width="12" stroke-linecap="round"/>',
 charger:'<ellipse cx="315" cy="371" rx="163" ry="92" fill="#28365c"/><ellipse cx="315" cy="350" rx="161" ry="90" fill="#6366f1"/><path d="M317 303L357 326L306 359L339 337L280 330Z" fill="#f3f4ff"/>',
 cable:'<path d="M194 284Q124 405 276 413Q460 415 404 291" fill="none" stroke="#626bcb" stroke-width="25" stroke-linecap="round"/><rect x="373" y="248" width="80" height="54" rx="13" fill="#293d69"/><rect x="164" y="265" width="59" height="55" rx="11" fill="#293d69"/>',
 hub:'<rect x="144" y="289" width="347" height="137" rx="27" fill="#303b6e"/><rect x="155" y="278" width="327" height="121" rx="24" fill="#707cef"/><path d="M226 344H261M301 344H336M379 344H414" stroke="#223152" stroke-width="17" stroke-linecap="round"/>',
 keyboard:'<rect x="133" y="258" width="371" height="181" rx="25" fill="#303b6e"/><rect x="139" y="248" width="359" height="181" rx="23" fill="#e8eafa"/>'+Array.from({length:4},(_,r)=>Array.from({length:10},(_,c)=>'<rect x="'+(153+c*33)+'" y="'+(261+r*31)+'" width="27" height="23" rx="5" fill="'+((r+c)%4===0?"#818cf8":"#c7ccef")+'"/>').join("")).join(""),
 pouch:'<rect x="167" y="228" width="303" height="239" rx="46" fill="#31556a"/><rect x="180" y="226" width="279" height="228" rx="42" fill="#6e9faf"/><path d="M195 329H447" stroke="#e6f5f7" stroke-width="10"/><rect x="238" y="350" width="162" height="79" rx="18" fill="#3c637b"/>',
 backpack:'<path d="M226 244Q230 130 321 130Q412 130 420 244" stroke="#2b4866" stroke-width="25" fill="none"/><rect x="195" y="209" width="260" height="277" rx="58" fill="#496a86"/><rect x="217" y="323" width="216" height="116" rx="29" fill="#7292b4"/>',
 bag:'<path d="M221 245Q320 93 441 245" stroke="#304866" stroke-width="30" fill="none"/><rect x="172" y="249" width="302" height="212" rx="51" fill="#668cad"/><path d="M202 343Q326 386 447 344" stroke="#e5ecf4" stroke-width="11" fill="none"/>',
 diffuser:'<rect x="223" y="221" width="212" height="260" rx="81" fill="#f2d9c6"/><ellipse cx="328" cy="247" rx="83" ry="28" fill="#bdb4eb"/><path d="M287 201Q265 171 291 139M339 201Q360 159 343 131" stroke="#babbd3" stroke-width="11" stroke-linecap="round" fill="none"/>',
 fan:'<rect x="302" y="391" width="33" height="81" rx="11" fill="#4c5b8b"/><ellipse cx="316" cy="479" rx="106" ry="21" fill="#4c5b8b"/><circle cx="317" cy="297" r="125" fill="#e2e8ff" stroke="#6570ae" stroke-width="13"/>'+[0,120,240].map(d=>'<path transform="rotate('+d+' 317 297)" d="M318 287Q375 180 407 221Q412 262 332 312Z" fill="#929cf5"/>').join("")+'<circle cx="317" cy="297" r="22" fill="#313e70"/>',
 bottle:'<rect x="278" y="178" width="86" height="47" rx="11" fill="#3a4e76"/><rect x="253" y="211" width="137" height="277" rx="45" fill="#7b86d5"/><path d="M283 246V447" stroke="#fff" stroke-width="15" opacity=".3"/>',
 notebook:'<rect x="220" y="157" width="227" height="316" rx="18" fill="#283b67"/><rect x="229" y="166" width="209" height="296" rx="17" fill="#838bdd"/><path d="M257 244H402M257 296H402M257 348H402M257 400H376" stroke="#e9eaff" stroke-width="11" stroke-linecap="round"/>',
 mask:'<path d="M185 305Q315 251 471 304Q461 398 392 420Q351 409 317 393Q257 422 216 402Q182 380 185 305Z" fill="#7d83d6"/><path d="M188 327Q133 287 117 338M470 329Q520 291 536 343" stroke="#5964a3" stroke-width="17" fill="none"/>',
 case:'<rect x="229" y="228" width="203" height="234" rx="49" fill="#7b80d3"/><rect x="240" y="240" width="181" height="210" rx="41" fill="#3a456f"/><circle cx="330" cy="344" r="47" fill="none" stroke="#c7cbfa" stroke-width="13"/>'
};
export async function GET(_request:Request,{params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 if(!slug.endsWith(".svg"))return new Response("Not found",{status:404});
 const item=catalogSeed.products.find(p=>p.slug===slug.slice(0,-4));
 if(!item)return new Response("Not found",{status:404});
 const idx=catalogSeed.products.indexOf(item);
 const backgrounds=["#e2e8ff","#dceeff","#d8f3ed","#ffefe4","#dfebf8","#eee3fc"];
 const kind=item.kind;
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="'+backgrounds[idx%6]+'"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs><rect width="640" height="640" rx="35" fill="url(#g)"/><circle cx="514" cy="120" r="149" fill="#fff" opacity=".43"/><ellipse cx="320" cy="502" rx="174" ry="25" fill="#404b75" opacity=".13"/>'+(shapes[kind]||shapes.case)+'<text x="36" y="56" font-size="17" font-family="Arial,sans-serif" font-weight="bold" fill="#4f46e5">SMARTSHOP SELECT</text><text x="36" y="555" font-size="25" font-family="Arial,sans-serif" font-weight="bold" fill="#29385e">'+escapeXml(item.translations.en.name)+'</text><text x="36" y="586" font-size="16" font-family="Arial,sans-serif" fill="#64748b">ILLUSTRATIVE IMAGE · PREVIEW LISTING</text></svg>';
 return new Response(svg,{status:200,headers:{"Content-Type":"image/svg+xml; charset=utf-8","Cache-Control":"public, max-age=3600","X-Content-Type-Options":"nosniff","Content-Security-Policy":"default-src 'none'; style-src 'unsafe-inline'; sandbox"}});
}
