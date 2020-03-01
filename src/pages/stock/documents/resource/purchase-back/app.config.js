// 查询表格
const dataSet = [{
  title: '采购退单号',
  data: 'billCode'
},
{
  title: '单据类型',
  data: 'billType'
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
  title: '仓储商名称',
  data: 'warehousingDealerName'
},
{
  title: '仓库名称',
  data: 'targetWarehouseName'
},
{
  title: '供应商名称',
  data: 'supplierName'
},
{
  title: '记账主体',
  data: 'accountingSubjectName',
  sort: true
},
{
  title: '货品编码',
  data: 'goodsCode'
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
  title: '计划退单库存',
  data: 'planReturnInventory',
  icon: 'bookmark'
},
{
  title: '退单出库库存',
  data: 'returnStockOutInventory',
  icon: 'bookmark'
},
{
  title: '退单占用库存',
  data: 'returnOccupyInventory',
  icon: 'bookmark'
},
{
  title: '创建人',
  data: 'operationBy',
  sort: true
},
{
  title: '创建时间',
  data: 'procurementReturnCreateTime',
  sort: true
},
{
  title: '退货时间',
  data: 'returnTime'
},
{
  title: '完成时间',
  data: 'finishTime'
}
]

export { dataSet }
