<template>
  <div class="modal animated">
    <div class="modal-background"></div>
    <div class="main-modal-content">
      <div class="modal-card"
           ref="card"
           :class="{'full-height':full}">
        <header class="modal-card-head">
          <p class="modal-card-title">{{title}}</p>
          <button class="delete"
                  @click="close"></button>
        </header>
        <section class="modal-card-body">
          <slot></slot>
        </section>
        <footer class="modal-card-foot">
          <slot name="foot"></slot>
          <template v-if="defaultFoot">
            <Button @click="close">
              确认
            </Button>
          </template>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    transition: {
      type: String,
      default: 'fade'
    },
    title: {
      type: String
    },
    full: {
      type: Boolean,
      default: false
    },
    defaultFoot: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      document.body.appendChild(this.$el)
    })
  },
  destroyed () {
    // this.$el.remove();
    const self = this.$el
    self.parentElement.removeChild(self)
  },
  methods: {
    afterLeave () {
      this.$destroy()
    },
    active () {
      this.$el.classList.add('is-active')
    },
    deactive () {
      this.$el.classList.remove('is-active')
      this.$emit('close')
    },
    close () {
      this.deactive()
    },
    open () {
      this.active()
    },
    resize () {
      if (this.full) {
        return false
      }
      const card = this.$refs.card
      const documentHeight = document.body.clientHeight
      if (card.clientHeight >= documentHeight) {
        card.style.height = '100%'
      }
    }
  },
  computed: {
    enterClass () {
      return `${this.transition}In`
    },
    leaveClass () {
      return `${this.transition}Out`
    }
  }
}
</script>

<!--<style lang="less" src="./overlay.less"></style>-->
