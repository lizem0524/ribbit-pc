<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <Transition name="fade-right" mode="out-in">
          <XtxBreadItem :key="topCategory.id">{{ topCategory.name }}</XtxBreadItem>
        </Transition>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :sliders="sliders" style="height: 500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="sub in topCategory.children" :key="sub.id">
            <a href="javascript:;">
              <img :src="sub.picture" />
              <p>{{ sub.name }}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 不同分类商品 -->
      <div class="ref-goods" v-for="sub in subList" :key="sub.id">
        <div class="head">
          <h3>{{ sub.name }}</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <XtxMore :to="`/category/sub/${sub.id}`" />
        </div>
        <div class="body">
          <GoodsItem v-for="goods in sub.goods" :key="goods.id" :goods="goods" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getBanner } from '@/api/home'
import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import GoodsItem from './goods-item'
import { getTopCategory } from '@/api/category'
export default {
  name: 'TopCategory',
  components: { GoodsItem },
  setup () {
    // 轮播图
    const sliders = ref([])
    getBanner().then(data => {
      sliders.value = data.result
    })
    // 面包屑+子分类
    const store = useStore()
    const route = useRoute()
    const topCategory = computed(
      () => store.state.category.list.find(item => item.id === route.params.id) || {} // 该页面对应id的顶级分类对象
    )
    // 获取各个子类目下推荐商品
    const subList = ref([])
    const getSubList = () => {
      // 获取数据的方法
      getTopCategory(route.params.id).then(data => {
        subList.value = data.result.children
      })
    }
    watch(
      () => route.params.id,
      newVal => {
        newVal && route.path === `/category/${newVal}` && getSubList() // 地址栏id变化时，发送请求(同一规则下切换路由不会自动调数据)
      },
      { immediate: true }
    )

    return {
      sliders,
      topCategory,
      subList
    }
  }
}
</script>
<style scoped lang="less">

.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
.ref-goods {
  background-color: #fff;
  margin-top: 20px;
  position: relative;
  .head {
    .xtx-more {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .tag {
      text-align: center;
      color: #999;
      font-size: 20px;
      position: relative;
      top: -20px;
    }
  }
  .body {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 65px 30px;
  }
}
</style>
