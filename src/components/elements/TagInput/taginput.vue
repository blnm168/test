<template>
  <div class="el-select"
       :class="{'hashint-tag': selected.length > 1}"
       @click="doFocus"
       v-clickoutside="handleClose">
    <div class="el-select__tags"
         ref="tags"
         :style="{ 'max-width': inputWidth + 'px' }">
      <span v-if="this.selected.length > 0">
        <el-tag :closable="true"
                :hit="selected[0].hitState"
                type="info"
                size="small"
                @close="deleteTag($event, selected[0])"
                disable-transitions>
          <span class="el-select__tags-text">{{ selected[0] }}</span>
        </el-tag>
        <el-tag v-if="selected.length > 1"
                @click.native.stop="toggleMenu"
                :closable="false"
                style="cursor: pointer;"
                type="primary"
                size="small"
                disable-transitions>
          <span class="el-select__tags-text">+ {{ selected.length - 1 }}
            <i :class="['el-icon-' + tagIconClass]"></i>
          </span>
        </el-tag>
      </span>
      <input ref="input"
             v-show="showInput"
             type="text"
             class="el-select__input"
             @focus="handleFocus"
             @blur="handleBlur"
             @paste="pasetOnInputChange"
             @keyup.188="beforeOnInputChange"
             @keyup.186="beforeOnInputChange"
             @keydown.enter.prevent="enterTag"
             @keydown.delete="reloadInput"
             v-model="selectedLabel"
             @keydown.native.down.stop.prevent="navigateOptions('next')"
             @keydown.native.up.stop.prevent="navigateOptions('prev')"
             placeholder=""
             v-bind="attrs">
      <!-- :style="{ 'max-width': inputWidth - 42 + 'px' }" -->
    </div>
    <el-input ref="reference"
              :class="{ 'is-focus': softFocus || visible}"
              :readonly="true"
              @keydown.native.down.stop.prevent="navigateOptions('next')"
              @keydown.native.up.stop.prevent="navigateOptions('prev')"
              :placeholder="getPlaceholder">
      <template slot="prefix"
                v-if="$slots.prefix">
        <slot name="prefix"></slot>
      </template>
      <!-- <i slot="suffix"
         :class="['el-select__caret', 'el-input__icon', 'el-icon-' + iconClass]"
         @click="handleIconClick"></i> -->
    </el-input>
    <transition name="el-zoom-in-top"
                @before-enter="handleMenuEnter">
      <el-select-menu v-show="visible && selected.length >1"
                      ref="popper"
                      :append-to-body="true">
        <el-scrollbar tag="ul"
                      wrap-class="el-select-dropdown__wrap"
                      view-class="el-select-dropdown__list"
                      ref="scrollbar">
          <el-option-group>
            <el-option value="重置"
                       @click.native.stop="resetTag"
                       reset>
              <span class="pull-left ellipsis"
                    :style="{ 'max-width': inputWidth - 42 - 12 + 'px' }">重置</span>
              <i class="pull-right el-select__caret el-input__icon el-icon-refresh"></i>
            </el-option>
          </el-option-group>
          <el-option-group>
            <el-option v-for="(item, index) in selected"
                       :value="item"
                       :key="index"
                       @click.native.stop="deleteTag($event, item)">
              <span class="pull-left ellipsis"
                    :style="{ 'max-width': inputWidth - 42 - 12 + 'px' }">{{ item }}</span>
              <i class="pull-right el-select__caret el-input__icon el-icon-circle-close"></i>
            </el-option>
          </el-option-group>
        </el-scrollbar>
      </el-select-menu>
    </transition>
  </div>
</template>

<script>
import Emitter from 'element-ui/src/mixins/emitter'
import Focus from 'element-ui/src/mixins/focus'

import { debounce } from 'lodash-es'

import {
  addResizeListener,
  removeResizeListener
} from 'element-ui/src/utils/resize-event'
import ElSelectMenu from 'element-ui/packages/select/src/select-dropdown.vue'
import NavigationMixin from 'element-ui/packages/select/src/navigation-mixin'
import scrollIntoView from 'element-ui/src/utils/scroll-into-view'

import Clickoutside from 'element-ui/src/utils/clickoutside'

export default {
  name: 'TagInput',
  mixins: [Emitter, Focus('reference'), NavigationMixin],
  inheritAttrs: false,
  components: {
    ElSelectMenu
  },
  directives: { Clickoutside },
  provide () {
    return {
      select: this
    }
  },
  data () {
    return {
      selectedLabel: '',
      inputWidth: 0,
      inputLength: 20,
      options: [],
      cachedOptions: [],
      visible: false,
      showNewOption: false,
      softFocus: false,
      showInput: true,
      hoverIndex: -1,
      inputHovering: false
    }
  },
  props: {
    value: {
      required: true,
      default: []
    }
  },
  inject: {
    isConditon: {
      default: false
    }
  },
  computed: {
    selected: {
      get () {
        return this.value
      },
      set (val) {
        const length = this.$refs.input.value.length * 15 + 20
        this.inputLength = Math.min(50, length)
        this.$emit('input', val)
      }
    },
    attrs () {
      const merge = {}
      if (this.isConditon) {
        Object.assign(merge, {
          clearable: true
        })
      }
      return Object.assign(merge, this.$attrs)
    },
    getPlaceholder () {
      const criteria =
        this.softFocus || this.selectedLabel || this.selected.length > 0
      return criteria ? '' : this.$attrs.placeholder
    },
    iconClass () {
      if (this.selected.length <= 1) {
        return ''
      }
      return this.visible ? 'arrow-down' : 'arrow-up'
      // ? 'circle-close is-show-close'
    },
    tagIconClass () {
      return this.visible ? 'arrow-up' : 'arrow-down'
    }
  },
  methods: {
    handleClose () {
      // this.handleRealBlur()
      this.visible = false
    },
    toggleMenu () {
      if (this.selected.length > 0) {
        this.visible = !this.visible
        if (this.visible) {
          (this.$refs.input || this.$refs.reference).focus()
        }
      }
    },
    doDestroy () {
      this.$refs.popper && this.$refs.popper.doDestroy()
    },

    scrollToOption (option) {
      const target = Array.isArray(option) && option[0] ? option[0].$el : option.$el
      if (this.$refs.popper && target) {
        const menu = this.$refs.popper.$el.querySelector('.el-select-dropdown__wrap')
        scrollIntoView(menu, target)
      }
      this.$refs.scrollbar && this.$refs.scrollbar.handleScroll()
    },
    handleMenuEnter () {
      this.$nextTick(() => this.scrollToOption(this.selected))
    },
    resetInputWidth () {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width
    },
    resetInputHeight () {
      const input = this.$refs.reference.$el.querySelector('input')
      const tags = this.$refs.tags
      const sizeInMap = 40
      input.style.height =
        this.selected.length === 0
          ? `${sizeInMap}px`
          : `${Math.max(
            tags
              ? tags.clientHeight + (tags.clientHeight > sizeInMap ? 6 : 0)
              : 0,
            sizeInMap
          )}px`
    },
    onInputChange () {
      if (this.selectedLabel.includes(',')) {
        let arr = this.selectedLabel.split(',')
        const rest = arr.pop().replace(/(^,*)/g, '').trim()
        arr = arr.filter(item => item.trim() !== '')
        if (arr && arr.length > 0) {
          const concatArr = this.selected.concat(arr)
          const selected = Array.from(new Set(concatArr))
          this.selected = selected
          if (selected.length !== concatArr.length) {
            Helper.notify('您提交了重复的数据')
          }
          this.selectedLabel = rest || ''
        }
      }
      // this.visible = false
    },
    formatValue (value) {
      const data = value.replace(/(^,*)/g, '').trim()
      return data === ',' ? '' : value
    },
    beforeOnInputChange () {
      const value = this.formatValue(this.selectedLabel)
      this.selectedLabel = value
      if (!value) {
        return false
      }
      this.$nextTick(() => {
        this.debouncedOnInputChange()
      })
    },
    pasetOnInputChange (event) {
      const clipboardData = event.clipboardData || event.originalEvent.clipboardData || window.clipboardData
      const value = this.formatValue(clipboardData.getData('text'))
      this.selectedLabel = this.selectedLabel + value
      if (!value) {
        return false
      }
      this.$nextTick(() => {
        this.onInputChange()
      })
    },
    resetTag () {
      this.selected = []
      this.selectedLabel = ''
      this.softFocus = true
    },
    deleteTag (event, tag) {
      const index = this.selected.indexOf(tag)
      if (index > -1) {
        const value = this.value.slice()
        value.splice(index, 1)
        this.$emit('input', value)
        // this.emitChange(value)
        // this.$emit('remove-tag', tag)
      }
      this.softFocus = true
      event.stopPropagation()
    },
    enterTag () {
      const value = this.selectedLabel.replace(/(^,*)/g, '').trim()
      this.selectedLabel = value
      if (!value) {
        return false
      }
      if (value.includes(',')) {
        this.onInputChange()
      } else {
        const index = this.selected.indexOf(value)
        if (index > -1) {
          Helper.notify('您提交了重复的数据')
          return false
        }
        this.selected.push(value)
        this.selectedLabel = ''
      }
    },
    reloadInput () {
      if (!this.selectedLabel && this.selected.length > 0) {
        this.selectedLabel = `${this.selected.join(',')},`
        this.selected = []
      }
    },
    onOptionDestroy (index) {
      if (index > -1) {
        this.optionsCount--
        this.filteredOptionsCount--
        this.options.splice(index, 1)
      }
    },
    doFocus () {
      this.softFocus = true
      // this.$refs.input.focus()
    },
    handleFocus () {
      this.softFocus = true
    },
    handleBlur () {
      this.softFocus = false
      this.$refs.reference.blur()
    },
    handleRealBlur () {
      this.visible = false
      this.enterTag()
      this.$nextTick(() => {
        this.showInput = false
        this.$nextTick(() => {
          this.resetInputHeight()
        })
      })
    },
    handleIconClick () {
      if (!this.visible) {
        this.visible = true
      } else {
        this.visible = false
        // this.selected = []
        // this.selectedLabel = ''
      }
    }
  },
  watch: {
    visible (val) {
      if (!val) {
        this.broadcast('ElSelectDropdown', 'destroyPopper')
      } else {
        this.broadcast('ElSelectDropdown', 'updatePopper')
      }
    },
    selected () {
      this.$nextTick(() => {
        this.resetInputHeight()
      })
    },
    softFocus (val) {
      if (val) {
        this.showInput = true
        this.$nextTick(() => {
          this.resetInputHeight()
          this.$refs.input.focus()
        }, 20)
      }
      if (!val) {
        setTimeout(() => {
          if (!this.softFocus) {
            this.handleRealBlur()
          }
        }, 20)
      }
    },
    selectedLabel (val) {
      if (val.includes(';')) {
        this.selectedLabel = val.replace(';', ',')
      }
    }
  },
  created () {
    this.$emit('input', [])
    this.debouncedOnInputChange = debounce(() => {
      this.onInputChange()
    }, 300)

    this.$on('fieldReset', () => {
      this.dispatch('ElFormItem', 'el.form.change')
    })
  },
  mounted () {
    this.broadcast('ElSelectDropdown', 'updatePopper')
    addResizeListener(this.$el, this.resetInputWidth)
    // addResizeListener(this.$refs.tags, this.resetInputHeight)
    this.$nextTick(() => {
      if (this.$refs.reference && this.$refs.reference.$el) {
        this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width
      }
    })
  },
  beforeDestroy () {
    if (this.$el && this.resetInputWidth) {
      removeResizeListener(this.$el, this.resetInputWidth)
    }
    // if (this.$refs.tags && this.resetInputHeight) {
    //   removeResizeListener(this.$refs.tags, this.resetInputHeight)
    // }
  }
}
</script>

<style lang="less">
.el-select-group__wrap:not(:last-of-type) {
  padding-bottom: 10px;
  &:after {
    bottom: 5px;
  }
}
</style>
