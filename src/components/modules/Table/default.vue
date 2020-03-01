<template>
  <div class="main-table">
    <div class="mdl-grid dt-table"
         ref="grid">
      <div ref="sticky"
           class="sticky-head"
           v-show="showSticky">
        <table class="mdl-data-table dataTable flat-table fixed-table"
               cellspacing="0"
               width="100%">
          <thead>
            <tr>
              <th class="table-checkbox"
                  v-if="checkbox">
                <el-checkbox v-model="checked"></el-checkbox>
              </th>
              <th v-if="index">
                <span class="dt-title">编号</span>
              </th>
              <template v-for="(dict, index) in dataSet">
                <sort-th ref="sortItem"
                         v-if="dict.sort"
                         v-bind:key="index"
                         :title="dict.title"
                         :data="dict.data"
                         @sort-change="handleSort"></sort-th>
                <th v-else
                    v-bind:key="index">
                  <i class="material-icons"
                     v-if="dict.icon">{{dict.icon}}</i>
                  <span class="dt-title">{{dict.title}}</span>
                </th>
              </template>
            </tr>
          </thead>
        </table>
      </div>
      <div class="main-table-content">
        <table ref="table"
               class="mdl-data-table dataTable flat-table"
               cellspacing="0"
               width="100%">
          <thead ref="thead">
            <tr>
              <th class="table-checkbox"
                  v-if="checkbox">
                <el-checkbox v-model="checked"></el-checkbox>
              </th>
              <th v-if="index">
                <span class="dt-title">编号</span>
              </th>
              <template v-for="(dict, index) in dataSet">
                <sort-th ref="sortItem"
                         v-if="dict.sort"
                         v-bind:key="index"
                         :title="dict.title"
                         :data="dict.data"
                         @sort-change="handleSort"></sort-th>
                <th v-else
                    v-bind:key="index">
                  <i class="material-icons"
                     v-if="dict.icon">{{dict.icon}}</i>
                  <span class="dt-title">{{dict.title}}</span>
                </th>
              </template>
            </tr>
          </thead>
          <tbody v-show="isReady">
            <slot name="row"
                  v-for="(row, index) in data"
                  :row="row"
                  :index="index">
            </slot>
          </tbody>
        </table>
      </div>
      <div class="empty-block"
           :class="{'main-block':isMain}"
           v-if="hasHint">
      </div>
    </div>
    <div class="empty-block hover"
         :class="{'main-block':isMain}"
         v-if="!isReady">
      <div class="empty-container">
        <div class="empty-text">请选择相关查询条件进行查询</div>
      </div>
    </div>
    <div class="empty-block hover"
         :class="{'main-block':isMain}"
         v-if="empty">
      <div class="empty-container"
           v-if="isMain">
        <div class="empty-text">暂无数据，请重新设置查询条件</div>
      </div>
      <div class="empty-container"
           v-else>
        <div class="empty-text">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import 'waypoints/lib/noframework.waypoints.js'
import ResizeObserver from 'resize-observer-polyfill'
import sortItem from './sort.vue'

export default {
  name: 'AppTable',
  data: () => ({
    checked: false,
    showSticky: false,
    observer: null
  }),
  components: {
    'sort-th': sortItem
  },
  provide: function provide () {
    return {
      index: this.index,
      checkbox: this.checkbox
    }
  },
  props: {
    dataSet: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      default: () => []
    },
    ready: {
      type: Boolean,
      default: false
    },
    index: {
      type: Boolean,
      default: false
    },
    isMain: {
      type: Boolean,
      default: false
    },
    checkbox: {
      type: Boolean,
      default: false
    },
    resize: {
      type: Boolean,
      default: false
    },
    fixedHead: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hasHint () {
      return !(this.isReady && this.data && this.data.length > 0)
    },
    empty () {
      return this.isReady && this.data && this.data.length == 0
    },
    isReady: {
      get () {
        return this.ready
      },
      set (val) {
        this.$emit('update:ready', val)
      }
    }
  },
  watch: {
    data (arr) {
      if (Array.isArray(arr)) {
        this.isReady = true
      }
      if (this.fixedHead) {
        this.createfixedHead()
      }
      if (this.resize) {
        this.resizeTable()
      }
    },
    isReady (val) {
      this.$refs.grid.scrollLeft = 0
      if (val) {
        this.watchHead()
      }
    },
    checked: {
      handler (newVal) {
        const dataList = this.data
        for (const i in dataList) {
          this.$set(this.data[i], 'checked', newVal)
        }
      }
    }
  },
  methods: {
    reset () {
      // this.isReady = false
      Object.assign(this.$data, this.$options.data())
      this.home()
      this.$emit('sort-change', {
        sortField: '',
        sortOrder: ''
      })
      this.$refs.sortItem.forEach((vm) => {
        vm.sorted = 'default'
      })
    },
    home () {
      this.$refs.grid.scrollLeft = 0
    },
    handleSort (sort) {
      this.$refs.sortItem.forEach((vm) => {
        if (vm.data != sort.sortField) {
          vm.sorted = 'default'
        }
      })
      this.$emit('sort-change', sort)
    },
    getSelected () {
      return this.data.filter(item => item.checked)
    },
    createfixedHead () {
      this.$nextTick(() => {
        const widthArr = this.getWidth()
        Array.from(this.$refs.sticky.querySelectorAll('th')).forEach((el, index) => {
          el.width = `${widthArr[index]}px`
        })
      })
    },
    getTableDom () {
      return this.$refs.table
    },
    getWidth () {
      return Array.from(this.$refs.thead.querySelectorAll('th')).map((el) => {
        if (el) {
          return el.offsetWidth
        }
      })
    },
    // 表格列宽可拖动
    resizeTable () {
      const tabSize = {}
      tabSize.init = function (dom) {
        let self = dom
        const table = dom
        const header = table.rows[0]
        let tableX = header.clientWidth
        const length = header.cells.length
        for (let i = 0; i < length; i++) {
          header.cells[i].onmousedown = function () {
            self = this
            if (event.offsetX > self.offsetWidth - 10) {
              self.mouseDown = true
              self.oldX = event.x
              self.oldWidth = self.offsetWidth
            }
          }
          header.cells[i].onmousemove = function () {
            if (event.offsetX > this.offsetWidth - 10) {
              this.style.cursor = 'col-resize'
            } else {
              this.style.cursor = 'default'
            }
            if (self == undefined) {
              self = this
            }
            if (self.mouseDown != null && self.mouseDown == true) {
              self.style.cursor = 'default'
              if (self.oldWidth + (event.x - self.oldX) > 0) {
                self.width = self.oldWidth + (event.x - self.oldX)
              }
              self.style.width = self.width
              table.style.width = `${tableX + (event.x - self.oldX)}px`
              self.style.cursor = 'col-resize'
            }
          }
          table.onmouseup = function () {
            if (self == undefined) {
              self = this
            }
            self.mouseDown = false
            self.style.cursor = 'default'
            tableX = header.clientWidth
          }
        }
      }
      tabSize.init(this.$refs.table)
    },
    watchHead () {
      const self = this
      if (!self.fixedHead) {
        return false
      }
      new window.Waypoint({
        element: this.$refs.thead,
        direction: 'down right',
        handler (direction) {
          const shouldBeStuck = this.options.direction.indexOf(direction) > -1
          if (shouldBeStuck) {
            // self.$refs.sticky.scrollLeft = self.$refs.grid.scrollLeft
            self.showSticky = true
          } else {
            self.showSticky = false
          }
        }
      })
    }
  },
  mounted () {
    this.$refs.grid.addEventListener('scroll', () => {
      this.$refs.sticky.scrollLeft = this.$refs.grid.scrollLeft
    })
    if (this.fixedHead) {
      this.observer = new ResizeObserver(() => {
        window.Waypoint.refreshAll()
      })
      this.observer.observe(document.body)
    }
  },
  destroyed () {
    if (this.fixedHead) {
      window.Waypoint.destroy()
      this.observer.unobserve(document.body)
    }
  }
}
</script>

<style>
.sticky-head {
  position: fixed;
  z-index: 1;
  background-color: #fff;
  top: 0;
  left: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-left: 12px;
  padding-right: 12px;
}
</style>
