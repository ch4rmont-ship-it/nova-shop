"""Refresh supplier photographs from the exact JD listings recorded below.
Prices are observed public reference prices, not wholesale quotes or stock counts.
"""
import concurrent.futures, html, json, math, re, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RECORDS = [
 ('drive','ugreen-35057-aux','UGREEN','Type-C → AUX аудио кабель · 0.5 м',29.90,.10,'ctG0_WQR1w4kYVz126MImA','Type-C төхөөрөмжийг 3.5 мм AUX оролттой машины хөгжимд холбоно.',{'Загвар':'35057','Урт':'0.5 м','Оролт':'USB Type-C','Гаралт':'3.5 мм AUX'}),
 ('drive','ugreen-35347-safety','UGREEN','Машины ослын хэрэгсэл · 35347',29.90,.15,'LkCnyEhDTdoFmYcZ1Yy8qA','Суудлын бүс огтлогчтой машины яаралтай тусламжийн хэрэгсэл. Худалдан авахын өмнө шилний тохиромжийг шалгана уу.',{'Загвар':'35347','Зориулалт':'Машины ослын хэрэгсэл','Анхаарах':'Бүх төрлийн шилэнд тохирохгүй; үйлдвэрлэгчийн зааврыг дагана.'}),
 ('desk','ugreen-70585-clips','UGREEN','Кабель тогтоогч · 1+1 багц',14.90,.08,'VIzRm51mijIc1-m3jsHrtQ','Ширээний ирмэгээс унадаг цэнэглэгч, чихэвчний кабелиа нэг дор тогтооно.',{'Загвар':'70585','Багц':'1+1','Суурилуулалт':'Наалттай; өрөмдөхгүй'}),
 ('desk','adjustable-drawer-tray','NOVA Select','Сунгадаг шургуулганы зохион байгуулагч',7.30,.20,'sqL9_XR2jRZH2ZwroXr9MA','Бичгийн хэрэгсэл, жижиг зүйлсийг шургуулгадаа ангилах сунгадаг хайрцаг.',{'Урт':'15.5–23.5 см','Багц':'Жижиг хэмжээ · 1 ширхэг','Зориулалт':'Шургуулга / ширээ'}),
 ('organize','green-storage-baskets','NOVA Select','Ногоон хадгалах сагс · 2 ширхэг',19.90,.60,'W98Lf_mkdqDpSzNO82Gz8Q','Ном, жижиг хэрэгсэл, ахуйн зүйлсээ ангилж хадгалах өндөр ногоон сагсны хос.',{'Өнгө':'Ногоон','Багц':'Өндөр, том · 2 ширхэг','Зориулалт':'Гэр / ширээний хадгалалт'}),
 ('organize','ugreen-45608-ties','UGREEN','Кабель боогч · 3 ширхэг',6.71,.06,'EHuH9XLlFSQCodB4_H24CQ','Цэнэглэгч, чихэвчний кабелиа ороож цэгцлэх дахин ашиглах боогч.',{'Загвар':'45608','Өнгө':'Цайвар шаргал','Багц':'3 ширхэг'}),
 ('carry','banzheni-tech-pouch','Banzheni','Дижитал хэрэгслийн аяллын цүнх',16.90,.20,'jxtd_V-1H7iHqbsEJzj5vA','Цэнэглэгч, кабель, жижиг дижитал хэрэгслээ аялал болон өдөр тутамдаа нэг дор авч яваарай.',{'Зориулалт':'Кабель / цэнэглэгч / жижиг хэрэгсэл','Хийц':'Цахилгаантай зөөврийн цүнх'}),
 ('carry','banzheni-luggage-tag','Banzheni','Хөнгөн цагаан ачааны шошго',9.89,.06,'hasjNiCKOO-eZsRQVwsYtA','Чемоданаа танихад туслах онгоцны дүрстэй мөнгөлөг металл шошго. Мэдээлэл бичих цаастай.',{'Хэмжээ':'75 × 45 × 1 мм','Материал':'Хөнгөн цагаан / ган цагираг','Өнгө':'Мөнгөлөг'}),
]
CATS = {'drive':'11111111-1111-4111-8111-111111111111','desk':'22222222-2222-4222-8222-222222222222','organize':'33333333-3333-4333-8333-333333333333','carry':'44444444-4444-4444-8444-444444444444'}

def fetch(url):
    req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
    return urllib.request.urlopen(req,timeout=40).read()

def build(pair):
    i, row = pair
    cat,slug,brand,name,cost,weight,listing,desc,specs=row
    url=f'https://item.jd.com/product/{listing}.html'
    page=fetch(url).decode('utf-8')
    title=html.unescape(re.search(r'<title>(.*?)</title>',page,re.S)[1])
    candidates=list(dict.fromkeys(re.findall(r'<img[^>]+(?:src|data-lazy-img)=[\"\']([^\"\']+)',page)))
    candidates=[u for u in candidates if '/n4/' in u][:2]
    images=[]; original=[]
    for j,u in enumerate(candidates):
        u=('https:'+u if u.startswith('//') else u).replace('/n4/s114x114_jfs/','/n1/jfs/')
        data=fetch(u)
        if not (data.startswith(b'\xff\xd8') or data.startswith(b'\x89PNG') or data.startswith(b'RIFF')):
            raise ValueError('Image response is not a photograph: '+u)
        ext='png' if data.startswith(b'\x89PNG') else 'webp' if data.startswith(b'RIFF') else 'jpg'
        target=ROOT/f'public/products/{slug}-{j}.{ext}';target.write_bytes(data)
        images.append('/products/'+target.name);original.append(u)
    if not images: raise ValueError('No listing images: '+url)
    purchase=round(cost*538.5,2);domestic=round(6*538.5,2);freight=math.ceil(weight*10000);pack=1500
    reserve=round((purchase+domestic+freight)*.15,2)
    landed=round(purchase+domestic+freight+pack+reserve,2)
    retail=math.ceil(landed*1.35/500)*500
    return {'id':f'00000000-0000-4000-8000-{i:012d}','categoryId':CATS[cat],'brand':brand,'name':name,'slug':slug,'sourceUrl':url,'sku':f'NV-{cat.upper()[:3]}-{i:03d}','shortDescription':desc,'description':desc+' Захиалгаар нийлүүлнэ. Ирэх хугацааны урьдчилсан тооцоо 10–21 хоног; захиалгыг батлахдаа хугацааг тохиролцоно.','priceCents':retail*100,'salePriceCents':None,'stock':0,'preorder':True,'featured':True,'bestseller':False,'active':True,'rating':0,'reviewCount':0,'specifications':specs,'images':images,'createdAt':'2026-10-19T09:00:00Z','source':{'marketplace':'JD.com','title':title,'url':url,'costCny':cost,'weightKgEstimate':weight,'fxMnt':538.5,'domesticCnyEstimate':6,'freightMntEstimate':freight,'packagingMntEstimate':pack,'reserveMntEstimate':reserve,'landedMntEstimate':landed,'markupPercent':35,'effectiveMarkupPercent':round((retail/landed-1)*100,2),'checkedAt':'2026-10-19','images':original,'evidence':'Public listing price observed; login/coupons may change the final supplier price.'}}

if __name__=='__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        products=list(pool.map(build,enumerate(RECORDS,1)))
    (ROOT/'src/data/products.json').write_text(json.dumps([{k:v for k,v in p.items() if k!='source'} for p in products],ensure_ascii=False,indent=2)+'\n')
    (ROOT/'docs/sourcing.json').write_text(json.dumps([{'id':p['id'],'slug':p['slug'],**p['source']} for p in products],ensure_ascii=False,indent=2)+'\n')
    print('Verified listing images saved for',len(products),'products.')
