<template>
  <div class="grid-row"
       :class="{'grid-layout':grid}">
    <slot></slot>
  </div>
</template>

<style>
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, 330px);
  justify-content: space-between;
}
</style>

<script>
export default {
  name: 'Row',
  props: {
    grid: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '95px'
    }
  }
}
</script>
