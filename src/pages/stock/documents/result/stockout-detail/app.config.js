const baseDataSet1 = [{
  title: '来源单号',
  data: 'sourceCode'
}, {
  title: '出库单号',
  data: 'stockoutCode'
}, {
  title: '出库类型',
  data: 'stockoutTypeName'
}, {
  title: '仓库',
  data: 'warehouseName'
}]

const baseDataSet2 = [{
  title: '实际出库时间',
  data: 'stockoutTime'
}, {
  title: '货主',
  data: 'ownerName'
}, {
  title: '创建人',
  data: 'operationBy'
}, {
  title: '创建时间',
  data: 'stockoutCreateTime'
}]

const productDataSet = [{
  title: '货品编号',
  data: 'goodsCode'
}, {
  title: '货品名称',
  data: 'goodsName'
}, {
  title: '批次',
  data: 'batchNo'
}, {
  title: '最小使用单位',
  data: 'smallestSellUnitName'
}, {
  title: '组成数量',
  data: 'packageNumber'
}, {
  title: '库存单位',
  data: 'stockUnitName'
}, {
  title: '箱包装数量',
  data: 'boxPackageAmount'
}, {
  title: '箱包装单位',
  data: 'boxPackageUnit'
}, {
  title: '到期日期',
  data: 'expirationDate'
}, {
  title: '保质期',
  data: 'guaranteePeriod'
}, {
  title: '货架期',
  data: 'shelfLife'
}, {
  title: '出库数量',
  data: 'amount'
}]

export { baseDataSet1, baseDataSet2, productDataSet }
