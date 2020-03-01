import { default as Vue, renderVue } from 'imports/startup.js'
import VueRouter from 'vue-router'
import App from 'imports/routes/router.vue'
import Main from './app.vue'

import StockinDetail from '../stockin-detail/app.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  base: '/',
  routes: [{
    path: '/stockin-detail/:billCode',
    name: 'StockinDetail',
    component: StockinDetail,
    meta: {
      keepAlive: false
    }
  }, {
    path: '/',
    name: 'Main',
    component: Main,
    meta: {
      keepAlive: true
    }
  }]
})

new Vue({
  router,
  render: h => renderVue(h, App)
}).$mount('#app')
