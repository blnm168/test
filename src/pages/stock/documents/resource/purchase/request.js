import {
  Post
} from 'imports/http.js'

// 查询表格
export function queryTable (options, _this) {
  return Post({
    url: '/inventory/procurement/search',
    data: options,
    onDownloadProgress (progressEvent) {
      let percentCompleted =
        Math.floor((progressEvent.loaded * 100) / progressEvent.total) / 100
      NProgress.set(percentCompleted)
      if (percentCompleted) {
        _this.percentage = Math.floor(percentCompleted * 100)
      }
    }
  })
}

// 采购库存预约入库详情
export function queryReserveWarehouseTable (options) {
  return Post({
    url: '/inventory/detail/reservation-stockin',
    data: options
  })
}

// 采购库存采购入库详情
export function queryPurchaseWarehouseTable (options) {
  return Post({
    url: '/inventory/detail/stockin',
    data: options
  })
}
