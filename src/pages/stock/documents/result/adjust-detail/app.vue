<template>
  <app-layout>
    <div class="el-card box-card  primary-box-card">
      <div class="el-card__header primary-box-header">
        <el-breadcrumb separator-class="el-icon-arrow-right"
                       class="title">
          <el-breadcrumb-item>单据库存</el-breadcrumb-item>
          <el-breadcrumb-item>
            {{subject}}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <Button size="small"
                theme="default"
                @click="refresh">
          <i class="el-icon-refresh"></i>&nbsp;刷新</Button>
        <Button size="small"
                theme="default"
                @click="close">
          <i class="el-icon-close"></i>&nbsp;关闭</Button>
      </div>
    </div>
    <el-tabs v-model="activeName2"
             type="border-card"
             @tab-click="handleClick"
             class="tab-table">
      <el-tab-pane label="单据基本信息"
                   name="info_documents">
        <Card title="基本信息"
              class="table-card table-cols">
          <div class="mdl-grid dt-detail-table">
            <table class="mdl-data-detail-table dataTable flat-detail-table"
                   cellspacing="0"
                   width="100%">
              <tr>
                <td :key="index"
                    v-for="(dict, index) in baseDataSet1">
                  <p>
                    <strong>{{dict.title}}</strong>
                  </p>
                </td>
              </tr>
              <tr v-if="tableData.length != 0">
                <td :key="index"
                    v-for="(dict, index) in baseDataSet1">
                  <p>{{tableData[dict.data]}}</p>
                </td>
              </tr>
              <tr v-else>
                <td colspan="6"
                    class="empty-text">暂无数据</td>
              </tr>
              <tr>
                <td :key="index"
                    v-for="(dict,index) in baseDataSet2">
                  <p>
                    <strong>{{dict.title}}</strong>
                  </p>
                </td>
              </tr>
              <tr v-if="tableData.length != 0">
                <td :key="index"
                    v-for="(dict, index) in baseDataSet2">
                  <p>{{tableData[dict.data]}}</p>
                </td>
              </tr>
              <tr v-else>
                <td colspan="6"
                    class="empty-text">暂无数据</td>
              </tr>
            </table>
          </div>
        </Card>
        <Card title="货品信息"
              class="table-card">
          <detail-table :dataSet="productDataSet"
                        :data="list">
            <tr v-for="(row,index) in list"
                :key="index">
              <template v-for="(dict, index) in productDataSet">
                <td :key="index">
                  <p>{{row[dict.data]}}</p>
                </td>
              </template>
            </tr>
          </detail-table>
        </Card>
      </el-tab-pane>
      <!-- <el-tab-pane label="销售记录"
                     name="info_sale">销售记录</el-tab-pane>
        <el-tab-pane label="调拨记录"
                     name="info_transfer">调拨记录</el-tab-pane> -->
    </el-tabs>
  </app-layout>
</template>
<script>
import { baseDataSet1, baseDataSet2, productDataSet } from './app.config.js'
import { detailAdjustTable } from './request.js'

export default {
  data: () => ({
    subject: '调整单详情页',
    model: {},
    baseDataSet1,
    baseDataSet2,
    tableData: [],
    productDataSet,
    list: [],
    activeName2: 'info_documents'
  }),
  methods: {
    handleClick () {},
    // 刷新
    refresh () {
      detailAdjustTable(this.$route.params.billCode)
        .then((response) => {
          this.setData(response)
        })
    },
    // 关闭
    close () {
      this.$router.push('/')
    },
    setData (response) {
      if (response) {
        this.tableData = response
        this.list = response.goodsList
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    detailAdjustTable(to.params.billCode)
      .then((response) => {
        next((vm) => {
          vm.setData(response)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  },
  beforeRouteUpdate (to, from, next) {
    this.tableData = []
    this.list = []
    detailAdjustTable(to.params.billCode)
      .then((response) => {
        this.setData(response)
        next()
      })
      .catch((error) => {
        console.log(error)
      })
  },
  deactivated () {
    this.$destroy()
  }
}
</script>
