import type {Metadata} from "next";
import {DemoPresentation} from "@/components/demo/demo-presentation";
export const metadata:Metadata={title:"SmartShop AI · 中文项目答辩",description:"大学生创业项目 · 八分钟中文演示 · 真实与模拟功能清晰标注"};
export default function DemoPage(){return <DemoPresentation/>;}
