import store from 'imports/stores'
import { mapState } from 'vuex'

/* 查询条件 */
import conditionSet from './table.config.js'

export default {
  store,
  data: () => ({
    loading: false,
    ready: false,
    tableData: null,
    current: 1,
    size: 20,
    total: 0,
    sort: {
      sortField: '',
      sortOrder: ''
    },
    percentage: 0,
    condition: conditionSet(),
    readyPercent: 0,
    exportGetReady: false,
    randomNum: Math.floor(Math.random() * 51 + 20),
    temp: [],
    cacheCondition: []
  }),
  // 获取集中管理的数据字典
  computed: mapState({
    arrGlobal: state => state.global,
    arrMain: state => state.main,
    arrSub: state => state.sub,
    arrSupplier: state => state.supplier,
    arrTemperatureLayer: state => state.temperatureLayer,
    arrWarehouse: state => state.warehouse,
    arrMenuType: state => state.menuType,
    arrProduct: state => state.product,
    arrAccounting: state => state.accounting,
    arrOwner: state => state.owner,
    arrBatch: state => state.batch,
    percentagePro () {
      return this.exportGetReady
        ? this.randomNum + (this.percentage * (100 - this.randomNum)) / 100
        : this.readyPercent
    }
  }),
  methods: {
    handleSearch () {
      this.cacheCondition = JSON.stringify(this.condition)
      this.current = 1
      if (this.ready) {
        this.$refs.mainTable.reload()
      } else {
        this.search()
      }
    },
    refresh () {
      if (!this.ready) {
        Helper.notify('请查询后刷新')
        return false
      }
      this.search()
    },
    reset () {
      Object.assign(this.$data.condition, this.$options.data().condition)
      this.$nextTick(() => {
        this.$refs.form.reset()
        this.stateMain = true
        this.stateSub = true
      })
    },
    // 全局分类 联动
    handleGlobalChange (val) {
      this.resetMain()
      this.$set(this.condition, 'subCategoryIds', [])
      this.resetProduct()
      if (val.length == 0) {
        this.stateMain = true
        this.stateSub = true
        return false
      }
      this.stateMain = false
      this.stateSub = true
    },
    // 主分类 联动
    handleMainChange (val) {
      this.resetSub()
      this.resetProduct()
      if (val.length == 0) {
        this.stateSub = true
        return false
      }
      this.stateSub = false
    },
    // 子分类 联动货品
    handleSubChange () {
      this.resetProduct()
    },
    // 货品名称 联动批次
    handleProductChange (val) {
      if (val.length == 0) {
        return false
      }
      this.stateBatch = false
    },
    // 当前页
    handleCurrentChange (current) {
      this.current = current
      this.$nextTick(() => {
        this.search()
      })
    },
    // 显示页数
    handleSizeChange (size) {
      this.current = 1
      this.size = size
      if (this.ready) {
        this.search()
      }
    },
    // 排序
    sortChange (sort) {
      Object.assign(this.$data.sort, sort)
      if (this.ready) {
        this.search()
      }
    },
    delay (t = 50) {
      return new Promise(resolve => setTimeout(resolve, t))
    },
    // 搜索条件
    getSearchArgs (model) {
      // await this.delay()
      const args = {
        needPaging: true,
        pageSize: this.size,
        pageIndex: this.current,
        viewModel: Object.assign(model, this.condition)
      }
      return Object.assign(args, this.sort)
    },
    // 加载默认数据
    fetchData () {
      // 温层
      this.$store.dispatch('fetch-temperatureLayer')
      // 单据类型
      if (this.menuType) {
        this.$store.dispatch('fetch-menuType', this.menuType)
      }
    },
    // 全局分类 联想
    remoteGlobal (val, loader) {
      loader.start()
      this.$store
        .dispatch('fetch-global', {
          keyword: val
        })
        .then(() => {
          loader.stop()
        })
        .catch(error => {
          loader.stop()
          console.log(error)
        })
    },
    // 主分类 联想
    remoteMain (val, loader) {
      loader.start()
      this.$store
        .dispatch('fetch-main', {
          priorids: this.condition.globalCategoryIds,
          keyword: val
        })
        .then(() => {
          loader.stop()
        })
        .catch(error => {
          loader.stop()
          console.log(error)
        })
    },
    // 子分类 联想
    remoteSub (val, loader) {
      loader.start()
      this.$store
        .dispatch('fetch-sub', {
          priorids: this.condition.mainCategoryIds,
          keyword: val
        })
        .then(() => {
          loader.stop()
        })
        .catch(error => {
          loader.stop()
          console.log(error)
        })
    },
    // 供应商 联想
    remoteSupplier (val, loader) {
      loader.start()
      this.$store
        .dispatch('fetch-supplier', val)
        .then(() => {
          loader.stop()
        })
        .catch(error => {
          loader.stop()
          console.log(error)
        })
    },
    // 仓库 联想
    remoteWarehouse (val, loader) {
      loader.start()
      this.$store
        .dispatch('fetch-warehouse', val)
        .then(() => {
          loader.stop()
        })
        .catch(error => {
          loader.stop()
          console.log(error)
        })
    },
    // 货品 联想
    remoteProduct (val, loader) {
      const task = {
        globalCategoryIds: this.condition.globalCategoryIds,
        mainCategoryIds: this.condition.mainCategoryIds,
        subCategoryIds: this.condition.subCategoryIds,
        keyword: val,
        pageSize: 20
      }
      loader.start()
      this.$store
        .dispatch('fetch-product', task)
        .then(() => {
          loader.stop()
        })
        .catch(error => {
          loader.stop()
          console.log(error)
        })
    },
    // 批次 联想
    remoteBatch (val, loader) {
      const item = {
        billType: this.billType,
        goodsCodes: this.condition.goodsCodes,
        keyword: val
      }
      loader.start()
      this.$store
        .dispatch('fetch-batch', item)
        .then(() => {
          loader.stop()
        })
        .catch(error => {
          loader.stop()
          console.log(error)
        })
    },
    // 记账主体 联想
    remoteAccounting (val, loader) {
      loader.start()
      this.$store
        .dispatch('fetch-accounting', val)
        .then(() => {
          loader.stop()
        })
        .catch(error => {
          loader.stop()
          console.log(error)
        })
    },
    // 货主 联想
    remoteOwner (val, loader) {
      loader.start()
      this.$store
        .dispatch('fetch-owner', val)
        .then(() => {
          loader.stop()
        })
        .catch(error => {
          loader.stop()
          console.log(error)
        })
    },
    // 重置主分类
    resetMain () {
      if (!this.$refs.mainCategory) {
        return false
      }
      this.$store.commit('load-main', [])
      this.$refs.mainCategory.reset()
    },
    // 重置子分类
    resetSub () {
      if (!this.$refs.subCategory) {
        return false
      }
      this.$store.commit('load-sub', [])
      this.$refs.subCategory.reset()
    },
    // 重置货品
    resetProduct () {
      const vm = this.$refs.product
      if (!vm) {
        return false
      }
      const productCollection = vm.selectData.filter(
        item => vm.mainValue.indexOf(item.goodsCode) > -1
      )
      const globalCategoryIds = this.condition.globalCategoryIds
      const mainCategoryIds = this.condition.mainCategoryIds
      const subCategoryIds = this.condition.subCategoryIds
      if (
        globalCategoryIds.length > 0 &&
        mainCategoryIds.length > 0 &&
        subCategoryIds.length > 0
      ) {
        let conditionIds = subCategoryIds
        let value = productCollection
          .filter(item => {
            return conditionIds.indexOf(item.categoryId) > -1
          })
          .map(item => {
            return item.goodsCode
          })
        vm.mainValue = value
      } else if (globalCategoryIds.length > 0 && mainCategoryIds.length > 0) {
        const conditionIds = mainCategoryIds
        const value = productCollection
          .filter(item => conditionIds.indexOf(item.mainCategoryId) > -1)
          .map(item => item.goodsCode)
        vm.mainValue = value
      } else if (globalCategoryIds.length > 0) {
        const conditionIds = globalCategoryIds
        const value = productCollection
          .filter(item => conditionIds.indexOf(item.globalCategoryId) > -1)
          .map(item => item.goodsCode)
        vm.mainValue = value
      }
      this.$refs.product.reload()
      this.$store.commit('load-product', [])
    },
    // 表单数据整理
    getAoa (tableData, dataSet) {
      const aoaArr = tableData.map(item => {
        const arr = []
        for (const i in dataSet) {
          const indexItem = dataSet[i]
          const key = indexItem.data
          arr.push(item[key])
        }
        return arr
      })
      // ws['!cols'] = wscols;
      return aoaArr
    },
    // 导出表单
    excelFactory (tableData) {
      const XLSX = this.$xlsx
      const time = this.$format(Date.now(), 'YYYY年MM月DD日')
      const outputName = `${this.subject}导出表单_${time}.xlsx`
      const titles = this.dataSet.map(item => item.title)
      const wscols = titles.map(title => {
        const el = Array.from(
          this.$refs.mainTable.getTableDom().querySelectorAll('th')
        ).find(el => {
          const titleEl = el.querySelector('.dt-title')
          if (titleEl) {
            return titleEl.innerText.trim() === title
          }
        })
        if (el) {
          // wch "characters"
          // wpx "pixels"
          const item = {
            wpx: el.clientWidth
          }
          return item
        }
      })
      const aoaArr = this.getAoa(tableData, this.dataSet)
      aoaArr.unshift(titles)
      const ws = XLSX.utils.aoa_to_sheet(aoaArr)
      ws['!cols'] = wscols
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, this.subject)
      XLSX.writeFile(wb, outputName)
    },
    // 调用数据及导出
    async exportExcel () {
      if (this.cacheCondition !== JSON.stringify(this.condition)) {
        Helper.notify('请查询后导出')
      }
      const args = Object.assign(await this.getSearchArgs(this.condition), {
        needPaging: false
      })
      if (!this.ready) {
        Helper.notify('请查询后导出')
      } else {
        Helper.confirm({
          title: '导出确认',
          content: '确认要导出数据吗？'
        }).then(() => {
          if (this.tableData.length == 0 || this.total == 0) {
            Helper.alert({
              content: '无数据可导出'
            })
          } else if (this.total > 50000) {
            Helper.alert({
              content: '数据超过5万条，请添加筛选条件后查询'
            })
          } else {
            let $overlay = this.$refs.overlayLoading
            $overlay.open()
            this.exportGetReady = false
            this.readyPercent = 0
            let interval = setInterval(() => {
              if (this.readyPercent < this.randomNum) {
                this.readyPercent += 1
              }
            }, 80)
            this.queryTable(args, this)
              .then(response => {
                clearInterval(interval)
                this.exportGetReady = true
                const tableData = response.list
                this.excelFactory(tableData)
                setTimeout(() => {
                  $overlay.close()
                }, 200)
              })
              .catch(error => {
                $overlay.close()
                this.$message.error(error.message)
              })
          }
        })
      }
    }
  }
}
