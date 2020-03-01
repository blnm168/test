import {
  Post
} from 'imports/http.js'

// 查询表格
export function queryTable (options, _this) {
  return Post({
    url: '/inventory/sale/search',
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

// 转移库存查询
export function queryLocking (options) {
  return Post({
    url: '/inventory/detail/transfer',
    data: options
  })
}
