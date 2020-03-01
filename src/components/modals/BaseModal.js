export default {
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
      this.show = true
    },
    deactive () {
      this.$el.classList.remove('is-active')
      this.show = false
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
