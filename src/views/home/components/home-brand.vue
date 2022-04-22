<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <!-- 右上角切换按钮 -->
    <template #right>
      <a @click="index = 0" :class="{ disabled: index === 0 }" href="javascript:;" class="iconfont icon-angle-left prev"></a>
      <a @click="index = 1" :class="{ disabled: index === 1 }" href="javascript:;" class="iconfont icon-angle-right next"></a>
    </template>
    <!-- 图片面板 -->
    <div class="box" ref="target">
      <Transition name="fade">
        <ul v-if="brands.length" class="list" :style="{ transform: `translateX(${-index * 1240}px)` }">
          <li v-for="item in brands" :key="item.id">
            <RouterLink to="/">
              <img :src="item.picture" alt="" />
            </RouterLink>
          </li>
        </ul>
         <div class="skeleton" v-else> <!-- 骨架 -->
          <XtxSkeleton class="item" v-for="i in 5" :key="i" animated bg="#e4e4e4" width="240px" height="305px" />
        </div>
      </Transition>
    </div>
  </HomePanel>
</template>

<script>
import { ref } from 'vue'
import HomePanel from './library/home-panel'
import { getBrand } from '@/api/home'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeBrand',
  components: { HomePanel },
  setup () {
    // 获取数据
    // const brands = ref([])
    // getBrand(10).then(data => {
    //   brands.value = data.result
    // })
    const { target, result } = useLazyData(() => getBrand(10))
    // 切换
    const index = ref(0)

    return { brands: result, target, index }
  }
}
</script>

<style scoped lang="less">
.skeleton {
  width: 100%;
  display: flex;
  .item {
    margin-right: 10px;
    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 0.5s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      .hoverShadow();
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
</style>
