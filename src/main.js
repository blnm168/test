import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
Vue.prototype.axios = axios;
axios.defaults.withCredentials = true
Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')
