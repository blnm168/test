import {
  Post
} from 'imports/http.js'

// 查询表格
export function queryTable (options, _this) {
  return Post({
    url: '/inventory/processing/search',
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

// 提货出库库存详情
export function MaterialsOutLibraryTable (options) {
  return Post({
    url: '/inventory/detail/stockout',
    data: options
  })
}

// 生产库存计划提货详情
export function PlanMaterialsTable (options) {
  return Post({
    url: '/inventory/processing/plan-delivery-detail',
    data: options
  })
}

// 生产占用库存详情
export function ProductionOccupancyTable (options) {
  return Post({
    url: '/inventory/processing/processing-occupy-detail',
    data: options
  })
}
