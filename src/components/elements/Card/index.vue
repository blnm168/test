<template>
  <el-card class="primary-box-card"  :class="{'contraction': !showCard}">
    <div slot="header"
         class="primary-box-header">
      <div class="title"
           v-html="title"></div>
        <div class="card-tools">
          <slot name="tools">
          </slot>
          <i class="material-icons" @click="toggleCard" v-if="expansible">
            <span v-if="showCard">
              keyboard_arrow_down
            </span>
            <span v-else>
              keyboard_arrow_up
            </span>
          </i>
        </div>
    </div>
    <div class="expansion-container">
      <slot></slot>
    </div>
    <slot name="more"></slot>
  </el-card>
</template>
<script>
export default {
  name: 'Card',
  data: () => ({
    showCard: true
  }),
  props: {
    title: String,
    expansible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleCard () {
      this.showCard = !this.showCard
    }
  }
}
</script>
