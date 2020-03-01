import {
  Post
} from 'imports/http.js'

// 查询表格
export function queryTable (options, _this) {
  return Post({
    url: '/inventory/procurement-return/search',
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

/**
 * 采购退单明细查询
 * @param StockType
 * 1: 计划调拨库存
 * 2: 调拨占用库存
 * 3: 调拨在途库存
 */
export function queryDetailTable (options) {
  return Post({
    url: '/inventory/procurement-return/detail-search',
    data: options
  })
}

/**
 * 出库
 */
export function queryStockOut (options) {
  return Post({
    url: '/inventory/detail/stockout',
    data: options
  })
}
