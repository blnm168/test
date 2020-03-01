import { Option } from 'element-ui'

export default {
  name: 'ElOption',
  mixins: [Option],
  props: {
    reset: {
      type: Boolean,
      default: false
    },
    static: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hoverItem () {
      if (!this.disabled && !this.groupDisabled && !this.select.scrolling) {
        this.select.hoverIndex = this.select.options.indexOf(this)
      }
    }
  }
}
