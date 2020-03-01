<template>
  <el-pagination ref="pagination"
                 background
                 layout="total, prev, pager, next, jumper"
                 :total="total"
                 :size="size"
                 :page-size="size"
                 :current-page="current"
                 @current-change="handleCurrentChange">
  </el-pagination>
</template>

<script>
export default {
  props: {
    current: {
      type: Number
    },
    size: {
      type: Number
    },
    total: {
      type: Number
    }
  },
  methods: {
    // 当前页
    handleCurrentChange (current) {
      this.$emit('current-change', current)
    }
  }
}
</script>
