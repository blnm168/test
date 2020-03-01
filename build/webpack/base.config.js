import path from 'path'
import utils from '../lib/utils'
import { VueLoaderPlugin } from 'vue-loader'
import webpack from 'webpack'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'

const { entries, chunks } = utils.getEntries()

let baseConfig = {
  context: path.join(process.cwd(), 'src'),
  target: 'web', //
  entry: entries,
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          name: 'commons',
          test: /\.js$/,
          minChunks: Math.ceil((chunks.length / 3) * 2),
          enforce: true
        }
      }
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.vue', '.json'],
    modules: [
      path.join(process.cwd(), 'src'),
      path.join(process.cwd(), 'node_modules')
    ],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      'element-ui/lib/theme': 'assets/stylesheets/element-ui',
      '@logs': path.join(process.cwd(), 'logs'),
      images: 'assets/images',
      stylesheets: 'assets/stylesheets'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: ['cache-loader', 'babel-loader'],
        include: [
          path.join(process.cwd(), 'src'),
          path.join(process.cwd(), 'packages'),
          path.join(process.cwd(), 'node_modules/element-ui/packages'),
          path.join(process.cwd(), 'node_modules/element-ui/src')
        ],
        exclude: [
          path.join(process.cwd(), 'node_modules/element-ui/lib'),
          path.join(
            process.cwd(),
            'node_modules/element-ui/src/utils/popper.js'
          )
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'link:href']
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        exclude: /favicon\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/images/[name].[hash:7].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/fonts/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.ProvidePlugin({
      Vue: ['vue/dist/vue.esm.js', 'default']
    }),
    new CaseSensitivePathsPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(process.cwd(), 'build/lib/baseURL.js'),
        to: 'baseURL.js'
      }
    ])
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // process is injected via DefinePlugin, although some 3rd party
    // libraries may require a mock to work properly (#934)
    process: 'mock',
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}

export default utils.setHtmlWebpackPlugin(baseConfig)
