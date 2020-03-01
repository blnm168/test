import { default as Vue, renderVue } from 'imports/startup.js'
import App from './app.vue'

new Vue({
  render: h => renderVue(h, App)
}).$mount('#app')
