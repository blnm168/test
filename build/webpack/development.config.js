'use strict'

import baseConfig from './base.config'
import merge from 'webpack-merge'

import config from '../config.js'

import webpack from 'webpack'

import convert from 'koa-connect'
import history from 'connect-history-api-fallback'
import proxy from 'http-proxy-middleware'

import webpackServeWaitpage from 'webpack-serve-waitpage'
import WebpackNotifierPlugin from 'webpack-notifier'

let devConfig = {
  mode: 'development',
  output: {
    path: '/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/'
  },
  module: {
    noParse: /^(vue|vuex|vue-router|axios)$/,
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'vue-style-loader',
            options: {
              sourceMap: true,
              shadowMode: false
            }
          },
          {
            loader: 'css-loader',
            options: {
              minimize: false,
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'vue-style-loader',
            options: {
              sourceMap: true,
              shadowMode: false
            }
          },
          {
            loader: 'css-loader',
            options: {
              minimize: false,
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new WebpackNotifierPlugin()
  ],
  serve: {
    devMiddleware: {
      stats: 'minimal'
    },
    host: config.get('localIp') ? config.get('host') : 'localhost',
    port: config.get('port'),
    open: config.get('open'),
    clipboard: true,
    add: (app, middleware, options) => {
      app.use(webpackServeWaitpage(options))
      const proxyApi = config.get('proxy')
      Object.keys(proxyApi).forEach(key => {
        app.use(convert(proxy(key, proxyApi[key])))
      })
      app.use(convert(history()))
    }
  },
  performance: {
    hints: false
  }
}

if (config.get('isDebug')) {
  devConfig.devtool = config.get('devtool')
}

let entry = baseConfig.entry
Object.keys(entry).forEach(key => {
  let content = entry[key]
  entry[key] = []
  entry[key].push(
    // `webpack-dev-server/client?${config.get('host_port')}`,
    // 'webpack/hot/dev-server'
    'webpack-hot-client/client'
  )
  entry[key].push(content)
})

export default merge(baseConfig, devConfig)
