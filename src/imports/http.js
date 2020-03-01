import axios from 'axios'
import isAbsoluteURL from 'axios/lib/helpers/isAbsoluteURL'
import combineURLs from 'axios/lib/helpers/combineURLs'
import { cloneDeep } from 'lodash-es'
import qs from 'qs'

const NODE_ENV = process.env.NODE_ENV

const vm = Vue.prototype
vm.$parse = str => qs.parse(str, { ignoreQueryPrefix: true })
vm.$getParse = (str, key) => {
  const parse = qs.parse(str, { ignoreQueryPrefix: true })
  if (parse instanceof Object && parse.hasOwnProperty(key)) {
    return parse[key]
  }
  return ''
}

vm.$stringify = parse =>
  qs.stringify(parse, { arrayFormat: 'brackets', addQueryPrefix: true })

let Token =
  NODE_ENV == 'production'
    ? vm.$getParse(location.search, 'token')
    : 'BCBAAAD7A9AAB5BEBFAFD3ACAFB4BEBFAFD3ACAFBEBFB2A8D1AEA2B1BCB2AED6AEA6B8B4B1A8D0'

axios.defaults.headers = {
  Token: Token
}

vm.$token = Token
sessionStorage.setItem('token', Token)

const axiosConfig = {
  baseURL: NODE_ENV == 'production' ? baseURL : '/api'
}

const Axios = axios.create(axiosConfig)

const httpFactory = Axios => {
  const queque = new Map()
  const cancelQueque = new Map()
  const CancelToken = axios.CancelToken
  let cancel

  class BaseConfig {
    constructor (config) {
      Object.keys(config).forEach(key => {
        if (key !== 'cancelToken') {
          this[key] = config[key]
        }
      })
    }
    toJson () {
      return JSON.stringify(this)
    }
    getParams () {
      let params = []
      const baseKeys = [this.method]
      if (this.method === 'get') {
        params = baseKeys.concat(Object.keys(this.params || {}))
      } else if (this.method === 'post') {
        params = baseKeys.concat(Object.keys(this.data || {}))
      } else {
        params = baseKeys
      }
      return params.toString()
    }
  }

  const setQueque = config => {
    let url = config.url
    let flag = 1
    if (config.baseURL && !isAbsoluteURL(config.url)) {
      url = combineURLs(config.baseURL, config.url)
    }
    // url是否已出现在queque的key中
    if (queque.has(url)) {
      const arr = queque.get(url)
      // 数组中是否已包括当前参数
      const resultIndex = arr.findIndex(
        item =>
          new BaseConfig(item).toJson() === new BaseConfig(config).toJson()
      )
      if (resultIndex > -1) {
        // 阻止正在请求中的重复操作
        flag = 0
      } else {
        // 将参数增加到队列，url已出现在queque的key中
        arr.push(config)
        queque.set(url, arr)
      }
    } else {
      // 将参数增加到队列，url未曾出现在queque的key中
      queque.set(url, [cloneDeep(config)])
    }
    if (flag && config.cancelToken) {
      if (cancelQueque.has(url)) {
        const { configBox } = cancelQueque.get(url)
        if (
          new BaseConfig(configBox).getParams() ===
          new BaseConfig(config).getParams()
        ) {
          flag = -1
          const { cancelBox } = cancelQueque.get(url)
          cancelBox('canceled')
          queque.set(url, [cloneDeep(config)])
        }
      }
      cancelQueque.set(url, { configBox: cloneDeep(config), cancelBox: cancel })
    }
    return flag
  }
  const unSetQueque = config => {
    const url = config.url
    if (queque.has(url)) {
      const arr = queque.get(url)
      // 将参数移除队列
      if (arr.length <= 1) {
        // 单个数组直接移除
        queque.delete(url)
      } else {
        // 多个数组移除指定
        const resultIndex = arr.findIndex(
          item =>
            new BaseConfig(item).toJson() === new BaseConfig(config).toJson()
        )
        if (resultIndex > -1) {
          queque.set(url, arr.slice(resultIndex))
        }
      }
    }
  }

  // 请求拦截器
  Axios.interceptors.request.use(
    config => {
      const flag = setQueque(config)
      config.state = flag
      if (!flag) {
        return Promise.reject(config)
      }
      return config
    },
    error => Promise.reject(error)
  )

  // 返回异常捕获
  Axios.interceptors.response.use(
    response => {
      const { config } = response
      unSetQueque(config)
      return response
    },
    error => {
      if (error && error.config) {
        const { config } = error
        unSetQueque(config)
      }
      if (error && error.response) {
        switch (error.response.status) {
          case 400:
            error.message = '错误请求'
            break
          case 401:
            error.message = '未授权，请重新登录'
            break
          case 403:
            error.message = '拒绝访问'
            break
          case 404:
            error.message = '请求错误,未找到该资源'
            break
          case 405:
            error.message = '请求方法未允许'
            break
          case 408:
            error.message = '请求超时'
            break
          case 500:
            error.message = '服务器端出错'
            break
          case 501:
            error.message = '网络未实现'
            break
          case 502:
            error.message = '网络错误'
            break
          case 503:
            error.message = '服务不可用'
            break
          case 504:
            error.message = '网络超时'
            break
          case 505:
            error.message = 'http版本不支持该请求'
            break
          default:
            error.message = `连接错误${error.response.status}`
        }

        if (error.response.status == 401) {
          Helper.alert({
            closable: false,
            title: '错误提示',
            content: error.message
          })
          setTimeout(() => {
            sessionStorage.clear()
            Helper.home()
          }, 1200)
        } else {
          vm.$message.error(error.message)
        }
      } else if (error.state) {
        vm.$message.error('连接到服务器失败')
      } else if (error.state == 0) {
        Helper.notify('响应中,请稍后操作')
      }

      return Promise.reject(error)
    }
  )

  const Http = (
    args,
    options = {
      cancel: false
    }
  ) => {
    if (options.cancel) {
      args.cancelToken = new CancelToken(cancelToken => {
        cancel = cancelToken
      })
    }
    return Axios(args)
      .then(response => {
        const baseData = response.data
        if (baseData.status == 'success') {
          return Promise.resolve(baseData.data)
        }
        if (baseData.hasOwnProperty('errorMessage')) {
          vm.$message.error(baseData.errorMessage)
        }
        return Promise.reject(baseData)
      })
      .catch(error => Promise.reject(error))
  }

  const Get = (args, options) => {
    const { url, data } = args
    delete args.data
    return Http(
      Object.assign(args, {
        method: 'get',
        url,
        params: data
      }),
      options
    )
  }

  const Post = (args, options) => {
    const { url, data } = args
    return Http(
      Object.assign(args, {
        method: 'post',
        url,
        data
      }),
      options
    )
  }

  return { Http, Get, Post }
}

const { Http, Get, Post } = httpFactory(Axios)

export { Axios, Http, Get, Post }
