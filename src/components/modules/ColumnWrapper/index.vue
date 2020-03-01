<template>
  <tr @click="triggerClick">
    <td v-if="checkbox">
      <el-checkbox v-model="row.checked"></el-checkbox>
    </td>
    <td v-if="index">{{ this.helper.index + 1 }}</td>
    <slot></slot>
  </tr>
</template>

<script>
import Row from './row.js'

export default {
  name: 'ColumnWrapper',
  inject: {
    index: {
      default: false
    },
    checkbox: {
      default: false
    }
  },
  props: {
    helper: {
      type: Object,
      required: true
    },
    Row: {
      type: Function,
      required: false,
      default: Row
    }
  },
  computed: {
    row () {
      return new this.Row(this.helper.row)
    }
  },
  provide: function provide () {
    return {
      wrapper: this
    }
  },
  methods: {
    triggerClick () {
      if (this.checkbox) {
        this.$set(this.helper.row, 'checked', !this.helper.row.checked)
      }
      this.$emit('click')
    }
  }
}
</script>
