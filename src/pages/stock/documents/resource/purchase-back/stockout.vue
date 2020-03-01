<template>
  <Modal ref="modal"
         title="退单出库库存详情"
         v-bind:defaultFoot="true">
    <Card :title="cardTitle"
          class="table-card">
      <div slot="tools">
        <page-size @size-change="handleSizeChange"
                   :setSize="size"></page-size>
      </div>
      <app-table :ready="true"
                 :dataSet="dataSet"
                 :data="tableData"
                 v-loading="loading"
                 @sort-change="sortChange"
                 @current-change="handleCurrentChange"
                 :current="current"
                 :total="total"
                 :size="size"
                 v-bind:index="true">
        <column-wrapper slot="row"
                        slot-scope="scope"
                        :helper="scope">
          <template v-for="(dict, index) in dataSet">
            <Column v-if="(dict.data=='handle')"
                    type="template"
                    class="x-handle"
                    :data="dict.data"
                    v-bind:key="index">
              <a :href='"../result/stockout-detail.html?billCode=" + scope.row.stockCode + "&token="+$token'>查看详情</a>
            </Column>
            <Column v-else
                    :data="dict.data"
                    v-bind:key="index"></Column>
          </template>
        </column-wrapper>
      </app-table>
    </Card>
  </Modal>
</template>

<script>
import { dataSet } from './stockout.config.js'
import { queryStockOut } from './request.js'
import tableMixin from 'imports/mixins/table-base-mixin.js'

export default {
  mixins: [tableMixin],
  data: () => ({
    dataSet,
    model: {},
    markId: ''
  }),
  computed: {
    cardTitle () {
      let title = ''
      if (this.markId) {
        title = `&nbsp;&nbsp;&nbsp;[来源单号：${this.markId}]`
      }
      return `数据列表${title}`
    }
  },
  methods: {
    // 查询表格
    search () {
      this.loading = true
      const args = this.getSearchArgs(this.model)
      return queryStockOut(args)
        .then((response) => {
          this.tableData = response.list
          if (response.pageInfo) {
            this.total = response.pageInfo.total
          } else {
            this.total = 0
          }
          this.loading = false
          return Promise.resolve(response)
        })
        .catch((error) => {
          this.loading = false
          return Promise.reject(error)
        })
    },
    init (model, id) {
      this.resetAll()
      this.model = model
      this.markId = id
      this.search()
        .then(() => {
          this.$nextTick(() => {
            this.$refs.modal.resize()
            this.$refs.modal.open()
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    handleSizeChange (size) {
      this.size = size
      this.search()
      this.$nextTick(() => {
        this.$refs.modal.resize()
      })
    }
  }
}
</script>
