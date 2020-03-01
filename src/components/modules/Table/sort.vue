<template>
  <th :class="sortClass"
      @click="triggerSort()">
    <span class="dt-title">{{title}}</span>
  </th>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: String,
      required: true
    }
  },
  data: () => ({
    sorted: 'default'
  }),
  computed: {
    sortClass () {
      if (this.sorted == 'asc') {
        return 'sorting_asc'
      } else if (this.sorted == 'desc') {
        return 'sorting_desc'
      }
      return 'sorting'
    }
  },
  methods: {
    triggerSort () {
      const queue = ['default', 'asc', 'desc']
      const index = queue.indexOf(this.sorted)
      let sorted = 'default'
      if (index < queue.length - 1) {
        sorted = queue[index + 1]
      }
      this.sorted = sorted
      let sort = {}
      if (sorted == 'default') {
        sort = {
          sortField: '',
          sortOrder: ''
        }
      } else {
        sort = {
          sortField: this.data,
          sortOrder: sorted
        }
      }
      this.$emit('sort-change', sort)
    }
  }
}
</script>
