<template>
  <div class="goods-image">
    <!-- 大图 -->
    <div v-show="show" class="large" :style="[{ backgroundImage: `url(${images[currIndex]})` },largePosition]"></div>
    <!-- 中图 -->
    <div class="middle" ref="target" >
      <img :src="images[currIndex]" alt="" />
      <div v-show="show" class="layer" :style="layerPosition"></div>
    </div>
    <!-- 小图 -->
    <ul class="small">
      <li v-for="(img, i) in images" :key="img" :class="{ active: i === currIndex }">
        <img @mouseenter="currIndex = i" :src="img" alt="" />
      </li>
    </ul>
  </div>
</template>
<script>
import { reactive, ref, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    const currIndex = ref(0)
    // 是否显示遮罩层
    const show = ref(false)
    // 遮罩层坐标
    const layerPosition = reactive({
      left: 0,
      top: 0
    })
    // 大图背景定位坐标
    const largePosition = reactive({
      backgroundPositionX: 0,
      backgroundPositiony: 0
    })
    const target = ref(null)
    const { elementX, elementY, isOutside } = useMouseInElement(target)
    watch([elementX, elementY, isOutside], () => {
      show.value = !isOutside.value
      // 遮罩层相对盒子的坐标
      let layerPositionX = elementX.value - 100
      let layerPositionY = elementY.value - 100
      // 给遮罩层坐标一个范围
      if (layerPositionX < 0) layerPositionX = 0
      else if (layerPositionX > 200) layerPositionX = 200
      if (layerPositionY < 0)layerPositionY = 0
      else if (layerPositionY > 200) layerPositionY = 200
      // 用坐标给定位赋值 +'px'
      layerPosition.left = layerPositionX + 'px'
      layerPosition.top = layerPositionY + 'px'
      // 大图根据和遮罩层的长宽比例取反
      largePosition.backgroundPositionX = -2 * layerPositionX + 'px'
      largePosition.backgroundPositionY = -2 * layerPositionY + 'px'
    })

    return { currIndex, show, layerPosition, largePosition, target }
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
