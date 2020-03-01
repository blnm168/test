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
                    @click="reject"></button>
          </header>
          <section class="modal-card-body">
            {{content}}
          </section>
          <footer class="modal-card-foot">
            <Button @click="resolve">确认</Button>
            <Button theme="default"
                    @click="reject">取消</Button>
          </footer>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BaseModal from '../BaseModal'

export default {
  name: 'Confirm',
  mixins: [BaseModal],
  props: {
    title: String,
    content: String
  },
  methods: {
    resolve () {
      this.$emit('resolve')
    },
    reject () {
      this.$emit('reject')
    }
  }
}
</script>

<!--<style lang="less" src="./overlay.less"></style>-->
