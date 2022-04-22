<template>
  <div class="xtx-carousel" @mouseenter="stop" @mouseleave="start">
    <!-- 轮播图图片容器 -->
    <ul class="carousel-body">
      <li class="carousel-item" v-for="(item, i) in sliders" :key="i" :class="{ fade: index === i }">
        <!-- 图片 -->
        <RouterLink v-if="item.imgUrl" :to="item.hrefUrl">
          <img :src="item.imgUrl" alt="" />
        </RouterLink>
        <!-- 商品列表 -->
        <div v-else class="slider">
          <RouterLink v-for="good in item" :key="good.id" :to="`/product/${good.id}`">
            <img :src="good.picture" alt="" />
            <p class="name ellipsis">{{ good.name }}</p>
            <p class="price">&yen;{{ good.price }}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
    <!-- 上一张 -->
    <a href="javascript:;" class="carousel-btn prev" @click="toggle(-1)"><i class="iconfont icon-angle-left"></i></a>
    <!-- 下一张 -->
    <a href="javascript:;" class="carousel-btn next" @click="toggle(1)"><i class="iconfont icon-angle-right"></i></a>
    <!-- 指示器 -->
    <div class="carousel-indicator">
      <span v-for="(item, i) in sliders" :key="i" :class="{ active: index === i }" @click="index = i"></span>
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    sliders: {
      type: Array,
      default: () => []
    },
    autoPlay: {
      type: Number,
      default: 0
    }
  },
  setup (props) {
    // 控制当前展示图片的索引
    const index = ref(0)
    // 1. 自动轮播的逻辑
    let timer = null
    const autoPlayFn = () => {
      clearInterval(timer)
      timer = setInterval(() => {
        index.value++
        if (index.value >= props.sliders.length) {
          index.value = 0
        }
      }, props.autoPlay)
    }
    // 监听sliders数据变化,并根据autoPlay属性判断是否轮播
    watch(
      () => props.sliders,
      () => {
        if (props.sliders && props.autoPlay) {
          autoPlayFn()
        }
      },
      { immediate: true }
    )
    // 2.鼠标进入暂停,离开启动
    const stop = () => {
      if (timer) clearInterval(timer)
    }
    const start = () => {
      if (props.sliders.length && props.autoPlay) {
        autoPlayFn()
      }
    }
    // 3. 左右按钮切换
    const toggle = step => {
      index.value += step
      // 大于范围时
      if (index.value >= props.sliders.length) {
        index.value = 0
        return
      }
      // 小于范围时
      if (index.value < 0) {
        index.value = props.sliders.length - 1
      }
      // 4.组件卸载时
    }
    onUnmounted(() => {
      clearInterval(timer)
    })
    return { index, stop, start, toggle }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
// 轮播商品
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
  > a {
    width: 240px;
    text-align: center;
    img {
      padding: 20px;
      width: 230px !important;
      height: 230px !important;
    }
    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }
    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}
</style>
