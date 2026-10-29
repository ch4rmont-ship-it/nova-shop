import {test,expect} from "@playwright/test";
test("separate demo storefront shows eight fictional products and category/search filters",async({page})=>{
 await page.goto("/demo-store");
 await expect(page.getByRole("heading",{level:1})).toContainText("SmartShop AI Demo Store");
 await expect(page.getByText("8 бараа")).toBeVisible();
 await expect(page.locator('img[alt*="Концепц зураг"]')).toHaveCount(8);
 await page.getByRole("button",{name:"Технологи"}).click();
 await expect(page.getByText("2 бараа")).toBeVisible();
 await expect(page.getByRole("link",{name:"Orbit утасгүй цэнэглэгч"}).last()).toBeVisible();
 await page.getByRole("button",{name:"Бүх бараа"}).click();
 await page.getByRole("textbox",{name:"Бараа хайх"}).fill("Nomad");
 await expect(page.getByText("1 бараа")).toBeVisible();
});
test("demo item details, cart persistence, quantity and no-payment checkout work",async({page})=>{
 await page.goto("/demo-store/luma-desk-light");
 await expect(page.getByRole("heading",{level:1})).toHaveText("Luma ширээний LED гэрэл");
 await page.getByRole("button",{name:"Demo сагсанд нэмэх"}).click();
 await page.goto("/demo-store/cart");
 await expect(page.getByText("Luma ширээний LED гэрэл")).toBeVisible();
 await expect(page.getByText("129,000 ₮",{exact:true}).first()).toBeVisible();
 await page.getByRole("button",{name:"Increase luma-desk-light"}).click();
 await expect(page.getByLabel("Quantity luma-desk-light")).toHaveText("2");
 await page.reload();
 await expect(page.getByLabel("Quantity luma-desk-light")).toHaveText("2");
 await page.getByRole("link",{name:/Туршилтын захиалга/}).click();
 await expect(page.getByRole("heading",{level:1})).toHaveText("Туршилтын захиалга");
 await page.getByRole("button",{name:"Туршилтын захиалга батлах"}).click();
 await expect(page.getByRole("heading",{name:"Demo захиалга амжилттай!"})).toBeVisible();
 await expect(page.getByText("DEMO-CLASSROOM")).toBeVisible();
 await page.goto("/demo-store/cart");
 await expect(page.getByText("Сагс хоосон байна")).toBeVisible();
});
test("demo products never reappear in the real storefront",async({page})=>{
 await page.goto("/shop");
 await expect(page.getByText("SmartShop AI Demo Store")).toHaveCount(0);
 await expect(page.getByText("Luma ширээний LED гэрэл")).toHaveCount(0);
});
