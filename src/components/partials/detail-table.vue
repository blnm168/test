<template>
  <div class="main-detail-table">
    <div class="mdl-grid dt-detail-table">
      <table ref="detail-table"
             class="mdl-data-detail-table dataTable flat-detail-table"
             cellspacing="0">
        <thead>
          <tr>
            <template v-for="(dict, index) in dataSet">
              <th v-bind:key="index">
                <span class="dt-title">{{dict.title}}</span>
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <slot></slot>
        </tbody>
      </table>
    </div>
    <div class="empty-detail-block"
         v-if="empty">
      <div class="empty-container">
        <div class="empty-text">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataSet: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    empty () {
      return this.data && this.data.length == 0
    }
  },
  mounted () {
    // this.resizeTable();
  }
}
</script>
