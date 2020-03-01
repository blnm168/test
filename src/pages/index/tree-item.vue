<template>
  <li>
    <a href="javascript:void(0);" class="collapsible-header" v-if="item.children">
       <i class="material-icons">folder</i>
       {{item.name}}
    </a>
    <a @click="handleClick(item.link)" v-else>
       <i class="material-icons">dashboard</i>
       {{item.name}}
    </a>
    <ul class="collapsible-body" v-if="item.children">
      <sidebar-item :item="item" v-for="(item, index) in item.children" :key="index" @triggle-click="handleClick"></sidebar-item>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'sidebar-item',
  props: {
    item: null
  },
  methods: {
    isObject (item) {
      return item instanceof Object
    },
    handleClick (link) {
      this.$emit('triggle-click', link)
    }
  }
}
</script>
