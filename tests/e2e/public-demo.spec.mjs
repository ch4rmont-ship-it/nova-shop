import {test,expect} from "@playwright/test";
test("SmartShop AI public landing is usable at desktop and mobile viewport",async({page})=>{
 await page.goto("/");
 await expect(page).toHaveTitle(/SmartShop AI/);
 await expect(page.getByRole("heading",{level:1})).toBeVisible();
 await expect(page.getByRole("link",{name:/SmartShop AI нүүр хуудас/})).toBeVisible();
 await expect(page.locator("html")).toHaveAttribute("lang","mn");
 await expect(page.getByText("REAL DATA",{exact:true})).toBeVisible();
});
test("switching to Chinese persists via secure locale cookie and changes server-rendered heading",async({page,context})=>{
 await page.goto("/");
 const select=page.getByRole("combobox",{name:"Language / Хэл / 语言"});
 await expect(select).toBeVisible();
 await select.selectOption("zh");
 await expect(page.locator("html")).toHaveAttribute("lang","zh");
 await expect(page.getByRole("heading",{level:1})).toContainText("开启智能电商运营新时代");
 await page.reload();
 await expect(page.locator("html")).toHaveAttribute("lang","zh");
 const cookies=await context.cookies();
 const locale=cookies.find(x=>x.name==="smartshop_locale");
 expect(locale?.value).toBe("zh");
 expect(locale?.httpOnly).toBe(true);
});
test("Chinese classroom demo advances between eight narrated slides",async({page})=>{
 await page.goto("/demo");
 await expect(page.getByRole("heading",{name:"SmartShop AI"})).toBeVisible();
 await expect(page.getByRole("heading",{name:"项目介绍与核心价值"})).toBeVisible();
 await page.getByRole("button",{name:/下一页/}).click();
 await expect(page.getByRole("heading",{name:"市场问题与目标用户"})).toBeVisible();
 await page.getByRole("button",{name:"八分钟目录"}).click();
 await page.getByRole("button",{name:/8\. 项目进度、局限与总结/}).click();
 await expect(page.getByRole("heading",{name:"项目进度、局限与总结"})).toBeVisible();
 await expect(page.getByText("API Key 暂未连接")).toBeVisible();
});
test("marketing, analytics, finance and product selection require admin login",async({page})=>{
 for(const route of ["/admin","/admin/finance","/admin/marketing","/admin/analytics","/admin/product-selection"]){
  await page.goto(route);
  await expect(page).toHaveURL(/\/login\?/);
 }
});
test("public help does not misrepresent rules as AI",async({page})=>{
 await page.goto("/support");
 await expect(page.getByText(/AI хараахан холбогдоогүй/)).toBeVisible();
});
