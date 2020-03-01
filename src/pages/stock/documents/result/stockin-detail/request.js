import { Get } from 'imports/http.js'

// 详情页
export function detailStockinTable (billCode) {
  return Get({
    url: `/detail/stockin/detail/${billCode}`,
    onDownloadProgress (progressEvent) {
      const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total) / 100
      NProgress.set(percentCompleted)
    }
  })
}
