<template>
  <app-layout>
    <Overlay ref="overlayLoading">
      <el-progress ref="progressBar"
                   type="circle"
                   :stroke-width="10"
                   :width="210"
                   :percentage="percentagePro"
                   color="rgb(0,136,66)"></el-progress>
    </Overlay>
    <div class="el-card box-card  primary-box-card">
      <div class="el-card__header primary-box-header">
        <el-breadcrumb separator-class="el-icon-arrow-right"
                       class="title">
          <el-breadcrumb-item v-text="subject">
          </el-breadcrumb-item>
        </el-breadcrumb>
        <Button size="small"
                theme="default"
                @click="refresh">
          <i class="el-icon-refresh"></i>&nbsp;刷新</Button>
      </div>
    </div>
    <Card title="筛选查询">
      <div slot="tools">
        <Button size="small"
                theme="default"
                @click="reset">
          <i class="el-icon-refresh"></i> 重置</Button>
        <Button size="small"
                @click="handleSearch">
          <i class="el-icon-search"></i> 查询</Button>
      </div>
      <div class="mdl-card__container">
        <Form ref="form"
              v-bind:condition="true">
          <Row>
            <Field title="单号搜索">
              <tag-input v-model="condition.billCodes"
                         placeholder="全部"
                         :maxlength="200" />
            </Field>
            <Field title="单据类型">
              <Select v-model="condition.billTypes"
                      multiple
                      collapse-tags
                      :selectData="arrMenuType"
                      placeholder="全部">
              </Select>
            </Field>
            <Field title="仓库名称">
              <Select v-model="condition.warehouseCodes"
                      multiple
                      collapse-tags
                      :selectData="arrWarehouse"
                      dataKey="warehouseCode"
                      dataValue="warehouseName"
                      type="remote"
                      :remote-method="remoteWarehouse"
                      placeholder="全部">
              </Select>
            </Field>
            <Field title="货主">
              <Select v-model="condition.ownerCodes"
                      multiple
                      collapse-tags
                      type="remote"
                      dataKey="subjectCode"
                      dataValue="subjectName"
                      :remote-method="remoteOwner"
                      :selectData="arrOwner"
                      placeholder="全部">
              </Select>
            </Field>
            <Field title="货品名称">
              <Select ref="product"
                      @change="handleProductChange"
                      v-model="condition.goodsCodes"
                      type="remote"
                      multiple
                      collapse-tags
                      dataKey="goodsCode"
                      dataValue="goodsName"
                      :remote-method="remoteProduct"
                      :selectData="arrProduct"
                      placeholder="全部">
              </Select>
            </Field>
            <Field title="批次">
              <tag-select v-model="condition.batchNos"
                          type="remote"
                          multiple
                          dataKey="batchNo"
                          dataValue="batchNo"
                          :remote-method="remoteBatch"
                          :selectData="arrBatch"
                          placeholder="全部">
              </tag-select>
            </Field>
            <Dates title="调整日期"
                   default
                   :start.sync="condition.adjustCreateStartTime"
                   :end.sync="condition.adjustCreateEndTime">
            </Dates>
          </Row>
          <div v-show="ifOption">
            <Row>
              <Field title="仓储商">
                <el-select v-model="condition.warehousingDealerCodes"
                           multiple
                           collapse-tags
                           placeholder="全部">
                  <el-option value="001"
                             label="安鲜达">
                  </el-option>
                </el-select>
              </Field>
              <Field title="生产商">
                <el-select v-model="condition.producerCodes"
                           multiple
                           collapse-tags
                           placeholder="全部">
                  <el-option value="001"
                             label="安鲜达">
                  </el-option>
                </el-select>
              </Field>
              <Field title="温层">
                <Select v-model="condition.temperatureLayers"
                        multiple
                        collapse-tags
                        :selectData="arrTemperatureLayer"
                        placeholder="全部">
                </Select>
              </Field>
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
              <Dates title="到期日期"
                     :start.sync="condition.expirationStartDate"
                     :end.sync="condition.expirationEndDate">
              </Dates>
            </Row>
          </div>
          <!-- <div class="row search-bar">
            <Button size="flat"
                    @click="handleSearch">查询</Button>
            <Button size="flat"
                    theme="default"
                    @click="reset">重置</Button>
          </div> -->
        </Form>
      </div>
      <div slot="more"
           @click="toggleOption"
           v-text="optionText"
           class="more-option"></div>
    </Card>
    <Card title="数据列表"
          v-loading="loading"
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
            <Column v-if="(dict.data=='billCode')"
                    type="template"
                    :data="dict.data"
                    v-bind:key="index">
              <a href="javascript:;"
                 @click="triggleDetailAdjust(scope.row)">{{scope.row[dict.data]}}</a>
            </Column>
            <Column :data="dict.data"
                    v-else
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
    subject: '调整单',
    dataSet,
    // 调整单
    menuType: 9,
    billType: 3,
    stateMain: true,
    stateSub: true,
    stateBatch: true,
    ifOption: false,
    optionText: '更多选项',
    condition: {
      billCodes: [],
      billTypes: [],
      batchNos: [],
      sourceCodes: [],
      warehousingDealerCodes: [],
      producerCodes: [],
      warehouseCodes: [],
      ownerCodes: [],
      temperatureLayers: [],
      adjustCreateStartTime: '',
      adjustCreateEndTime: '',
      expirationStartDate: '',
      expirationEndDate: ''
    }
  }),
  methods: {
    queryTable,
    // 查询表格
    search () {
      this.loading = true
      queryTable(this.getSearchArgs(this.condition), this)
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
    triggleDetailAdjust (row) {
      this.$router.push({
        name: 'AdjustDetail',
        params: {
          billCode: row.billCode
        }
      })
      /* 新页面打开
      const route = this.$router.resolve({
        name: 'AdjustDetail',
        params: {
          billCode: row.billCode
        }
      })
      window.open(route.href, '_blank')
      */
    },
    toggleOption () {
      this.ifOption = !this.ifOption
      this.ifOption
        ? (this.optionText = '收起')
        : (this.optionText = '更多选项')
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
