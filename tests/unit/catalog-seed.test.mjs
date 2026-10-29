import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const {categories,products}=JSON.parse(readFileSync(new URL("../../src/data/smartshop-catalog-seed.json",import.meta.url),"utf8"));
test("24 distinct SmartShop products in six distinct non-NOVA categories",()=>{
 assert.equal(products.length,24);assert.equal(categories.length,6);
 assert.equal(new Set(products.map(x=>x.slug)).size,24);
 assert.equal(new Set(products.map(x=>x.sku)).size,24);
 assert.equal(new Set(categories.map(x=>x.slug)).size,6);
 assert.ok(products.every(x=>categories.some(c=>c.slug===x.categorySlug)));
 assert.ok(products.every(x=>!x.slug.includes("nova")));
});
test("three language name and description fields are populated",()=>{
 for(const product of products){
  for(const language of ["mn","zh","en"]){
   const t=product.translations[language];
   assert.ok(t?.name?.trim(),product.slug+" "+language+" missing name");
   assert.ok(t?.description?.trim(),product.slug+" "+language+" missing description");
  }
 }
 for(const c of categories)for(const language of ["mn","zh","en"])assert.ok(c.names[language]?.trim());
});
test("all product listing amounts are bounded prototype values, not inventory claims",()=>{
 for(const product of products){
  assert.ok(Number.isInteger(product.priceMnt)&&product.priceMnt>=10000&&product.priceMnt<=500000);
  assert.ok(product.sku.startsWith("SS-"));
 }
});
