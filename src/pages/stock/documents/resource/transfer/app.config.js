const dataSet = [{
  title: '调拨单号',
  data: 'billCode'
},
{
  title: '单据类型',
  data: 'billType',
  sort: true
},
{
  title: '来源单号',
  data: 'sourceCode',
  sort: true
},
{
  title: '来源类型',
  data: 'sourceType'
},
{
  title: '仓储商名称（出）',
  data: 'stockOutWarehousingDealerName'
},
{
  title: '调出仓库名称',
  data: 'outWarehouseName'
},
{
  title: '仓储商名称（入）',
  data: 'stockInWarehousingDealerName'
},
{
  title: '调入仓库名称',
  data: 'inWarehouseName'
},
{
  title: '记账主体',
  data: 'accountingSubjectName',
  sort: true
},
{
  title: '货品编码',
  data: 'goodsCode',
  sort: true
},
{
  title: '货品名称',
  data: 'goodsName',
  sort: true
},
{
  title: '最小使用单位',
  data: 'smallestSellUnitName'
},
{
  title: '组成数量',
  data: 'packageNumber'
},
{
  title: '库存单位（采购单位）',
  data: 'stockUnitName'
},
{
  title: '箱包装数量',
  data: 'boxPackageAmount'
},
{
  title: '箱包装单位（收货单位）',
  data: 'boxPackageUnit'
},
{
  title: '温层',
  data: 'temperatureLayerName',
  sort: true
},
{
  title: '计划调拨库存',
  data: 'planReconciliationInventory',
  icon: 'bookmark'
},
{
  title: '调拨占用库存',
  data: 'reconciliationOccupyInventory',
  icon: 'bookmark'
},
{
  title: '调拨出库库存',
  data: 'reconciliationStockoutInventory',
  icon: 'bookmark'
},
{
  title: '调拨在途库存',
  data: 'reconciliationOnorderInventory',
  icon: 'bookmark'
},
{
  title: '调拨入库库存',
  data: 'reconciliationStockinInventory',
  icon: 'bookmark'
},
{
  title: '创建人',
  data: 'reconciliationCreateBy',
  sort: true
},
{
  title: '创建时间',
  data: 'reconciliationCreateTime',
  sort: true
},
{
  title: '计划调拨时间',
  data: 'planReconciliationTime'
},
{
  title: '完成时间',
  data: 'finishTime',
  sort: true
}
]

export { dataSet }
