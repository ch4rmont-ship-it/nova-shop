import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/env";
const schema = z.object({
 requestId: z.string().uuid(),
 items: z.array(z.object({productId:z.string().uuid(),quantity:z.number().int().min(1).max(99)})).min(1).max(100),
 address:z.object({fullName:z.string().trim().min(2).max(120),email:z.string().email(),phone:z.string().regex(/^[0-9]{8}$/),country:z.literal("Mongolia"),city:z.string().trim().min(1).max(100),state:z.string().trim().min(1).max(100),addressLine1:z.string().trim().min(3).max(200),postalCode:z.string().max(30).default("")})
});
export async function POST(request:Request){
 const origin=request.headers.get("origin");
 if(origin&&new URL(origin).host!==request.headers.get("host")&&origin!==process.env.NEXT_PUBLIC_SITE_URL)return NextResponse.json({error:"Хүсэлт зөвшөөрөгдөөгүй"},{status:403});
 if(!supabaseConfigured())return NextResponse.json({error:"Захиалгын үйлчилгээ түр боломжгүй байна."},{status:503});
 const client=await createClient();const{data:{user}}=await client.auth.getUser();
 if(!user)return NextResponse.json({error:"Захиалга өгөхийн тулд нэвтэрнэ үү."},{status:401});
 const parsed=schema.safeParse(await request.json().catch(()=>null));
 if(!parsed.success)return NextResponse.json({error:"Хүргэлтийн мэдээллээ шалгана уу. Утас 8 оронтой байна."},{status:400});
 const{data,error}=await client.rpc("place_order",{p_items:parsed.data.items.map(i=>({product_id:i.productId,quantity:i.quantity})),p_address:parsed.data.address,p_request_id:parsed.data.requestId});
 if(error||!data?.[0])return NextResponse.json({error:error?.message||"Захиалга хадгалагдсангүй."},{status:409});
 return NextResponse.json({url:`/account/orders/${data[0].order_id}?created=1`,orderNumber:data[0].order_number});
}
