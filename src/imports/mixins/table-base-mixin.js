export default {
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
    }
  }),
  methods: {
    handleSearch () {
      this.current = 1
      this.search()
    },
    // 当前页
    handleCurrentChange (current) {
      this.current = current
      this.search()
    },
    // 显示页数
    handleSizeChange (size) {
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
    // 搜索条件
    getSearchArgs (model) {
      const args = {
        needPaging: true,
        pageSize: this.size,
        pageIndex: this.current,
        viewModel: model || this.condition
      }
      return Object.assign(args, this.sort)
    },
    resetAll () {
      Object.assign(this.$data, this.$options.data())
    },
    // 加载默认数据
    fetchData () {

    }
  }
}
