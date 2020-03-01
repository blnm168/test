// 查询表格
const dataSet = [{
  title: '采购单号',
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
  title: '仓储商名称',
  data: 'warehousingDealerName',
  sort: true
},
{
  title: '目标仓库名称',
  data: 'targetWarehouseName',
  sort: true
},
{
  title: '供应商名称',
  data: 'supplierName',
  sort: true
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
  title: '采购库存',
  data: 'procurementInventory',
  icon: 'bookmark'
},
{
  title: '采购在途库存',
  data: 'procurementOnorderInventory',
  icon: 'bookmark'
},
{
  title: '预约入库库存',
  data: 'resevationStockinInventory',
  icon: 'bookmark'
},
{
  title: '采购入库库存',
  data: 'procurementStockinInventory',
  icon: 'bookmark'
},
{
  title: '创建人',
  data: 'operationBy',
  sort: true
},
{
  title: '创建时间',
  data: 'procurementCreateTime',
  sort: true
},
{
  title: '到货时间（起）',
  data: 'arrivalStartTime'
},
{
  title: '到货时间（止）',
  data: 'arrivalEndTime'
},
{
  title: '完成时间',
  data: 'finishTime',
  sort: true
}
]

export { dataSet }
