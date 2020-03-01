import Tagify from './src/tagify.vue'

/* istanbul ignore next */
Tagify.install = function (Vue) {
  Vue.component(Tagify.name, Tagify)
}

export default Tagify
