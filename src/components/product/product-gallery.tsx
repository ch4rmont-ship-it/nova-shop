"use client";
import Image from "next/image";
import { useState } from "react";

export function ProductGallery({images,name}:{images:string[];name:string}){
  const safe=images.length?images:["/products/essential-overshirt.svg"];
  const[selected,setSelected]=useState(safe[0]);
  return <div><div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-[#dedbd3] bg-white sm:aspect-[4/3]"><Image src={selected} alt={name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 55vw"/></div>{safe.length>1?<div className="mt-3 grid grid-cols-5 gap-2">{safe.map((src,i)=><button key={src} onClick={()=>setSelected(src)} className={`relative aspect-square overflow-hidden rounded-xl border bg-white ${selected===src?"border-[#171816]":"border-[#dedbd3]"}`} aria-label={`View ${i+1} of ${safe.length}`}><Image src={src} alt="" fill className="object-cover" sizes="120px"/></button>)}</div>:null}</div>;
}
