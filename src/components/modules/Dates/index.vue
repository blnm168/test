<template>
  <Field :title="title"
         class="field-dates">
    <el-date-picker v-model="mainStart"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :placeholder="startholder"
                    :picker-options="{disabledDate:limitMaxDate}">
      <!-- value-format="yyyy-MM-dd HH:mm:ss" -->
    </el-date-picker>
    <span class="space">&nbsp;-&nbsp;</span>
    <el-date-picker v-model="mainEnd"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :placeholder="endholder"
                    :picker-options="{disabledDate:limitMinDate}">
    </el-date-picker>
  </Field>
</template>

<script>
export default {
  name: 'Dates',
  data: () => ({
    startholder: '\uE608 起始日期',
    endholder: '\uE608 结束日期'
  }),
  inject: ['dates'],
  props: {
    title: {
      type: String,
      default: ''
    },
    start: {
      default: '',
      required: true
    },
    end: {
      default: '',
      required: true
    }
  },
  methods: {
    limitMaxDate (time) {
      return time.getTime() > Date.parse(this.mainEnd)
    },
    limitMinDate (time) {
      const timestamp = time.getTime()
      if (this.mainStart == this.$format(timestamp, 'YYYY-MM-DD')) {
        return false
      }
      return time.getTime() < Date.parse(this.mainStart)
    },
    defaultTime () {
      if ('default' in this.$attrs) {
        if (!this.start) {
          this.mainStart = this.$format(
            Date.now() - 3600 * 1000 * 24 * 7,
            'YYYY-MM-DD'
          )
        }
        if (!this.end) {
          this.mainEnd = this.$format(Date.now(), 'YYYY-MM-DD')
        }
      }
    }
    // handleEndFocus () {
    //   if (this.mainEnd) {
    //     return false
    //   }
    //   if (this.mainStart) {
    //     let timestamp = Date.parse(this.mainStart) + 3600 * 1000 * 24 * 7
    //     this.mainEnd = this.$format(timestamp, 'YYYY-MM-DD')
    //   }
    // }
  },
  computed: {
    mainStart: {
      get () {
        return this.start
      },
      set (val) {
        if (val) {
          val += ' 00:00:00'
        }
        this.$emit('update:start', val)
      }
    },
    mainEnd: {
      get () {
        return this.end
      },
      set (val) {
        if (val) {
          val += ' 23:59:59'
        }
        this.$emit('update:end', val)
      }
    }
  },
  created () {
    this.dates.push(this)
    this.defaultTime()
  }
}
</script>

<style>
.field-dates input::placeholder {
  font-family: element-icons;
}
</style>
