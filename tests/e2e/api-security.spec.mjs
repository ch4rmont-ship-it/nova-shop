import {test,expect} from "@playwright/test";
test("anonymous admin endpoints refuse requests",async({request})=>{
 const selection=await request.get("/api/admin/product-selection?mode=demo",{maxRedirects:0});
 expect(selection.status()).toBe(401);
 const ai=await request.post("/api/ai/product-copy",{data:{name:"Test product",features:"Verified features",audience:"students",language:"English"},maxRedirects:0});
 expect(ai.status()).toBe(401);
});
test("browser cross-origin mutations are blocked",async({request})=>{
 const response=await request.post("/api/ai/product-copy",{headers:{Origin:"https://untrusted.example"},data:{name:"Desk lamp",features:"Three modes",audience:"students",language:"English"}});
 expect(response.status()).toBe(403);
});
test("locale endpoint rejects invalid values",async({request})=>{
 const response=await request.post("/api/locale",{data:{locale:"xx"}});
 expect(response.status()).toBe(400);
});
test("security headers are sent by Next.js",async({request})=>{
 const r=await request.get("/");
 expect(r.headers()["x-content-type-options"]).toBe("nosniff");
 expect(r.headers()["x-frame-options"]).toBe("DENY");
 expect(r.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
});
