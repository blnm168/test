import {
  Post
} from 'imports/http.js'

// 查询表格
export function queryTable (options, _this) {
  return Post({
    url: '/inventory/reconciliation/search',
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

// 计划调拨库存
// 调拨在途库存
// 调拨占用库存
export function planTransferTable (options) {
  return Post({
    url: '/inventory/reconciliation/detail-search',
    data: options
  })
}

// 调拨出库库存
export function transferOutLibraryTable (options) {
  return Post({
    url: '/inventory/detail/stockout',
    data: options
  })
}

// 调拨入库库存
export function transferStorageTable (options) {
  return Post({
    url: '/inventory/detail/stockin',
    data: options
  })
}
