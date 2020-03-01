import path from 'path'

import internalIp from 'internal-ip'

const config = new Map()

// webpack本地服务设置
config.set('localIp', false)
config.set('host', internalIp.v4.sync())
config.set('port', 4800)
config.set('host_port', `http://${config.get('host')}:${config.get('port')}`)

config.set('env', process.env.NODE_ENV)

// 是否设置代理
config.set('setProxy', true)

// http://172.17.6.136:88
// http://172.17.6.142:8080

// 代理参数 [https://github.com/chimurai/http-proxy-middleware]
let urls = {
  localNetCore: 'http://172.17.83.42:8088', // 本地net core接口
  dev: 'http://172.17.102.38:7000/', // 开发环境接口
  qa: 'http://ics-qa.yiguo.com'
}

config.set('proxyParams', {
  target: urls['dev'],
  // pathRewrite: {
  //     "^/api": ""
  // },
  changeOrigin: true,
  secure: false
})

// 代理路由
config.set('proxy', {
  '/api': config.get('proxyParams')
})

// 是否启用 devtool debug
config.set('isDebug', true)

// 启动的debug模式 [https://webpack.js.org/configuration/devtool/#devtool]
config.set('devtool', 'cheap-source-map')
// config.set('devtool', 'cheap-module-eval-source-map')
// config.set('devtool', 'source-map')

// 启动后是否自动打开
config.set('open', true)

config.set('publicPath', '/')
// config.set('publicPath', '/web/')

// config.set('buildName', 'YGSC.ICS.Web')
config.set('buildName', 'dist')

export default config
