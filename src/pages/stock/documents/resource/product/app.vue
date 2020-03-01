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
          <el-breadcrumb-item>单据库存</el-breadcrumb-item>
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
            <Field title="仓储仓库">
              <Select v-model="condition.warehouseCodes"
                      multiple
                      collapse-tags
                      type="remote"
                      dataKey="warehouseCode"
                      dataValue="warehouseName"
                      :remote-method="remoteWarehouse"
                      :selectData="arrWarehouse"
                      placeholder="全部">
              </Select>
            </Field>
            <Field title="生产仓库">
              <Select v-model="condition.processingWarehouseCodes"
                      multiple
                      collapse-tags
                      type="remote"
                      dataKey="warehouseCode"
                      dataValue="warehouseName"
                      :remote-method="remoteWarehouse"
                      :selectData="arrWarehouse"
                      placeholder="全部">
              </Select>
            </Field>
            <Field title="记账主体">
              <Select v-model="condition.accountingSubjectCodes"
                      type="remote"
                      multiple
                      collapse-tags
                      dataKey="subjectCode"
                      dataValue="subjectName"
                      :remote-method="remoteAccounting"
                      :selectData="arrAccounting">
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
            <Dates title="创建日期"
                   default
                   :start.sync="condition.processingCreateStartTime"
                   :end.sync="condition.processingCreateEndTime">
            </Dates>
          </Row>
          <!-- <div class="row search-bar">
            <Button size="flat"
                    @click="handleSearch">查询</Button>
            <Button size="flat"
                    theme="default"
                    @click="reset">重置</Button>
          </div> -->
          <div v-show="ifOption">
            <Row>
              <Field title="来源单号">
                <tag-input v-model="condition.sourceCodes"
                           placeholder="全部"
                           :maxlength="200" />
              </Field>
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
              <Field title="温层">
                <Select v-model="condition.temperatureLayers"
                        multiple
                        collapse-tags
                        :selectData="arrTemperatureLayer"
                        placeholder="全部">
                </Select>
              </Field>
              <Dates title="完成日期"
                     :start.sync="condition.finishStartDate"
                     :end.sync="condition.finishEndDate">
              </Dates>
              <Dates title="计划生产日期"
                     :start.sync="condition.planProcessingTimeStart"
                     :end.sync="condition.planProcessingTimeEnd">
              </Dates>
            </Row>
          </div>
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
            <!-- 计划原料库存 -->
            <Column v-if="(dict.data=='planDeliveryInventory')"
                    class="handle-td"
                    :data="dict.data"
                    v-bind:key="index"
                    :handleClick="trigglePlanMaterials"></Column>
            <!-- 原料出库库存 -->
            <Column v-else-if="(dict.data=='deliveryStockoutInventory')"
                    class="handle-td"
                    :data="dict.data"
                    v-bind:key="index"
                    :handleClick="triggleMaterialsOutLibrary"></Column>
            <!-- 生产占用库存 -->
            <Column v-else-if="(dict.data=='processingOccupyInventory')"
                    class="handle-td"
                    :data="dict.data"
                    v-bind:key="index"
                    :handleClick="triggleProductionOccupancy"></Column>
            <Column v-else
                    :data="dict.data"
                    v-bind:key="index"></Column>
          </template>
        </column-wrapper>
      </app-table>
    </Card>
    <!-- 计划提货库存 -->
    <plan-materials-modal ref="planMaterials"></plan-materials-modal>
    <!-- 提货出库库存 -->
    <materials-outlibrary-modal ref="materialsOutLibrary"></materials-outlibrary-modal>
    <!-- 生产占用库存 -->
    <production-occupancy-modal ref="productionOccupancy"></production-occupancy-modal>
  </app-layout>
</template>

<script>
import { dataSet } from './app.config.js'
import { queryTable } from './request.js'
import tableMixin from 'imports/mixins/table-mixin.js'
import planMaterialsModal from './plan-materials.vue'
import materialsOutLibraryModal from './materials-outlibrary.vue'
import productionOccupancyModal from './production-occupancy.vue'

export default {
  mixins: [tableMixin],
  components: {
    'plan-materials-modal': planMaterialsModal,
    'materials-outlibrary-modal': materialsOutLibraryModal,
    'production-occupancy-modal': productionOccupancyModal
  },
  data: () => ({
    subject: '生产单',
    dataSet,
    // 类型:生产单
    menuType: 6,
    stateMain: true,
    stateSub: true,
    ifOption: false,
    optionText: '更多选项',
    condition: {
      billCodes: [],
      billTypes: [],
      warehousingDealerCodes: [],
      warehouseCodes: [],
      temperatureLayers: [],
      sourceCodes: [],
      accountingSubjectCodes: [],
      producerCodes: [],
      processingWarehouseCodes: [],
      processingCreateStartTime: '',
      processingCreateEndTime: '',
      finishStartDate: '',
      finishEndDate: '',
      planProcessingTimeStart: '',
      planProcessingTimeEnd: ''
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
          this._current = this.current
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
    trigglePlanMaterials (row) {
      if (!row.planDeliveryInventory) {
        Helper.notify('当前数据为零不展示详情')
        return false
      }
      const model = {
        billCode: '',
        goodsCode: ''
      }
      const item = this.$pack(model, row)
      const id = row.billCode
      this.$refs.planMaterials.init(item, id)
    },
    triggleMaterialsOutLibrary (row) {
      if (!row.deliveryStockoutInventory) {
        Helper.notify('当前数据为零不展示详情')
        return false
      }
      const model = {
        billCode: '',
        targetWarehouseCode: '',
        goodsCode: ''
      }
      const item = this.$pack(model, row)
      const id = row.billCode
      this.$refs.materialsOutLibrary.init(item, id)
    },
    triggleProductionOccupancy (row) {
      if (!row.processingOccupyInventory) {
        Helper.notify('当前数据为零不展示详情')
        return false
      }
      const model = {
        billCode: '',
        goodsCode: ''
      }
      const item = this.$pack(model, row)
      const id = row.billCode
      this.$refs.productionOccupancy.init(item, id)
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
