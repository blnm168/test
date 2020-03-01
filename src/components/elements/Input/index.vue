<template>
  <el-input ref="input"
             v-model="mainValue"
             v-on="$listeners"
             v-bind="attrs">
  </el-input>
</template>

<script>
export default {
  name: 'Input',
  inheritAttrs: false,
  props: {
    value: null
  },
  inject: {
    isConditon: {
      default: false
    }
  },
  computed: {
    mainValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    attrs () {
      const merge = {}
      if (this.isConditon) {
        Object.assign(merge, {
          clearable: true
        })
      }
      return Object.assign(merge, this.$attrs)
    }
  }
}
</script>
