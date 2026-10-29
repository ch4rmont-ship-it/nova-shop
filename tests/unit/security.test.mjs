import test from "node:test";
import assert from "node:assert/strict";
import {sameOriginRequest} from "../../src/lib/security.ts";
const request=(origin,site)=>new Request("https://smartshop.example/api/ai/product-copy",{method:"POST",headers:{...(origin?{origin}:{}),...(site?{"sec-fetch-site":site}:{})}});
test("allows legitimate same-origin browser submission",()=>{
 assert.equal(sameOriginRequest(request("https://smartshop.example","same-origin")),true);
});
test("rejects foreign origins even if fetch metadata is absent",()=>{
 assert.equal(sameOriginRequest(request("https://attacker.example")),false);
});
test("rejects cross-site fetch metadata and malformed origins",()=>{
 assert.equal(sameOriginRequest(request(undefined,"cross-site")),false);
 assert.equal(sameOriginRequest(request("not-a-url")),false);
});
test("permits non-browser clients without origin metadata",()=>{
 assert.equal(sameOriginRequest(request()),true);
});
