export type FinanceInput = {
 sellingPrice:number;
 purchaseCost:number;
 shippingPerUnit:number;
 packagingPerUnit:number;
 commissionPct:number;
 marketingPct:number;
 fixedMonthlyCost:number;
 expectedUnits:number;
};
export type FinanceResult={
 revenue:number;
 productCost:number;
 variableCost:number;
 fixedCost:number;
 totalCost:number;
 netProfit:number;
 unitContribution:number;
 unitGrossProfit:number;
 grossMarginPct:number|null;
 contributionMarginPct:number|null;
 breakEvenUnits:number|null;
 breakEvenRevenue:number|null;
 roiPct:number|null;
};
export function calculateFinance(input:FinanceInput):FinanceResult {
 const values=Object.values(input);
 if(values.some(n=>!Number.isFinite(n)||n<0)||input.commissionPct>100||input.marketingPct>100||input.expectedUnits>1_000_000)
  throw new Error("Invalid finance scenario");
 const {sellingPrice,purchaseCost,shippingPerUnit,packagingPerUnit,commissionPct,marketingPct,fixedMonthlyCost,expectedUnits}=input;
 const feePerUnit=sellingPrice*(commissionPct+marketingPct)/100;
 const variableUnit=purchaseCost+shippingPerUnit+packagingPerUnit+feePerUnit;
 const unitContribution=sellingPrice-variableUnit;
 const revenue=sellingPrice*expectedUnits;
 const productCost=purchaseCost*expectedUnits;
 const variableCost=variableUnit*expectedUnits;
 const totalCost=variableCost+fixedMonthlyCost;
 const netProfit=revenue-totalCost;
 const breakEvenUnits=unitContribution>0?Math.ceil(fixedMonthlyCost/unitContribution):null;
 return {
  revenue,productCost,variableCost,fixedCost:fixedMonthlyCost,totalCost,netProfit,unitContribution,
  unitGrossProfit:sellingPrice-purchaseCost,
  grossMarginPct:sellingPrice>0?100*(sellingPrice-purchaseCost)/sellingPrice:null,
  contributionMarginPct:sellingPrice>0?100*unitContribution/sellingPrice:null,
  breakEvenUnits,breakEvenRevenue:breakEvenUnits===null?null:breakEvenUnits*sellingPrice,
  roiPct:totalCost>0?100*netProfit/totalCost:null
 };
}
