import test from "node:test";
import assert from "node:assert/strict";
import {calculateFinance} from "../../src/lib/finance.ts";
const base={sellingPrice:100000,purchaseCost:50000,shippingPerUnit:5000,packagingPerUnit:1000,commissionPct:2,marketingPct:5,fixedMonthlyCost:400000,expectedUnits:20};
test("calculates revenue, variable costs, profit and break-even consistently",()=>{
 const r=calculateFinance(base);
 assert.equal(r.revenue,2_000_000);
 assert.equal(r.productCost,1_000_000);
 assert.equal(r.unitContribution,37_000);
 assert.equal(r.variableCost,1_260_000);
 assert.equal(r.totalCost,1_660_000);
 assert.equal(r.netProfit,340_000);
 assert.equal(r.breakEvenUnits,11);
 assert.equal(r.breakEvenRevenue,1_100_000);
 assert.equal(r.grossMarginPct,50);
 assert.ok(Math.abs(r.contributionMarginPct-37)<0.00001);
});
test("handles zeros and absent revenue without dividing by zero",()=>{
 const r=calculateFinance({...base,sellingPrice:0,purchaseCost:0,shippingPerUnit:0,packagingPerUnit:0,marketingPct:0,commissionPct:0,fixedMonthlyCost:0,expectedUnits:0});
 assert.equal(r.revenue,0);
 assert.equal(r.grossMarginPct,null);
 assert.equal(r.roiPct,null);
 assert.equal(r.breakEvenUnits,null);
});
test("does not falsely promise break-even with negative unit contribution",()=>{
 const r=calculateFinance({...base,sellingPrice:10000,purchaseCost:30000});
 assert.equal(r.breakEvenUnits,null);
 assert.equal(r.breakEvenRevenue,null);
 assert.ok(r.netProfit<0);
});
test("rounds break-even up to full units",()=>{
 const r=calculateFinance({...base,fixedMonthlyCost:37001});
 assert.equal(r.breakEvenUnits,2);
});
test("rejects invalid negative, nonfinite, and out-of-range values",()=>{
 for(const invalid of [{...base,sellingPrice:-1},{...base,sellingPrice:Infinity},{...base,commissionPct:101},{...base,marketingPct:NaN},{...base,expectedUnits:1_000_001}]){
  assert.throws(()=>calculateFinance(invalid),/Invalid finance scenario/);
 }
});
