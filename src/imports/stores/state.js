export const state = {
  // 分类
  global: [],
  main: [],
  sub: [],
  // 供应商
  supplier: [],
  // 仓库
  warehouse: [],
  // 温层
  temperatureLayer: [],
  // 货品
  product: [],
  // 单据类型
  menuType: [],
  // 记账主体
  accounting: [],
  // 货主
  owner: [],
  // 批次
  batch: []
}

export const mutations = {
  'load-global': function (state, payload) {
    state.global = payload
  },
  'load-main': function (state, payload) {
    state.main = payload
  },
  'load-sub': function (state, payload) {
    state.sub = payload
  },
  'load-supplier': function (state, payload) {
    state.supplier = payload
  },
  'load-temperatureLayer': function (state, payload) {
    state.temperatureLayer = payload
  },
  'load-warehouse': function (state, payload) {
    state.warehouse = payload
  },
  'load-product': function (state, payload) {
    state.product = payload
  },
  'load-menuType': function (state, payload) {
    state.menuType = payload
  },
  'load-accounting': function (state, payload) {
    state.accounting = payload
  },
  'load-owner': function (state, payload) {
    state.owner = payload
  },
  'load-batch': function (state, payload) {
    state.batch = payload
  }
}
