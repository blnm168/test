<template>
  <Tagify ref="select"
          collapse-tags
          allow-create
          tagify
          multiple
          loop
          default-first-option
          @remove-tag="focusInput"
          @option-static-select="handleSelect"
          @option-reset="reset"
          @commit-repeat="handleRepeat"
          :filter-method="filterMethod"
          noDataText="支持逗号分隔多个搜索"
          :tags.sync="tags"
          filterable
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
    <el-option-group class="input-tag-group"
                     v-if="tags.length>0">
      <el-option static
                 @click.native.stop="deleteTag(tag)"
                 v-for="tag in tags"
                 :key="tag"
                 :label="tag"
                 :value="tag">
        <span class="pull-left ellipsis">{{ tag }}</span>
        <i class="pull-right el-select__caret el-input__icon el-icon-circle-close"></i>
      </el-option>
    </el-option-group>
  </Tagify>
</template>
<script>
/**
 * How to use
 * <Select :selectData="collection.purchaseState" dataKey="constantValue" dataValue="constantText" type="remote"></Select>
 */
export default {
  name: 'TagInput',
  inheritAttrs: false,
  data: () => ({
    initialized: false,
    inFocus: false,
    loading: false,
    tags: []
  }),
  props: {
    value: '',
    name: {
      type: String,
      default: ''
    },
    // selectData: {
    //   type: Array,
    //   default: () => []
    // },
    placeholder: {
      type: String,
      default: '全部'
    },
    // dataKey: {
    //   type: String,
    //   default: 'value'
    //   // required: true
    // },
    // dataValue: {
    //   type: String,
    //   default: 'name'
    //   // required: true
    // },
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
      return this.tags.length > 0
    },
    getPlaceholder () {
      // if (this.type !== 'remote') {
      //   return this.placeholder
      // } else if ('multiple' in this.$attrs) {
      //   if (this.mainValue.length > 0) {
      //     return ''
      //   }
      //   return this.inFocus && this.selectData.length
      //     ? '可输入关键字查找'
      //     : this.placeholder
      // }
      // return this.inFocus && this.selectData.length
      //   ? '可输入关键字查找'
      //   : this.placeholder
      return this.inFocus ? '' : this.placeholder
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
    filterMethod (query, item) {
      return item
    },
    handleRepeat () {
      Helper.notify('您提交了重复的数据')
    },
    deleteTag (tag) {
      const index = this.tags.indexOf(tag)
      if (index > -1) {
        const value = this.tags.slice()
        value.splice(index, 1)
        this.tags = value
      }
    },
    handleSelect (option) {
      let tag = option.currentValue
      this.deleteTag(tag)
    },
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
      // if ('multiple' in this.$attrs) {
      //   this.mainValue = []
      // } else {
      //   this.mainValue = ''
      // }
      this.mainValue = []
      Object.assign(this.$data, this.$options.data())
      this.focusInput()
    },
    reload () {
      Object.assign(this.$data, this.$options.data())
    }
  },
  watch: {
    // tags (val) {
    //   this.mainValue = val
    // },
    getSelectData (val) {
      if (val && val.length > 0) {
        const arr = val.map(item => item[this.dataKey])
        if (this.$refs.select && this.$refs.select.sortOption) {
          this.$refs.select.sortOption(arr)
        }
      }
    },
    inFocus (val) {
      const Select = this.$refs.select
      if (val) {
        if (this.type == 'remote' && this.autoFetch && !this.initialized) {
          this.initialized = true
          this.remoteMethod(this.inputEl().value, this.loader)
        }
        this.inputEl().style.display = 'inline-block'
        this.inputEl().focus()
        Select.resetInputHeight()
      } else {
        this.inputEl().style.display = 'none'
        Select.resetInputHeight()
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
