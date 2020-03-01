const dataSet = [{
  title: '加工单号',
  data: 'billCode'
}, {
  title: '单据类型',
  data: 'billType',
  sort: true
}, {
  title: '来源单号',
  data: 'sourceCode',
  sort: true
}, {
  title: '来源类型',
  data: 'sourceType'
}, {
  title: '仓储商名称',
  data: 'warehousingDealerName',
  sort: true
}, {
  title: '仓储仓库名称',
  data: 'warehouseName',
  sort: true
}, {
  title: '生产商名称',
  data: 'producerName',
  sort: true
}, {
  title: '生产仓库名称',
  data: 'processingWarehouseName',
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
}, {
  title: '货品名称',
  data: 'goodsName',
  sort: true
}, {
  title: '最小使用单位',
  data: 'smallestSellUnitName'
}, {
  title: '组成数量',
  data: 'packageNumber'
}, {
  title: '库存单位（采购单位）',
  data: 'stockUnitName'
}, {
  title: '箱包装数量',
  data: 'boxPackageAmount'
}, {
  title: '箱包装单位（收货单位）',
  data: 'boxPackageUnit'
}, {
  title: '温层',
  data: 'temperatureLayerName',
  sort: true
}, {
  title: '计划提货库存',
  data: 'planDeliveryInventory',
  icon: 'bookmark'
}, {
  title: '提货出库库存',
  data: 'deliveryStockoutInventory',
  icon: 'bookmark'
}, {
  title: '生产占用库存',
  data: 'processingOccupyInventory',
  icon: 'bookmark'
}, {
  title: '创建人',
  data: 'operationBy',
  sort: true
}, {
  title: '创建时间',
  data: 'transformationCreateTime',
  sort: true
}, {
  title: '计划完成时间',
  data: 'planProcessingTime',
  sort: true
}, {
  title: '完成时间',
  data: 'finishTime',
  sort: true
}
]

export { dataSet }
