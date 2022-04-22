<template>
<!-- 顶部通栏 -->
<AppNavbar />
<!-- 头部组件 -->
<AppHeader />
<!-- 吸顶头部 -->
<AppHeaderSticky />
<!-- 内容容器 -->
<div class="app-body">
  <!-- 二级路由 -->
  <RouterView />
</div>
<!-- 底部组件 -->
<AppFooter />
</template>

<script>
import AppNavbar from './components/app-navbar.vue'
import AppHeader from './components/app-header.vue'
import AppFooter from './components/app-footer.vue'
import AppHeaderSticky from './components/app-header-sticky'
import { useStore } from 'vuex'
export default {
  name: 'Layout',
  components: {
    AppNavbar,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  setup () {
    const store = useStore()
    // 请求分类数据列表
    store.dispatch('category/getCategory')
  }
}
</script>

<style scoped lang="less">
.app-body {
  min-height: 600px;
}
</style>
