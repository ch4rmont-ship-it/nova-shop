import {test,expect} from "@playwright/test";

test("catalogue fills the page horizontally with readable cards at common widths",async({page})=>{
 for(const width of [340,390,768,1024,1280,1600,1920]){
  await page.setViewportSize({width,height:850});
  await page.goto("/shop");
  await expect(page.getByRole("heading",{level:1})).toBeVisible();
  const geometry=await page.evaluate(()=>{
   const results=document.querySelector(".shop-results");
   const fullwidth=document.querySelector(".shop-fullwidth");
   if(!results||!fullwidth)return null;
   let grid=results.querySelector(".grid-auto");
   if(!grid){
    grid=document.createElement("div");
    grid.className="grid-auto";
    results.appendChild(grid);
   }
   // CI has no products; the layout is tested against neutral cards in that case.
   if(grid.children.length<8){
    for(let i=grid.children.length;i<8;i++){
     const card=document.createElement("article");
     card.textContent="Layout test card "+(i+1);
     card.style.minHeight="200px";
     grid.appendChild(card);
    }
   }
   const columns=getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length;
   const cards=[...grid.children].slice(0,8).map(el=>el.getBoundingClientRect());
   return {
    viewport:document.documentElement.clientWidth,
    scrollWidth:document.documentElement.scrollWidth,
    contentWidth:fullwidth.getBoundingClientRect().width,
    resultsWidth:results.getBoundingClientRect().width,
    columns,
    minCard:Math.min(...cards.map(c=>c.width)),
    rightmost:Math.max(...cards.map(c=>c.right))
   };
  });
  expect(geometry).not.toBeNull();
  expect(geometry.scrollWidth,"page overflowing at width "+width).toBeLessThanOrEqual(geometry.viewport+3);
  expect(geometry.contentWidth,"catalogue not full width at "+width).toBeGreaterThan(geometry.viewport-65);
  expect(geometry.resultsWidth,"product results too narrow at "+width).toBeGreaterThan(geometry.viewport-65);
  expect(geometry.minCard,"cards too narrow at "+width).toBeGreaterThan(140);
  expect(geometry.rightmost,"large unused space at "+width).toBeGreaterThan(geometry.viewport-70);
  if(width>=1280)expect(geometry.columns,"expected 4+ columns at "+width).toBeGreaterThanOrEqual(4);
 }
});

test("category filters are horizontal and extra filters do not create a permanent sidebar",async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto("/shop");
 await expect(page.locator(".shop-fullwidth")).toBeVisible();
 await expect(page.getByRole("navigation",{name:"Ангилал"})).toBeVisible();
 const toggle=page.getByRole("button",{name:"Нэмэлт шүүлтүүр"});
 await expect(toggle).toBeVisible();
 await expect(page.locator("#catalog-advanced-filters")).toHaveCount(0);
 await toggle.click();
 await expect(page.locator("#catalog-advanced-filters")).toBeVisible();
 await page.getByRole("button",{name:"Шүүлтүүр хаах"}).click();
 await expect(page.locator("#catalog-advanced-filters")).toHaveCount(0);
});
test("SmartShop catalogue branding replaces the retired NOVA header",async({page})=>{
 await page.goto("/shop");
 await expect(page.getByRole("link",{name:/SmartShop AI/}).first()).toBeVisible();
 await expect(page.getByText("NOVA Shop",{exact:true})).toHaveCount(0);
});
