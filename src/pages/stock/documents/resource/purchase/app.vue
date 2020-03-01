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
          <el-breadcrumb-item>
            {{subject}}
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
                      :selectData="arrMenuType"></Select>
            </Field>
            <Field title="供应商">
              <Select v-model="condition.supplierCodes"
                      type="remote"
                      multiple
                      collapse-tags
                      :remote-method="remoteSupplier"
                      :selectData="arrSupplier"
                      dataKey="supplierCode"
                      dataValue="supplierName"></Select>
            </Field>
            <Field title="目标仓库">
              <Select v-model="condition.targetWarehouseCodes"
                      multiple
                      collapse-tags
                      :selectData="arrWarehouse"
                      dataKey="warehouseCode"
                      dataValue="warehouseName"
                      type="remote"
                      :remote-method="remoteWarehouse"
                      placeholder="全部"></Select>
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
                      :selectData="arrProduct"></Select>
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
                           multiple
                           collapse-tags
                           placeholder="搜索单据号码"
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
              <Field title="温层">
                <Select v-model="condition.temperatureLayers"
                        multiple
                        collapse-tags
                        :selectData="arrTemperatureLayer"></Select>
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
              <Dates title="完成日期"
                     :start.sync="condition.finishStartDate"
                     :end.sync="condition.finishEndDate">
              </Dates>
              <Dates title="到货日期(起)"
                     :start.sync="condition.arrivalStartTimeStart"
                     :end.sync="condition.arrivalStartTimeEnd">
              </Dates>
              <Dates title="到货日期(止)"
                     :start.sync="condition.arrivalEndTimeStart"
                     :end.sync="condition.arrivalEndTimeEnd">
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
            <!-- 采购库存 -->
            <Column v-if="(dict.data=='procurementInventory')"
                    class="handle-td"
                    :data="dict.data"
                    v-bind:key="index"
                    :handleClick="linkProcurementInventory"></Column>
            <!-- 采购在途库存 -->
            <Column v-else-if="(dict.data=='procurementOnorderInventory')"
                    class="handle-td"
                    :data="dict.data"
                    v-bind:key="index"
                    :handleClick="linkProcurementInventory"></Column>
            <!-- 预约入库库存 -->
            <Column v-else-if="(dict.data=='resevationStockinInventory')"
                    class="handle-td"
                    :data="dict.data"
                    v-bind:key="index"
                    :handleClick="triggleWarehouseReserve"></Column>
            <!-- 采购入库库存 -->
            <Column v-else-if="(dict.data=='procurementStockinInventory')"
                    class="handle-td"
                    :data="dict.data"
                    v-bind:key="index"
                    :handleClick="triggleWarehousePurchase"></Column>
            <Column v-else
                    :data="dict.data"
                    v-bind:key="index"></Column>
          </template>
        </column-wrapper>
      </app-table>
    </Card>
    <!-- 预约入库库存 -->
    <warehouse-reserve-modal ref="warehouseReserve"></warehouse-reserve-modal>
    <warehouse-purchase-modal ref="warehousePurchase"></warehouse-purchase-modal>
  </app-layout>
</template>

<script>
import { dataSet } from './app.config.js'
import { queryTable } from './request.js'
import tableMixin from 'imports/mixins/table-mixin.js'
import warehouseReserveModal from './warehouse-reserve.vue'
import warehousePurchaseModal from './warehouse-purchase.vue'

export default {
  mixins: [tableMixin],
  components: {
    'warehouse-reserve-modal': warehouseReserveModal,
    'warehouse-purchase-modal': warehousePurchaseModal
  },
  data: () => ({
    subject: '采购单',
    dataSet,
    // 类型:采购单
    menuType: 1,
    stateMain: true,
    stateSub: true,
    ifOption: false,
    optionText: '更多选项',
    condition: {
      billCodes: [],
      billTypes: [],
      warehousingDealerCodes: [],
      targetWarehouseCodes: [],
      temperatureLayers: [],
      supplierCodes: [],
      sourceCodes: [],
      accountingSubjectCodes: [],
      createStartDate: '',
      createEndDate: '',
      finishStartDate: '',
      finishEndDate: '',
      arrivalStartTimeStart: '',
      arrivalStartTimeEnd: '',
      arrivalEndTimeStart: '',
      arrivalEndTimeEnd: ''
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
    // 弹出预约入库库存
    triggleWarehouseReserve (row) {
      if (!row.resevationStockInInventory) {
        Helper.notify('当前数据为零不展示详情')
        return false
      }
      const model = {
        billCode: '',
        supplierCode: '',
        targetWarehouseCode: '',
        goodsCode: ''
      }
      const item = this.$pack(model, row)
      const id = row.billCode
      this.$refs.warehouseReserve.init(item, id, row.originId)
    },
    // 弹出采购入库库存
    triggleWarehousePurchase (row) {
      if (!row.procurementStockinInventory) {
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
      this.$refs.warehousePurchase.init(item, id)
    },
    // 采购库存
    linkProcurementInventory (row) {
      if (!row.originId) {
        Helper.notify('请确认后点击')
        return false
      }
      const payload = {
        operationType: 'Detail',
        procurementId: row.originId,
        state: 1
      }
      location.assign(`${
        this.$scmLink
      }ProcurementManagement/ProcurementManagementIndex${this.$stringify(payload)}#page1`)
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
