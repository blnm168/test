import { Get } from 'imports/http.js'

// 详情页
export function detailStockoutTable (billCode) {
  return Get({
    url: `/detail/stockout/detail/${billCode}`,
    onDownloadProgress (progressEvent) {
      const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total) / 100
      NProgress.set(percentCompleted)
    }
  })
}
