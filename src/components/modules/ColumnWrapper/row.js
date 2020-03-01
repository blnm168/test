const errLog = new Map()

export default class Row {
  constructor (obj) {
    Object.assign(this, obj)
  }
  has (keyString) {
    const hasOwnProperty = Object.prototype.hasOwnProperty
    const result = hasOwnProperty.call(this, keyString)
    if (!result && !errLog.has(keyString)) {
      errLog.set(keyString)
      console.error('数据缺少必要的字段:', keyString)
    }
    return result
  }
  get (key) {
    if (!this.has(key)) {
      return ''
    }
    const value = this[key]
    if (this.formatter && Object.keys(this.formatter).indexOf(key) > -1) {
      return this.formatter[key](value, this)
    } return value
  }
  set (keyString, value) {
    Vue.set(this, keyString, value)
  }
}
