<template>
  <transition :name="transition"
              mode="in-out"
              appear
              :appear-active-class="enterClass"
              :enter-active-class="enterClass"
              :leave-active-class="leaveClass"
              @after-leave="afterLeave">
    <div class="modal animated is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">{{title||"操作提示"}}</p>
            <button class="delete"
                    @click="close" v-if="this.closable"></button>
          </header>
          <section class="modal-card-body">
            {{content}}
          </section>
          <footer class="modal-card-foot">
            <Button @click="close" v-if="this.closable">确认</Button>
          </footer>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BaseModal from '../BaseModal'

export default {
  name: 'Alert',
  mixins: [BaseModal],
  props: {
    title: String,
    content: String,
    closable: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    document.body.classList.add('is-clipped')
  },
  destroyed () {
    document.body.classList.remove('is-clipped')
  },
  methods: {
    close () {
      // if (this.closable) {
      this.$destroy()
      // }
    }
  }
}
</script>

<!--<style lang="less" src="./overlay.less"></style>-->
