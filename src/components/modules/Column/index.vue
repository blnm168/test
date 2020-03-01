<template>
  <td v-if="isShow"
      v-on="$listeners"
      v-bind="$attrs"
      @click="clickEvent">
    <p v-if="type=='default'">
      {{wrapper.row.get(data)}}
    </p>
    <p v-else-if="type=='template'">
      <slot></slot>
    </p>
  </td>
</template>

<script>
export default {
  name: 'Column',
  inheritAttrs: false,
  props: {
    data: {
      type: String
    },
    type: {
      type: String,
      default: 'default'
    },
    handleClick: {
      type: Function
    }
  },
  inject: {
    wrapper: {
      default: {}
    }
  },
  computed: {
    isShow () {
      const isShow = true
      return isShow
    }
  },
  methods: {
    clickEvent () {
      if (this.handleClick) {
        this.handleClick(this.row)
      }
    }
  }
}
</script>

<style>
</style>
