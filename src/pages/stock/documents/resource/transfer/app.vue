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
            <Field title="调出仓库名称">
              <Select v-model="condition.outWarehouseCodes"
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
            <Field title="调入仓库名称">
              <Select v-model="condition.inWarehouseCodes"
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
            <Field title="记账主体">
              <Select v-model="condition.accountingSubjectCodes"
                      type="remote"
                      multiple
                      collapse-tags
                      dataKey="subjectCode"
                      dataValue="subjectName"
                      :remote-method="remoteAccounting"
                      :selectData="arrAccounting"
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
            <Dates title="创建日期"
                   default
                   :start.sync="condition.createStartDate"
                   :end.sync="condition.createEndDate">
            </Dates>
          </Row>
          <div v-show="ifOption">
            <Row>
              <Field title="来源单号">
                <tag-input v-model="condition.sourceCodes"
                           placeholder="全部"
                           :maxlength="200" />
              </Field>
              <Field title="仓储商名称（出）">
                <el-select v-model="condition.stockOutWarehousingDealerCodes"
                           multiple
                           collapse-tags
                           placeholder="全部">
                  <el-option value="001"
                             label="安鲜达">
                  </el-option>
                </el-select>
              </Field>
              <Field title="仓储商名称（入）">
                <el-select v-model="condition.stockInWarehousingDealerCodes"
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
              <Dates title="计划调拨日期"
                     :start.sync="condition.planReconciliationTimeStart"
                     :end.sync="condition.planReconciliationTimeEnd">
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
            <!-- 计划调拨库存 -->
            <Column v-if="(dict.data=='planReconciliationInventory')"
                    class="handle-td"
                    :data="dict.data"
                    v-bind:key="index"
                    :handleClick="trigglePlanTransfer"></Column>
            <!-- 调拨占用库存 -->
            <Column v-else-if="(dict.data=='reconciliationOccupyInventory')"
                    class="handle-td"
                    :data="dict.data"
                    v-bind:key="index"
                    :handleClick="triggleTransferOccupy"></Column>
            <!-- 调拨出库库存 -->
            <Column v-else-if="(dict.data=='reconciliationStockoutInventory')"
                    class="handle-td"
                    :data="dict.data"
                    v-bind:key="index"
                    :handleClick="triggleTransferOutLibrary"></Column>
            <!-- 调拨在途库存 -->
            <Column v-else-if="(dict.data=='reconciliationOnorderInventory')"
                    class="handle-td"
                    :data="dict.data"
                    v-bind:key="index"
                    :handleClick="triggleTransferInWay"></Column>
            <!-- 调拨入库库存 -->
            <Column v-else-if="(dict.data=='reconciliationStockinInventory')"
                    class="handle-td"
                    :data="dict.data"
                    v-bind:key="index"
                    :handleClick="triggleTransferStorage"></Column>
            <Column v-else
                    :data="dict.data"
                    v-bind:key="index"></Column>
          </template>
        </column-wrapper>
      </app-table>
    </Card>

    <!-- 计划调拨库存 -->
    <plan-transfer-modal ref="planTransfer"></plan-transfer-modal>
    <!-- 调拨占用库存 -->
    <transfer-occupy-modal ref="transferOccupy"></transfer-occupy-modal>
    <!-- 调拨出库库存 -->
    <transfer-outlibrary-modal ref="transferOutLibrary"></transfer-outlibrary-modal>
    <!-- 调拨在途库存 -->
    <transfer-inway-modal ref="transferInWay"></transfer-inway-modal>
    <!-- 调拨入库库存 -->
    <transfer-storage-modal ref="transferStorage"></transfer-storage-modal>
  </app-layout>
</template>
<script>
import { dataSet } from './app.config.js'
import { queryTable } from './request.js'
import tableMixin from 'imports/mixins/table-mixin.js'
import planTransferModal from './plan-transfer.vue'
import transferOccupyModal from './transfer-occupy.vue'
import transferOutLibraryModal from './transfer-outlibrary.vue'
import transferInWayModal from './transfer-inway.vue'
import transferStorageModal from './transfer-storage.vue'

export default {
  mixins: [tableMixin],
  components: {
    'plan-transfer-modal': planTransferModal,
    'transfer-occupy-modal': transferOccupyModal,
    'transfer-outlibrary-modal': transferOutLibraryModal,
    'transfer-inway-modal': transferInWayModal,
    'transfer-storage-modal': transferStorageModal
  },
  data: () => ({
    subject: '调拨单',
    dataSet,
    // 类型:调拨单
    menuType: 5,
    stateMain: true,
    stateSub: true,
    ifOption: false,
    optionText: '更多选项',
    condition: {
      billCodes: [],
      billTypes: [],
      sourceCodes: [],
      temperatureLayers: [],
      accountingSubjectCodes: [],
      stockOutWarehousingDealerCodes: [],
      outWarehouseCodes: [],
      stockInWarehousingDealerCodes: [],
      inWarehouseCodes: [],
      createStartDate: '',
      createEndDate: '',
      finishStartDate: '',
      finishEndDate: '',
      planReconciliationTimeStart: '',
      planReconciliationTimeEnd: ''
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
    // 计划调拨
    trigglePlanTransfer (row) {
      if (!row.planReconciliationInventory) {
        Helper.notify('当前数据为零不展示详情')
        return false
      }
      const model = {
        billCode: '',
        goodsCode: ''
      }
      const item = this.$pack(model, row)
      item.stockType = 1
      const id = row.billCode
      this.$refs.planTransfer.init(item, id, row.originId)
    },
    // 调拨占用
    triggleTransferOccupy (row) {
      if (!row.reconciliationOccupyInventory) {
        Helper.notify('当前数据为零不展示详情')
        return false
      }
      const model = {
        billCode: '',
        goodsCode: ''
      }
      const item = this.$pack(model, row)
      item.stockType = 2
      const id = row.billCode
      this.$refs.transferOccupy.init(item, id)
    },
    // 调拨在途
    triggleTransferInWay (row) {
      if (!row.reconciliationOnorderInventory) {
        Helper.notify('当前数据为零不展示详情')
        return false
      }
      const model = {
        billCode: '',
        goodsCode: ''
      }
      const item = this.$pack(model, row)
      item.stockType = 3
      const id = row.billCode
      this.$refs.transferInWay.init(item, id)
    },
    // 调拨出库
    triggleTransferOutLibrary (row) {
      if (!row.reconciliationStockoutInventory) {
        Helper.notify('当前数据为零不展示详情')
        return false
      }
      const model = {
        billCode: '',
        goodsCode: ''
      }
      const item = this.$pack(model, row)
      item.targetWarehouseCode = row.outWarehouseCode // 基于接口的逻辑，需要这样带参赋值，同入库
      const id = row.billCode
      this.$refs.transferOutLibrary.init(item, id)
    },
    // 调拨入库
    triggleTransferStorage (row) {
      if (!row.reconciliationStockinInventory) {
        Helper.notify('当前数据为零不展示详情')
        return false
      }
      const model = {
        billCode: '',
        goodsCode: ''
      }
      const item = this.$pack(model, row)
      item.targetWarehouseCode = row.inWarehouseCode
      const id = row.billCode
      this.$refs.transferStorage.init(item, id)
    },
    toggleOption () {
      this.ifOption = !this.ifOption
      this.ifOption ? this.optionText = '收起' : this.optionText = '更多选项'
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
