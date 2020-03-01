<template>
  <div class="field">
    <span class="input-label"
          :style="labelStyle">{{title}}:</span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Field',
  props: {
    title: {
      type: String,
      default: '标题'
    }
  },
  inject: {
    labelWidth: {
      default: '95'
    }
  },
  computed: {
    labelStyle () {
      return { 'min-width': this.labelWidth + 'px' }
    }
  }
}
</script>
