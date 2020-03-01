<template>
  <form class="form-inline">
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: 'Form',
  data: () => ({
    dates: [],
    select: []
  }),
  props: {
    condition: {
      type: Boolean,
      default: false
    },
    gird: {
      type: Boolean,
      default: true
    },
    labelWidth: {
      type: String,
      default: '95'
    }
  },
  provide: function provide () {
    return {
      isConditon: this.isConditon,
      dates: this.dates,
      select: this.select,
      labelWidth: this.labelWidth
    }
  },
  computed: {
    isConditon () {
      return this.condition
    }
  },
  methods: {
    reset () {
      this.dates.forEach((vm) => {
        vm.defaultTime()
      })
      this.select.forEach(vm => {
        vm.reset()
      })
    }
  }
}
</script>
