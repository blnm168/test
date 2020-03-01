import Alert from './index.vue'

const AlertComponent = Vue.extend(Alert)

Alert.install = function () {
  let closable = true
  if (!window.Helper) {
    window.Helper = {}
  }
  window.Helper.alert = function (data) {
    let propsData = {}
    if (typeof data === 'string') {
      propsData = {
        content: data
      }
    } else {
      propsData = data || {}
    }
    if (closable) {
      new AlertComponent({
        el: document.createElement('div'),
        propsData
      })
    }
    if (typeof data !== 'string' && data.closable === false) {
      closable = false
    }
  }
}

export default Alert
