<template>
  <app-layout>

    <div class="el-card box-card  primary-box-card">
      <div class="el-card__header primary-box-header">
        <el-breadcrumb separator-class="el-icon-arrow-right"
                       class="title">
          <el-breadcrumb-item>仓库统计</el-breadcrumb-item>
          <el-breadcrumb-item v-text="subject">
          </el-breadcrumb-item>
        </el-breadcrumb>
        <Button size="small"
                theme="default"
                @click="refresh">
          <i class="el-icon-refresh"></i>&nbsp;刷新</Button>
      </div>
    </div>
    <Card title="筛选查询"
          :expansible="true">
      <div class="mdl-card__container">
        <Form v-bind:condition="true">
          <Row>
            <Field title="全局分类">
              <Select v-model="condition.globalCategoryIds"
                      @change="handleGlobalChange"
                      multiple
                      collapse-tags
                      type="remote"
                      :remote-method="remoteGlobal"
                      :selectData="arrGlobal"
                      dataKey="categoryId"
                      dataValue="categoryName"
                      placeholder="全部">
              </Select>
            </Field>
            <Field title="主分类">
              <Select v-model="condition.mainCategoryIds"
                      @change="handleMainChange"
                      ref="mainCategory"
                      multiple
                      collapse-tags
                      :disabled="stateMain"
                      type="remote"
                      :remote-method="remoteMain"
                      :selectData="arrMain"
                      dataKey="categoryId"
                      dataValue="categoryName"
                      placeholder="全部">
              </Select>
            </Field>
            <Field title="子分类">
              <Select v-model="condition.subCategoryIds"
                      @change="handleSubChange"
                      ref="subCategory"
                      multiple
                      collapse-tags
                      :disabled="stateSub"
                      type="remote"
                      :remote-method="remoteSub"
                      :selectData="arrSub"
                      dataKey="categoryId"
                      dataValue="categoryName"
                      placeholder="全部">
              </Select>
            </Field>
            <Field title="仓储商">
              <el-select v-model="condition.warehousingDealerCode"
                         placeholder="全部">
                <el-option value="001"
                           label="安鲜达">
                </el-option>
              </el-select>
            </Field>
            <Field title="仓库">
              <Select v-model="condition.warehouseCode"
                      :selectData="arrWarehouse"
                      dataKey="warehouseCode"
                      dataValue="warehouseName"
                      type="remote"
                      :remote-method="remoteWarehouse"
                      placeholder="全部">
              </Select>
            </Field>
            <Field title="货品名称">
              <Select ref="product"
                      v-model="condition.goodsCode"
                      type="remote"
                      multiple
                      collapse-tags
                      dataKey="goodsCode"
                      dataValue="goodsName"
                      :remote-method="remoteProduct"
                      :selectData="arrProduct">
              </Select>
            </Field>
            <Field title="温层">
              <Select v-model="condition.temperatureLayer"
                      multiple
                      collapse-tags
                      :selectData="arrTemperatureLayer"
                      placeholder="全部">
              </Select>
            </Field>
          </Row>
          <!-- <Row>
            <Field title="记账主体">
              <Select v-model="condition.accountingSubjectCode"
                      type="remote"
                      dataKey="subjectCode"
                      dataValue="subjectName"
                      :remote-method="remoteAccounting"
                      :selectData="arrAccounting"
                      placeholder="全部">
              </Select>
            </Field>
          </Row> -->
          <div class="row search-bar">
            <Button size="flat"
                    @click="handleSearch">查询</Button>
            <Button size="flat"
                    theme="default"
                    @click="reset">重置</Button>
          </div>
        </Form>
      </div>
    </Card>
    <Card title="数据列表"
          class="table-card">
      <div slot="tools">
        <Button size="small"
                theme="default"
                @click="exportExcel">
          <i class="el-icon-upload2"></i> 导出</Button>
        <page-size @size-change="handleSizeChange"
                   :setSize="size"></page-size>
      </div>
      <app-table ref="mainTable"
                 :ready.sync="ready"
                 :current="current"
                 :dataSet="dataSet"
                 :data="tableData"
                 :fixedHead="true"
                 @sort-change="sortChange"
                 @current-change="handleCurrentChange"
                 v-bind:index="true"
                 :total="total"
                 :size="size">
        <column-wrapper slot="row"
                        slot-scope="scope"
                        :helper="scope">
          <template v-for="(dict, index) in dataSet">
            <Column :data="dict.data"
                    v-bind:key="index"></Column>
          </template>
        </column-wrapper>
      </app-table>
    </Card>
  </app-layout>
</template>
<script>
import { dataSet } from './app.config.js'
import { queryTable } from './request.js'
import tableMixin from 'imports/mixins/table-mixin.js'

export default {
  mixins: [tableMixin],
  data: () => ({
    subject: '在途库存',
    dataSet,
    stateMain: true,
    stateSub: true,
    condition: {
      warehousingDealerCode: '',
      warehouseCode: '',
      temperatureLayer: '',
      availableStartDate: '',
      availableEndDate: '',
      expirationStartDate: '',
      expirationEndDate: '',
      accountingSubjectCode: ''
    }
  }),
  methods: {
    queryTable,
    // 查询表格
    search () {
      this.loading = true
      queryTable(this.getSearchArgs(this.condition))
        .then((response) => {
          this.tableData = response.list
          if (response.pageInfo) {
            this.total = response.pageInfo.total
          } else {
            this.total = 0
          }
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    },
    // 重置查询条件
    reset () {
      Object.assign(this.$data.condition, this.$options.data().condition)
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
