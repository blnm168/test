<template>
  <el-button :type="theme"
             :size="size"
             @click="handleClick">
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    theme: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'default'
    }
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>
