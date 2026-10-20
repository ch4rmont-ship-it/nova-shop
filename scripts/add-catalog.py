"""Append researched JD listings without changing existing inventory or prices."""
import concurrent.futures, importlib.util, json, sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('supplier', root/'scripts/source-catalog.py')
supplier = importlib.util.module_from_spec(spec)
spec.loader.exec_module(supplier)
rows = [
 ('desk','ugreen-20629-white-clips','UGREEN','Кабель тогтоогч · цагаан 2 ширхэг',16.90,.08,'ZZdIfYcf7lNKbjj612Yiqw','Ширээний цэнэглэгч, чихэвчний кабелиа тогтоох дөрвөн ховилтой цагаан тогтоогч.',{'Загвар':'20629','Өнгө':'Цагаан','Багц':'2 ширхэг','Ховил':'4'}),
 ('carry','banzheni-green-travel-tag','Banzheni','Аяллын ачааны шошго · ногоон',9.90,.06,'OcPm1gD_1H-Rrglp0xy1_A','Ачаагаа хялбар таних ногоон шошго. Холбоо барих мэдээллээ доторх цаасан дээр бичээрэй.',{'Материал':'PVC / цаас','Хэмжээ':'100 × 90 × 5 мм','Өнгө':'Ногоон'}),
 ('organize','ugreen-45605-cable-roll','UGREEN','Дахин ашиглах кабель боогч · 5 м',26.90,.12,'U1a4sSBRTF2klA3pEvfxcQ','Кабель, утаснуудаа хэрэгтэй уртаар нь тасалж багцлах дахин ашигладаг ороомог боогч.',{'Загвар':'45605','Урт':'5 м','Зориулалт':'Кабель цэгцлэх'}),
]
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    products = list(pool.map(supplier.build, enumerate(rows,9)))
existing = json.loads((root/'src/data/products.json').read_text())
sources = json.loads((root/'docs/sourcing.json').read_text())
ids = {p['id'] for p in products}
for p in products:
    p['createdAt']='2026-10-20T08:00:00Z'
    p['source']['checkedAt']='2026-10-20'
(root/'src/data/products.json').write_text(json.dumps([p for p in existing if p['id'] not in ids]+[{k:v for k,v in p.items() if k!='source'} for p in products],ensure_ascii=False,indent=2)+'\n')
(root/'docs/sourcing.json').write_text(json.dumps([p for p in sources if p['id'] not in ids]+[{'id':p['id'],'slug':p['slug'],**p['source']} for p in products],ensure_ascii=False,indent=2)+'\n')
def sql(v):
    if v is None:return 'null'
    if isinstance(v,bool):return str(v).lower()
    if isinstance(v,(int,float)):return str(v)
    if isinstance(v,dict):return sql(json.dumps(v,ensure_ascii=False))+'::jsonb'
    return "'"+str(v).replace("'","''")+"'"
statements=['-- New, researched JD listings; existing on-hand inventory is untouched.']
for p in products:
    cols=['id','category_id','brand','name','slug','sku','short_description','description','price_cents','stock','preorder','featured','active','specifications','source_public_url']
    vals=[p['id'],p['categoryId'],p['brand'],p['name'],p['slug'],p['sku'],p['shortDescription'],p['description'],p['priceCents'],0,True,True,True,p['specifications'],p['sourceUrl']]
    statements.append('insert into public.products('+','.join(cols)+') values('+','.join(map(sql,vals))+') on conflict(id) do nothing;')
    s=p['source']
    statements.append('insert into public.product_sourcing(product_id,marketplace,title,url,cost_cny,markup_percent,estimates,checked_at) values('+','.join(map(sql,[p['id'],'JD.com',s['title'],s['url'],s['costCny'],35,s,s['checkedAt']]))+') on conflict(product_id) do nothing;')
    for i,img in enumerate(p['images']):
        statements.append('insert into public.product_images(product_id,url,alt_text,is_primary,sort_order) select '+','.join(map(sql,[p['id'],img,p['name'],i==0,i]))+' where not exists(select 1 from public.product_images where product_id='+sql(p['id'])+' and url='+sql(img)+');')
(root/sys.argv[1]).write_text('\n'.join(statements)+'\n')
print(json.dumps([{'slug':p['slug'],'priceMnt':p['priceCents']/100,'images':len(p['images'])} for p in products],ensure_ascii=False))
