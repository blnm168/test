<template>
  <div class="modal animated">
    <div class="modal-background"></div>
    <div class="main-modal-progress justify-center">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BaseModal from '../BaseModal'

export default {
  name: 'Overlay',
  mixins: [BaseModal],
  props: {
    transition: {
      type: String,
      default: 'fade'
    }
  },
  mounted () {
    this.$nextTick(() => {
      document.body.appendChild(this.$el)
    })
  },
  destroyed () {
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
