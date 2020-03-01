// 生产占用库存详情数据
const dataSet = [{
  title: '生产单',
  data: 'processingCode'
},
{
  title: '单据类型',
  data: 'processingTypeName'
},
{
  title: '来源单号',
  data: 'sourceCode'
},
{
  title: '来源类型',
  data: 'sourceType'
},
{
  title: '货品编码',
  data: 'goodsCode'
},
{
  title: '货品名称',
  data: 'goodsName'
},
{
  title: '仓储商名称',
  data: 'warehousingDealerName'
},
{
  title: '仓库名称',
  data: 'warehouseName'
},
{
  title: '批次',
  data: 'batchNo'
},
{
  title: '到效日期',
  data: 'availableDate'
},
{
  title: '到期日期',
  data: 'expirationDate'
},
{
  title: '提货数量',
  data: 'planDeliveryInventory'
},
{
  title: '提货出库数量',
  data: 'deliveryStockoutInventory'
},
{
  title: '生产占用数量',
  data: 'processingOccupyInventory'
}
]

export { dataSet }
