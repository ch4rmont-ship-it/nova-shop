import {test,expect} from "@playwright/test";
// The live catalogue may be empty in CI without Supabase credentials.
// Inject neutral sample cards for browser geometry assertions only;
// use the deployed CSS and actual shop layout at every viewport.
test("catalogue grid never shrinks cards into unreadable strips",async({page})=>{
 for(const width of [340,390,768,1024,1280,1600]){
  await page.setViewportSize({width,height:850});
  await page.goto("/shop");
  await expect(page.getByRole("heading",{level:1})).toBeVisible();
  const geometry=await page.evaluate(()=>{
   const results=document.querySelector(".shop-results");
   if(!results)return null;
   let grid=results.querySelector(".grid-auto");
   if(!grid){
    grid=document.createElement("div");
    grid.className="grid-auto";
    for(let i=0;i<8;i++){
     const card=document.createElement("article");
     card.textContent="Test item "+(i+1);
     card.style.height="250px";
     grid.appendChild(card);
    }
    results.appendChild(grid);
   }
   return {
    viewport:document.documentElement.clientWidth,
    docWidth:document.documentElement.scrollWidth,
    resultsWidth:results.getBoundingClientRect().width,
    cardWidths:[...grid.children].slice(0,8).map(el=>el.getBoundingClientRect().width)
   };
  });
  expect(geometry).not.toBeNull();
  expect(geometry.docWidth,"horizontal overflow at "+width+"px").toBeLessThanOrEqual(geometry.viewport+2);
  expect(geometry.resultsWidth,"results collapsed at "+width+"px").toBeGreaterThan(200);
  expect(Math.min(...geometry.cardWidths),"cards too narrow at "+width+"px").toBeGreaterThan(140);
 }
});
test("production shop uses SmartShop branding, not the retired NOVA header",async({page})=>{
 await page.goto("/shop");
 await expect(page.getByRole("link",{name:/SmartShop AI/}).first()).toBeVisible();
 await expect(page.getByText("NOVA Shop",{exact:true})).toHaveCount(0);
});
