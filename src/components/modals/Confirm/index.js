import Confirm from './index.vue'

const ConfirmComponent = Vue.extend(Confirm)

Confirm.install = function () {
  if (!window.Helper) {
    window.Helper = {}
  }
  window.Helper.confirm = function (data) {
    let propsData = {}
    if (typeof data === 'string') {
      propsData = {
        content: data
      }
    } else {
      propsData = data || {}
    }
    const Component = new ConfirmComponent({
      el: document.createElement('div'),
      propsData
    })
    return new Promise((resolve, reject) => {
      Component.$on('resolve', function () {
        this.$destroy()
        resolve()
      }).$on('reject', function () {
        this.$destroy()
      })
    })
  }
}

export default Confirm
