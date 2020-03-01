<template>
  <section id="layout-content" v-if="show">
    <div class="wrapper">
      <slot></slot>
    </div>
    <el-tooltip placement="top"
                content="返回顶部">
      <back-to-top transitionName="fade" :customStyle="backToTopStyle"></back-to-top>
    </el-tooltip>
  </section>
</template>

<script>
export default {
  name: 'AppLayout',
  data: () => ({
    show: true,
    backToTopStyle: {
      right: '15px',
      bottom: '15px',
      width: '40px',
      height: '40px',
      'border-radius': '4px',
      'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
      background: '#e7eaf1' // 按钮的背景颜色 The background color of the button
    }
  })
}
</script>
