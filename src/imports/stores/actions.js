import { Get, Post } from 'imports/http.js'

export default {
  /**
   * fetch 全局分类
   */
  'fetch-global': function ({ commit }, payload) {
    return Post({
      url: '/common/category/search-all-global',
      data: payload
    })
      .then((response) => {
        const { list } = response
        commit('load-global', list)
        return Promise.resolve(response)
      })
      .catch((error) => {
        console.log(error)
        return Promise.reject(error)
      })
  },

  /**
   * fetch 主分类
   * @param {string} highid
   * @param {string} priorid
   * @param {string} keyword
   */
  'fetch-main': function ({ commit }, payload) {
    return Post({
      url: '/common/category/search-all-main',
      data: payload
    })
      .then((response) => {
        const { list } = response
        commit('load-main', list)
        return Promise.resolve(response)
      })
      .catch(error => Promise.reject(error))
  },

  /**
   * fetch 子分类
   * @param {string} highid
   * @param {string} priorid
   * @param {string} keyword
   */
  'fetch-sub': function ({ commit }, payload) {
    return Post({
      url: '/common/category/search-all-sub',
      data: payload
    })
      .then((response) => {
        const { list } = response
        commit('load-sub', list)
        return Promise.resolve(response)
      })
      .catch(error => Promise.reject(error))
  },

  /**
   * fetch 供应商
   */
  'fetch-supplier': function ({ commit }, keyword) {
    return Post({
      url: '/common/supplier/search-all',
      data: {
        keyword
      }
    })
      .then((response) => {
        const { list } = response
        commit('load-supplier', list)
        return Promise.resolve(response)
      })
      .catch(error => Promise.reject(error))
  },
  /**
   * fetch 仓库
   */
  'fetch-warehouse': function ({ commit }, keyword) {
    return Post({
      url: '/common/warehouse/search-all',
      data: {
        keyword
      }
    })
      .then((response) => {
        const { list } = response
        commit('load-warehouse', list)
        return Promise.resolve(response)
      })
      .catch(error => Promise.reject(error))
  },

  /**
   * fetch 温层
   */

  'fetch-temperatureLayer': function ({ commit }) {
    Get({
      url: '/common/temperature-layer/search-all'
    })
      .then((response) => {
        const { list } = response
        commit('load-temperatureLayer', list)
      })
      .catch((error) => {
        console.log(error)
      })
  },

  /**
   * fetch 温层 本地存储
   */
  /*
  'fetch-temperatureLayer' ({ state, commit }) {
    localStore.keys().then(function (keys) {
      let isExist = keys.indexOf('temperatureLayer') > -1
      if (isExist) {
        localStore
          .getItem('temperatureLayer')
          .then(function (value) {
            commit('load-temperatureLayer', value)
          })
          .catch(function (err) {
            console.log(err)
          })
      } else {
        Get({
          url: '/common/temperature-layer/search-all'
        })
          .then(response => {
            let { list } = response
            localStore.setItem('temperatureLayer', list)
            commit('load-temperatureLayer', list)
          })
          .catch(error => {
            console.log(error)
          })
      }
    })
  },
*/

  /**
   * fetch 货品
   * @param {string} globalCategoryId
   * @param {string} mainCategoryId
   * @param {string} subCategoryId
   * @param {string} keyword
   * @param {number} pageSize
   */
  'fetch-product': function ({ commit }, payload) {
    return Post({
      url: '/common/goods/search-all',
      data: payload
    })
      .then((response) => {
        const { list } = response
        commit('load-product', list)
        return Promise.resolve(response)
      })
      .catch(error => Promise.reject(error))
  },

  /**
   * fetch 单据类型
   * @param {string} menuType  1：采购单 2：采购退单 3：销售单 4：销售退单 5：调拨单 6：生产单 7：入库单 8：出库单 9：调整单
   */
  'fetch-menuType': function ({ commit }, menuType) {
    Get({
      url: `/common/document-type/search-all/${menuType}`
    })
      .then((response) => {
        const { list } = response
        commit('load-menuType', list)
      })
      .catch((error) => {
        console.log(error)
      })
  },

  /**
   * fetch 记账主体
   */
  'fetch-accounting': function ({ commit }, keyword) {
    return Post({
      url: '/common/accounting/search-all',
      data: {
        keyword
      }
    })
      .then((response) => {
        const { list } = response
        commit('load-accounting', list)
        return Promise.resolve(response)
      })
      .catch(error => Promise.reject(error))
  },

  /**
   * fetch 货主
   */
  'fetch-owner': function ({ commit }, keyword) {
    return Post({
      url: '/common/owner/search-all',
      data: {
        keyword
      }
    })
      .then((response) => {
        const { list } = response
        commit('load-owner', list)
        return Promise.resolve(response)
      })
      .catch(error => Promise.reject(error))
  },

  /**
   * fetch 批次
   * @param {number} billType
   * @param {string} goodsId
   * @param {string} keyword
   */
  'fetch-batch': function ({ commit }, payload) {
    return Post({
      url: '/common/batch/search-all',
      data: payload
    })
      .then((response) => {
        const { list } = response
        commit('load-batch', list)
        return Promise.resolve(response)
      })
      .catch(error => Promise.reject(error))
  }
}
