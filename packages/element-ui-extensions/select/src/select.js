import { Select } from 'element-ui'
import scrollIntoView from 'element-ui/src/utils/scroll-into-view'

export default {
  name: 'ElSelect',
  mixins: [Select],
  props: {
    loop: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    scrolling: false
  }),
  computed: {
    emptyText () {
      if (this.loading) {
        return this.loadingText || this.t('el.select.loading')
      }
      // if (this.remote && this.query === '' && this.options.length === 0) return false
      if (
        this.filterable &&
        this.query &&
        this.options.length > 0 &&
        this.filteredOptionsCount === 0
      ) {
        return this.noMatchText || this.t('el.select.noMatch')
      }
      if (this.options.length === 0) {
        return this.noDataText || this.t('el.select.noData')
      }

      return null
    },
    iconClass () {
      const criteria =
        this.clearable &&
        !this.selectDisabled &&
        this.inputHovering &&
        !this.multiple &&
        this.value !== undefined &&
        this.value !== ''
      // return criteria ? 'circle-close is-show-close' : (this.remote && this.filterable ? '' : 'arrow-up')
      return criteria ? 'circle-close is-show-close' : 'arrow-up'
    }
  },
  methods: {
    sortOption (arr) {
      this.options.sort(
        (prev, next) =>
          arr.indexOf(prev.currentValue) - arr.indexOf(next.currentValue)
      )
    },
    selectOption () {
      if (
        this.options[this.hoverIndex] &&
        this.options[this.hoverIndex].static
      ) {
        this.$emit('option-static-select', this.options[this.hoverIndex])
        return false
      }
      if (
        this.options[this.hoverIndex] &&
        this.options[this.hoverIndex].reset
      ) {
        this.$emit('option-reset')
        return false
      }
      if (!this.visible) {
        this.toggleMenu()
      } else if (this.options[this.hoverIndex]) {
        this.handleOptionSelect(this.options[this.hoverIndex])
      }
    },
    scrollToOption (option) {
      const target =
        Array.isArray(option) && option[0] ? option[0].$el : option.$el
      if (this.$refs.popper && target) {
        const menu = this.$refs.popper.$el.querySelector(
          '.el-select-dropdown__wrap'
        )
        this.scrolling = true
        scrollIntoView(menu, target)
        setTimeout(() => {
          this.scrolling = false
        }, 500)
      }
      this.$refs.scrollbar && this.$refs.scrollbar.handleScroll()
    },
    navigateOptions (direction) {
      if (!this.visible) {
        this.visible = true
        return
      }
      if (this.options.length === 0 || this.filteredOptionsCount === 0) return
      if (!this.optionsAllDisabled) {
        if (direction === 'next') {
          if (this.loop) {
            this.hoverIndex++
          } else if (this.hoverIndex + 1 < this.options.length) {
            this.hoverIndex++
          }
          if (this.hoverIndex === this.options.length) {
            this.hoverIndex = 0
          }
        } else if (direction === 'prev') {
          if (this.loop) {
            this.hoverIndex--
          } else if (this.hoverIndex > 0) {
            this.hoverIndex--
          }
          if (this.hoverIndex < 0) {
            this.hoverIndex = this.options.length - 1
          }
        }
        const option = this.options[this.hoverIndex]
        if (
          option.disabled === true ||
          option.groupDisabled === true ||
          !option.visible
        ) {
          this.navigateOptions(direction)
        }
        this.$nextTick(() => this.scrollToOption(this.hoverOption))
      }
    },
    handleFocus (event) {
      if (!this.softFocus) {
        if (this.automaticDropdown) {
          this.visible = true
          this.menuVisibleOnFocus = true
        }
        this.$emit('focus', event)
      } else {
        this.softFocus = false
      }
    }
  }
}
