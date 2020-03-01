<template>
  <el-select ref="select"
             @remove-tag="focusInput"
             @option-reset="reset"
             :class="['common-select']"
             v-model="mainValue"
             :placeholder="getPlaceholder"
             :loading="loading"
             v-on="$listeners"
             v-bind="attrs">
    <el-option-group v-if="hasResetButton">
      <el-option value="重置"
                 @click.native.stop="reset"
                 reset>
        <span class="pull-left ellipsis">重置</span>
        <i class="pull-right el-select__caret el-input__icon el-icon-refresh"></i>
      </el-option>
    </el-option-group>
    <el-option-group v-if="hasResetButton">
      <el-option v-for="item in getSelectData"
                 :key="item[dataKey]"
                 :label="item[dataValue]"
                 v-bind:value="item[dataKey]">
      </el-option>
    </el-option-group>
    <el-option v-else
               v-for="item in getSelectData"
               :key="item[dataKey]"
               :label="item[dataValue]"
               v-bind:value="item[dataKey]">
    </el-option>
  </el-select>
</template>
<script>
/**
 * How to use
 * <Select :selectData="collection.purchaseState" dataKey="constantValue" dataValue="constantText" type="remote"></Select>
 */
export default {
  name: 'Select',
  inheritAttrs: false,
  data: () => ({
    initialized: false,
    inFocus: false,
    loading: false
  }),
  props: {
    value: '',
    name: {
      type: String,
      default: ''
    },
    selectData: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '全部'
    },
    dataKey: {
      type: String,
      default: 'value'
      // required: true
    },
    dataValue: {
      type: String,
      default: 'name'
      // required: true
    },
    type: {
      type: String,
      default: 'default'
    },
    remoteMethod: {
      type: Function
    },
    autoFetch: {
      type: Boolean,
      default: true
    },
    autoMultiple: {
      type: Boolean,
      default: true
    }
  },
  inject: {
    isConditon: {
      default: false
    },
    select: {
      require: false
    }
  },
  computed: {
    hasResetButton () {
      return 'multiple' in this.$attrs && this.attrs.clearable && this.selectData.length > 0
    },
    getSelectData () {
      if (this.autoMultiple && 'multiple' in this.$attrs) {
        const arr = this.mainValue
        const array = this.selectData
        return this.selectData.concat().sort((prev, next) => {
          const prevKey = prev[this.dataKey]
          const nextKey = next[this.dataKey]
          const isPrevSelected = arr.indexOf(prevKey) > -1
          const isNextSelected = arr.indexOf(nextKey) > -1
          if (isPrevSelected !== isNextSelected) {
            return isNextSelected ? 1 : -1
          }
          const prevIndex = isPrevSelected
            ? arr.indexOf(prevKey)
            : array.indexOf(prev)
          const nextIndex = isNextSelected
            ? arr.indexOf(nextKey)
            : array.indexOf(next)
          return prevIndex - nextIndex
        })
      }
      return this.selectData
    },
    hasHintIcon () {
      if ('multiple' in this.$attrs && this.mainValue.length > 1) {
        return true
      }
      return false
    },
    getPlaceholder () {
      if (this.type !== 'remote') {
        return this.placeholder
      } else if ('multiple' in this.$attrs) {
        if (this.mainValue.length > 0) {
          return ''
        }
        return this.inFocus && this.selectData.length
          ? '可输入关键字查找'
          : this.placeholder
      }
      return this.inFocus && this.selectData.length
        ? '可输入关键字查找'
        : this.placeholder
    },
    mainValue: {
      get () {
        return this.value
      },
      set (val) {
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
      if (this.type == 'remote') {
        Object.assign(merge, {
          remote: true,
          clearable: true,
          filterable: true,
          'reserve-keyword': true,
          'remote-method': this.wrappedRemoteMethod
        })
      }
      return Object.assign(merge, this.$attrs)
    }
  },
  methods: {
    inputEl () {
      return this.$refs.select.$refs.input
    },
    focusInput (val) {
      this.inFocus = true
      this.$nextTick(() => {
        const Select = this.$refs.select
        const input = Select.input || Select.reference
        if (input) {
          input.focus()
        }
      })
    },
    startLoading () {
      this.loading = true
    },
    stopLoading () {
      this.loading = false
    },
    wrappedRemoteMethod (payload) {
      this.remoteMethod(payload.substring(0, 200), this.loader)
      this.initialized = false
    },
    handleFocus () {
      if (this.inFocus) {
        return false
      }
      this.inFocus = true
    },
    handleBlur () {
      this.inFocus = false
    },
    handleChange (arr) {
      if ('multiple' in this.$attrs) {
        // this.selectData
        this.selectData.filter((item) => {
          const key = item[this.dataKey]
          return arr.indexOf(key) > -1
        })
      }
    },
    reset () {
      if ('multiple' in this.$attrs) {
        this.mainValue = []
      } else {
        this.mainValue = ''
      }
      Object.assign(this.$data, this.$options.data())
      this.focusInput()
    },
    reload () {
      Object.assign(this.$data, this.$options.data())
    }
  },
  watch: {
    getSelectData (val) {
      if (val && val.length > 0) {
        const arr = val.map(item => item[this.dataKey])
        if (this.$refs.select && this.$refs.select.sortOption) {
          this.$refs.select.sortOption(arr)
        }
      }
    },
    inFocus (val) {
      if (this.type !== 'remote') {
        return false
      }
      if (!this.inputEl()) {
        return false
      }
      if (val) {
        if (this.autoFetch && !this.initialized) {
          this.initialized = true
          this.remoteMethod(this.inputEl().value, this.loader)
        }
        this.inputEl().style.display = 'inline-block'
        this.inputEl().focus()
        this.$refs.select.resetInputHeight()
      } else {
        this.inputEl().style.display = 'none'
        this.$refs.select.resetInputHeight()
      }
    },
    mainValue (val) {
      if (val.length == 1) {
        setTimeout(() => {
          this.$refs.select.resetInputHeight()
        }, 100)
      }
    }
  },
  created () {
    this.loader = {
      start: this.startLoading,
      stop: this.stopLoading
    }
    this.select.push(this)
  },
  mounted () {
    const Select = this.$refs.select
    Select.$watch('visible', (val) => {
      if (this.inFocus !== val) {
        this.inFocus = val
      }
    })
  }
}
</script>
