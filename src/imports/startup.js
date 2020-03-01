import Vue from 'vue'
/* 加载样式 */
import 'material-design-icons/iconfont/material-icons.css'
import 'stylesheets/material-design-lite/table.css'
import 'stylesheets/material-design-lite/dataTables.material.css'
import 'stylesheets/common/style.less'
/* 加载饿了么组件 */
import './element-ui.js'
/* 加载组件 */
import 'components/elements'
import 'components/modules'
import 'components/modals'
import 'components/partials'

import { Http, Get, Post, Axios } from './http.js'

/* 进度条 */
import 'nprogress/nprogress.css'
import 'expose-loader?NProgress!nprogress'
/* 时间format */
import { format } from 'date-fns'
/* 深度克隆 */
import { cloneDeep } from 'lodash-es'

/* 生产环境加载polyfill */
// const NODE_ENV = process.env.NODE_ENV
import 'babel-polyfill'
import 'classlist-polyfill'

// import 'expose-loader?localStore!localforage'

// localStore.config({
//   driver: [localStore.INDEXEDDB, localStore.LOCALSTORAGE],
//   name: 'WebSQL-ICS'
// })

// require.ensure(['babel-polyfill', 'classlist-polyfill'], () => {}, 'polyfill')
Vue.config.devtools = true
Vue.config.productionTip = false

/* 详情内页跳链地址 */
Vue.prototype.$scmLink = 'http://scm.devtest.yiguo.com/'

/* http-request */
Vue.prototype.$http = Http
Vue.prototype.$get = Get
Vue.prototype.$post = Post
Vue.prototype.$axios = Axios

/* helpers */
Vue.prototype.$format = format
Vue.prototype.$cloneDeep = cloneDeep

/* 包装需要的数据 */
Vue.prototype.$pack = (model, data) => {
  const item = {}
  Object.keys(model).forEach((key) => {
    if (data.hasOwnProperty(key)) {
      item[key] = data[key]
    }
  })
  return item
}

/* 导出表格异步加载 */
import(/* webpackChunkName: "xlsx" */
/* webpackMode: "lazy" */
  'xlsx').then((xlsx) => {
  Vue.prototype.$xlsx = xlsx
})

export const renderVue = (h, App) => {
  const NODE_ENV = process.env.NODE_ENV

  if (NODE_ENV == 'production') {
    return h(App)
  }

  const repeat = requestAnimationFrame(renderVue)
  // CSS loaded?
  if (getComputedStyle(document.body).boxSizing === 'border-box') {
    cancelAnimationFrame(repeat) // Cancel next frame
    return h(App)
  }
}

export default Vue
