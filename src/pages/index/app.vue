
<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer
            mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <div class="mdl-layout-spacer">
        </div>
        <div class="mdl-textfield--align-right">
          <label class="mdl-button mdl-js-button mdl-button--icon" @click="getApp">
            <i class="material-icons">get_app</i>
          </label>
          <label class="mdl-button mdl-js-button mdl-button--icon" @click="fullscreen">
            <i class="material-icons">settings_overscan</i>
          </label>
        </div>
      </div>
    </header>
    <div class="mdl-layout__drawer">
      <span class="mdl-layout-title">YGOP-ICS</span>
      <nav class="mdl-navigation">
        <ul id="slide-menu">
          <tree-item :item="item"
                     v-for="(item, index) in getTreeArr"
                     :key="index"
                     @triggle-click="load"></tree-item>
        </ul>
      </nav>
    </div>
    <main class="mdl-layout__content">
      <div class="page-content">
        <iframe class="iframe"
                title="iframe"
                frameborder="0"
                ref="iframe"></iframe>
      </div>
    </main>
  </div>
</template>

<script>
import 'assets/stylesheets/material-design-lite/material.css'
import 'material-design-lite/material.js'
// import Logs from "@logs/route.logs.json";
import Tree from '@logs/tree.logs.json'
import Item from './tree-item.vue'
import './tree.less'

if (Tree.hasOwnProperty('preview')) {
  delete Tree.preview
}
if (Tree.hasOwnProperty('index')) {
  delete Tree.index
}

export default {
  name: 'PREVIEW',
  components: {
    'tree-item': Item
  },
  data: () => ({
    // routes: Logs.routes,
    Tree
  }),
  computed: {
    getTreeArr () {
      return this.getArr(this.Tree)
    }
  },
  methods: {
    load (filename) {
      document.getElementsByTagName('iframe')[0].src = `${filename}`
    },
    getArr (tree) {
      return Object.keys(tree).map((key) => {
        const content = tree[key]
        const item = {
          name: key
        }
        if (content instanceof Object) {
          item.children = this.getArr(content)
        } else {
          item.link = content
        }
        return item
      })
    },
    launchFullscreen (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen()
      }
    },
    exitFullscreen () {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    },
    fullscreen () {
      const fullscreenElement =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement
      if (fullscreenElement) {
        this.exitFullscreen()
      } else {
        const html = document.querySelector('html')
        this.launchFullscreen(html)
      }
    },
    getApp () {
      const src = document.getElementsByTagName('iframe')[0].src
      if (src) {
        // location.href = src;
        window.open(src, '_blank')
      }
    }
  }
}
</script>

<style>
.mdl-layout--fixed-drawer > .mdl-layout__content {
  height: 100%;
}
.page-content {
  height: 100%;
}
iframe {
  height: 100%;
  width: 100%;
  min-height: 100%;
}
</style>
