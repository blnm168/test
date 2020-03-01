<template>
  <Modal ref="modal"
         title="计划退单库存详情"
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
              <a href="javascript:;"
                 @click="linkPlan(scope.row)">查看详情</a>
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
import { dataSet } from './plan.config.js'
import { queryDetailTable } from './request.js'
import tableMixin from 'imports/mixins/table-base-mixin.js'

export default {
  mixins: [tableMixin],
  data: () => ({
    dataSet,
    model: {},
    markId: '',
    originId: ''
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
      return queryDetailTable(args)
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
    init (model, id, originId) {
      this.resetAll()
      this.model = model
      this.markId = id
      this.originId = originId
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
    },
    linkPlan () {
      if (!this.originId) {
        Helper.notify('请确认后点击')
        return false
      }
      const payload = {
        operationType: 'Edit',
        productReturnId: this.originId
      }
      location.assign(`${this.$scmLink}ProductReturnManagement/ProductReturnManagementIndex${this.$stringify(payload)}`)
    }
  }
}
</script>
