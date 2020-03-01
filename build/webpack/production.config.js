'use strict'

import baseConfig from './base.config'
import merge from 'webpack-merge'

import path from 'path'
import config from '../config.js'
import utils from '../lib/utils'
import webpack from 'webpack'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'

import UglifyJsPlugin from 'uglifyjs-webpack-plugin'

import CleanWebpackPlugin from 'clean-webpack-plugin'

const { chunks } = utils.getEntries()

let buildConfig = {
  mode: 'none',
  output: {
    path: path.resolve(process.cwd(), config.get('buildName')),
    filename: 'assets/scripts/[name].js',
    chunkFilename: 'assets/scripts/[name].js',
    publicPath: config.get('publicPath')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    // new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CleanWebpackPlugin([config.get('buildName')], {
      root: `${process.cwd()}`
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/stylesheets/[name].css',
      chunkFilename: 'assets/stylesheets/[name].chunk.css'
    })
  ],
  performance: {
    hints: false,
    maxAssetSize: 320000
  },
  devtool: 'source-map'
}

if (config.get('env') === 'production') {
  Object.assign(buildConfig, {
    mode: 'production',
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    }
  })
}

baseConfig.optimization = {
  splitChunks: {
    cacheGroups: {
      styles: {
        chunks: 'initial',
        test: /\.(css|less)$/,
        name: 'framework',
        minChunks: Math.ceil((chunks.length / 3) * 2),
        priority: 0
      },
      framework: {
        chunks: 'initial',
        test: /[\\/]vue[\\/]|vuex|axios/,
        name: 'framework',
        enforce: true,
        priority: -10
      },
      vendor: {
        chunks: 'initial',
        test: /element-ui/,
        name: 'vendor',
        enforce: true,
        priority: -20
      },
      commons: {
        chunks: 'initial',
        name: 'commons',
        test: /\.js$/,
        minChunks: Math.ceil((chunks.length / 3) * 2),
        enforce: true,
        priority: -30
      }
    }
  }
}

export default merge(baseConfig, buildConfig)
