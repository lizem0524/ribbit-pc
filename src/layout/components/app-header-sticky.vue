<template>
  <div class="app-header-sticky" :class="{ show: y>=100 }" >
    <div class="container" v-show="y>=100">
      <RouterLink class="logo" to="/" />
      <AppHeaderNav />
      <div class="right">
        <RouterLink to="/">品牌</RouterLink>
        <RouterLink to="/">专题</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeaderNav from './library/app-header-nav'
import { useWindowScroll } from '@vueuse/core'
// import { ref } from 'vue'
export default {
  name: 'AppHeaderSticky',
  components: { AppHeaderNav },
  setup () {
    /*     // 是否显示吸顶导航
    const isShow = ref(false)
    window.addEventListener('scroll', () => {
      isShow.value = document.documentElement.scrollTop >= 100
    }) */
    // y为页面滚动距离
    const { y } = useWindowScroll()

    return { y }
  }
}
</script>

<style scoped lang="less">
.app-header-sticky {
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;
  transform: translateY(-100%);
  opacity: 0;

  &.show {
    transition: all 0.3s linear;
    opacity: 1;
    transform: none;
  }
  .container {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 200px;
    height: 80px;
    background: url(../../assets/images/logo.png) no-repeat right 2px;
    background-size: 160px auto;
  }
  .right {
    width: 220px;
    display: flex;
    text-align: center;
    padding-left: 40px;
    border-left: 2px solid @xtxColor;
    a {
      width: 38px;
      margin-right: 40px;
      font-size: 16px;
      line-height: 1;
      &:hover {
        color: @xtxColor;
      }
    }
  }
}
</style>
