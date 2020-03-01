## Features

1.  [Vue2](https://github.com/vuejs/vue)
2.  [Webpack4](https://github.com/webpack/webpack)
3.  [ElementUI](https://github.com/ElemeFE/element)
4.  [Axios](https://github.com/axios/axios)
5.  [Less](http://lesscss.org/)
6.  [Postcss](https://github.com/postcss/postcss)
7.  [Vuex](https://github.com/vuejs/vuex)

## Packages

- [xlsx](https://github.com/SheetJS/js-xlsx) 导出 excel
- [nprogress](https://github.com/rstacruz/nprogress) 显示加载进度
- [material-design-icons](https://github.com/google/material-design-icons) icons 图标
- [date-fns](https://github.com/date-fns/date-fns) 时间 format

## Install

```bash
# install necessarily packages
yarn install
```

## Serve

```bash
# serve with hot reload at localhost:4800
yarn start
```

## Build

```bash
# build for production with minification
yarn build
```

## Install eslint packages

**Tips**: eslint 检验为推荐的编码规范,如需配置 eslint 规则请对.eslintrc.js 进行定制。如需在 webpack 中启动 eslint,请自行配置 build/webpack 下的配置文件。

```bash
yarn install-eslint
```

## Auto check Eslint before git hooks `pre-commit`

**Tips**: 在 git 库存创建之后执行执行 yarn hooks 以保证在 git commit 之前触发 eslint 检验

```bash
yarn hooks
```

## Install Package

yarn add packagename -W
yarn add packagename -W -D

## Explain

- build -> config.js 项目启动配置文件
- imports -> startup.js 项目全局依赖
- imports -> element-ui.js 定制饿了么功能 [http://element.eleme.io/#/zh-CN/component/quickstart]
- imports -> http.js 封装 Axios
- src -> components 全局组件
- src -> aasets 静态资源
- src -> pages 页面文件
- src -> pages/\*\*/roadmap.md 页面文件结构说明
- imports -> stores Vuex 管理
- imports -> mixins Vue-Mixins [https://vuejs.org/v2/guide/mixins.html]

## Root Folder Structure

```bash
├─build
│  ├─bin
│  └─lib
├─logs
└─src
    ├─assets
    │  ├─images
    │  ├─scripts
    │  └─stylesheets
    │      ├─common
    │      │  └─lib
    │      ├─element-ui
    │      │  └─fonts
    │      └─material-design-lite
    ├─components
    │  ├─elements
    │  ├─modals
    │  └─modules
    ├─imports
    │  ├─mixins
    │  └─stores
    └─pages
        ├─index
        ├─statistics
        │  └─warehouse
        │      ├─available
        │      ├─book
        │      ├─goods
        │      ├─on-order
        │      └─sub-standard
        └─stock
            └─documents
                ├─resource
                │  ├─product
                │  ├─purchase
                │  ├─purchase-back
                │  ├─sale
                │  ├─sale-back
                │  └─transfer
                └─result
                    ├─adjust
                    ├─stockin
                    └─stockout
```

## Dist Folder Structure

```bash
├─ index.html
│
├─assets
│  ├─fonts
│  │      element-icons.ttf
│  │      MaterialIcons-Regular.eot
│  │      MaterialIcons-Regular.ttf
│  │      MaterialIcons-Regular.woff
│  │      MaterialIcons-Regular.woff2
│  │
│  ├─scripts
│  │  │  0.js
│  │  │  index.js
│  │  │  vendors.js
│  │  │
│  │  ├─statistics
│  │  │  └─warehouse
│  │  │          available.js
│  │  │          book.js
│  │  │          goods.js
│  │  │          on-order.js
│  │  │          sub-standard.js
│  │  │
│  │  └─stock
│  │      └─documents
│  │          ├─resource
│  │          │      product.js
│  │          │      purchase-back.js
│  │          │      purchase.js
│  │          │      sale-back.js
│  │          │      sale.js
│  │          │      transfer.js
│  │          │
│  │          └─result
│  │                  adjust.js
│  │                  stockin.js
│  │                  stockout.js
│  │
│  └─stylesheets
│          index.css
│          vendors.css
│
├─statistics
│  └─warehouse
│          available.html
│          book.html
│          goods.html
│          on-order.html
│          sub-standard.html
│
└─stock
    └─documents
        ├─resource
        │      product.html
        │      purchase-back.html
        │      purchase.html
        │      sale-back.html
        │      sale.html
        │      transfer.html
        │
        └─result
                adjust.html
                stockin.html
                stockout.html
```
