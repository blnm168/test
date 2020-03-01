if (!window.Helper) {
  window.Helper = {}
}

window.Helper.notify = function (message) {
  Vue.prototype.$notify({
    title: '提示',
    message,
    duration: 2000
  })
}
