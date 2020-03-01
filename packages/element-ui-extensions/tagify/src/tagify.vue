<template>
  <div class="el-select"
       :class="[selectSize ? 'el-select--' + selectSize : '']"
       @click.stop="handleToggleMenu"
       v-clickoutside="handleClose">
    <div class="el-select__tags"
         :class="[tagify ? 'is-tagify' : '']"
         v-if="multiple"
         ref="tags"
         :style="tagsStyle">
      <span v-if="collapseTags && selected.length">
        <el-tag :closable="!selectDisabled"
                :size="collapseTagSize"
                :hit="selected[0].hitState"
                type="info"
                @close="deleteTag($event, selected[0])"
                disable-transitions>
          <span class="el-select__tags-text">{{ selected[0].currentLabel }}</span>
        </el-tag>
        <el-tag v-if="selected.length > 1"
                :closable="false"
                :size="collapseTagSize"
                type="info"
                disable-transitions>
          <span class="el-select__tags-text">+ {{ selected.length - 1 }}</span>
        </el-tag>
      </span>
      <transition-group @after-leave="resetInputHeight"
                        v-if="!collapseTags">
        <el-tag v-for="item in selected"
                :key="getValueKey(item)"
                :closable="!selectDisabled"
                :size="collapseTagSize"
                :hit="item.hitState"
                type="info"
                @close="deleteTag($event, item)"
                disable-transitions>
          <span class="el-select__tags-text">{{ item.currentLabel }}</span>
        </el-tag>
      </transition-group>

      <input type="text"
             class="el-select__input"
             :class="[selectSize ? `is-${ selectSize }` : '']"
             :disabled="selectDisabled"
             :autocomplete="autoComplete"
             @focus="handleFocus"
             @blur="softFocus = false"
             @click.stop
             @keyup="managePlaceholder"
             @keydown="resetInputState"
             @keydown.down.prevent="navigateOptions('next')"
             @keydown.up.prevent="navigateOptions('prev')"
             @keydown.enter.prevent="handleEnterInput"
             @keydown.esc.stop.prevent="visible = false"
             @keydown.delete="deletePrevTag"
             @compositionstart="handleComposition"
             @compositionupdate="handleComposition"
             @compositionend="handleComposition"
             @paste="pasteOnInputChange"
             @keyup.188="beforeOnTagChange"
             @keyup.186="beforeOnTagChange"
             v-model="query"
             @input="e => handleQueryChange(e.target.value)"
             :debounce="remote ? 300 : 0"
             v-if="filterable"
             :style="inputStyle"
             ref="input">
    </div>
    <el-input ref="reference"
              v-model="selectedLabel"
              type="text"
              :placeholder="currentPlaceholder"
              :name="name"
              :id="id"
              :auto-complete="autoComplete"
              :size="selectSize"
              :disabled="selectDisabled"
              :readonly="readonly"
              :validate-event="false"
              :class="{ 'is-focus': visible }"
              @focus="handleFocus"
              @blur="handleBlur"
              @keyup.native="debouncedOnInputChange"
              @keydown.native.down.stop.prevent="navigateOptions('next')"
              @keydown.native.up.stop.prevent="navigateOptions('prev')"
              @keydown.native.enter.prevent="handleEnterInput"
              @keydown.native.esc.stop.prevent="visible = false"
              @keydown.native.tab="visible = false"
              @paste.native="debouncedOnInputChange"
              @mouseenter.native="inputHovering = true"
              @mouseleave.native="inputHovering = false">
      <template slot="prefix"
                v-if="$slots.prefix">
        <slot name="prefix"></slot>
      </template>
      <i slot="suffix"
         v-if="!tagify"
         :class="['el-select__caret', 'el-input__icon', 'el-icon-' + iconClass]"
         @click="handleIconClick"></i>
    </el-input>
    <transition name="el-zoom-in-top"
                @before-enter="handleMenuEnter"
                @after-leave="doDestroy">
      <el-select-menu ref="popper"
                      :append-to-body="popperAppendToBody"
                      v-show="visible && emptyText !== false">
        <el-scrollbar tag="ul"
                      wrap-class="el-select-dropdown__wrap"
                      view-class="el-select-dropdown__list"
                      ref="scrollbar"
                      :class="{ 'is-empty': !allowCreate && query && filteredOptionsCount === 0 }"
                      v-show="options.length > 0 && !loading">
          <el-option :value="query"
                     created
                     v-if="showNewOption && !isEditing">
          </el-option>
          <slot></slot>
        </el-scrollbar>
        <p class="el-select-dropdown__empty"
           v-if="emptyText &&
            (!allowCreate || loading || (allowCreate && options.length === 0 ))">
          {{ emptyText }}
        </p>
      </el-select-menu>
    </transition>
  </div>
</template>

<script>
import Select from 'element-ui-extensions/select/src/select.js'
import debounce from 'throttle-debounce/debounce'
import { cloneDeep } from 'lodash-es'

const cloneSelect = cloneDeep(Select)
delete cloneSelect.mixins[0].watch.visible

export default {
  name: 'Tagify',
  mixins: [cloneSelect],
  props: {
    tags: {
      default: [],
      required: true
    },
    tagify: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tagsStyle () {
      if (this.tagify) {
        return { 'max-width': 'auto' }
      } else {
        return { 'max-width': this.inputWidth - 32 + 'px' }
      }
    },
    inputStyle () {
      if (this.tagify) {
        return { 'max-width': this.inputWidth - 42 + 'px' }
      } else {
        return { width: this.inputLength + 'px', 'max-width': this.inputWidth - 42 + 'px' }
      }
    },
    isEditing () {
      return this.tagify && this.query.includes(',')
    }
  },
  methods: {
    handleToggleMenu () {
      if (!this.tagify) {
        this.toggleMenu()
      }
    },
    handleFocus (event) {
      if (!this.softFocus) {
        if (this.automaticDropdown) {
          this.visible = true
          this.menuVisibleOnFocus = true
        }
        if (this.tagify && !this.visible) {
          this.visible = true
        }
        this.$emit('focus', event)
      } else {
        this.softFocus = false
      }
    },
    formatValue (value) {
      const data = value.replace(/(^,*)/g, '').trim()
      return data === ',' ? '' : data
    },
    beforeOnTagChange () {
      const value = this.formatValue(this.query)
      this.query = value
      if (!value) {
        return false
      }
      this.$nextTick(() => {
        this.debouncedOnTagChange()
      })
    },
    pasteOnInputChange (event) {
      const clipboardData = event.clipboardData || event.originalEvent.clipboardData || window.clipboardData
      const value = this.formatValue(clipboardData.getData('text'))
      this.query = this.query + value
      if (!value) {
        return false
      }
      this.$nextTick(() => {
        this.onTagChange()
      })
    },
    onTagChange () {
      const query = this.formatValue(this.query)
      this.query = query
      if (!query) {
        return false
      }
      if (query.includes(',')) {
        let arr = query.split(',')
        const rest = arr.pop().replace(/(^,*)/g, '').trim()
        arr = arr.filter(item => item.trim() !== '')
        if (arr && arr.length > 0) {
          // tags列表
          const concatArr = this.tags.concat(arr)
          const tags = Array.from(new Set(concatArr))
          this.$emit('update:tags', tags)
          // value值
          const newValue = Array.from(new Set(this.value.concat(tags)))
          this.$emit('input', newValue)
          if (tags.length !== concatArr.length) {
            this.$emit('commit-repeat')
          }
          this.$nextTick(() => {
            this.query = rest || ''
          })
        }
      }
    },
    // tagify only
    onTagBlur () {
      const query = this.formatValue(this.query)
      this.query = query
      if (!query) {
        return false
      }
      let arr = []
      if (query.includes(',')) {
        arr = query.split(',')
      } else {
        arr.push(query)
      }
      arr = arr.filter(item => item.trim() !== '')
      if (arr && arr.length > 0) {
        // tags列表
        const concatArr = this.tags.concat(arr)
        const tags = Array.from(new Set(concatArr))
        this.$emit('input', tags)
        if (tags.length !== concatArr.length) {
          this.$emit('commit-repeat')
        }
        this.$nextTick(() => {
          this.query = ''
        })
      }
    },
    handleEnterInput () {
      const value = this.formatValue(this.query)
      this.query = value
      if (!this.tagify) {
        this.selectOption()
        return false
      }
      // tagify
      if (this.isEditing) {
        this.onTagChange()
      } else if (this.tags.indexOf(this.query) > -1) {
        this.$emit('commit-repeat')
      } else {
        this.selectOption()
      }
    },
    deletePrevTag (e) {
      if (this.tagify) {
        if (e.target.value.length <= 0) {
          if (this.tags.length > 0) {
            let value = `${this.tags.join(',')},`
            this.$emit('input', [])
            this.$nextTick(() => {
              this.query = value
            })
          }
        }
        return false
      }
      if (e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
        const value = this.value.slice()
        value.pop()
        this.$emit('input', value)
        this.emitChange(value)
      }
    }
  },
  watch: {
    value (val) {
      if (this.tagify) {
        this.$emit('update:tags', val)
      }
    },
    query (val) {
      this.query = val.replace(';', ',')
    },
    visible (val) {
      if (!val) {
        this.handleIconHide()
        this.broadcast('ElSelectDropdown', 'destroyPopper')
        if (this.$refs.input) {
          this.$refs.input.blur()
        }
        if (!this.tagify) {
          this.query = ''
          this.previousQuery = null
          this.selectedLabel = ''
          this.inputLength = 20
        } else {
          this.onTagBlur()
        }
        this.resetHoverIndex()
        this.$nextTick(() => {
          if (this.$refs.input &&
              this.$refs.input.value === '' &&
              this.selected.length === 0) {
            this.currentPlaceholder = this.cachedPlaceHolder
          }
        })
        if (!this.multiple) {
          if (this.selected) {
            if (this.filterable && this.allowCreate &&
                this.createdSelected && this.createdLabel) {
              this.selectedLabel = this.createdLabel
            } else {
              this.selectedLabel = this.selected.currentLabel
            }
            if (this.filterable) this.query = this.selectedLabel
          }
        }
      } else {
        this.handleIconShow()
        this.broadcast('ElSelectDropdown', 'updatePopper')
        if (this.filterable) {
          this.query = this.remote ? '' : this.selectedLabel
          this.handleQueryChange(this.query)
          if (this.multiple) {
            this.$refs.input.focus()
          } else {
            if (!this.remote) {
              this.broadcast('ElOption', 'queryChange', '')
              this.broadcast('ElOptionGroup', 'queryChange')
            }
            this.broadcast('ElInput', 'inputSelect')
          }
        }
      }
      this.$emit('visible-change', val)
    }
  },
  created () {
    this.debouncedOnTagChange = debounce(this.debounce, () => {
      this.onTagChange()
    })
  }

}
</script>
