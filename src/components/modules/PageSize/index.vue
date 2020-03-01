<template>
  <el-select size="small"
             v-model="size"
             placeholder="显示条数"
             @change="change">
    <el-option class="text-center"
               v-for="item in pageSize"
               :key="item"
               :label="showSize(item)"
               v-bind:value="item">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'PageSize',
  data: () => ({
    size: 20
  }),
  props: {
    pageSize: {
      type: Array,
      default: () => [20, 50, 100, 200]
    },
    setSize: {
      type: Number,
      default: 20
    }
  },
  methods: {
    showSize (item) {
      return `${item}条/页`
    },
    change (val) {
      this.$emit('size-change', val)
    }
  },
  created () {
    this.size = this.setSize
  }
}
</script>
