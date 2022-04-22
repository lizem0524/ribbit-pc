<template>
  <div class="home-new">
    <!-- 面板模板 -->
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <!-- 右上角插槽 -->
      <template #right>
        <XtxMore path="/" />
      </template>
      <!-- 面板内容插槽 -->
      <Transition name="fade" ref="target">
        <ul v-if="goods.length" class="goods-list" >
          <li v-for="item in goods" :key="item.id">
            <RouterLink :to="`/product/${item.id}`">
              <img :src="item.picture" alt="" />
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="price">&yen;{{ item.price }}</p>
            </RouterLink>
          </li>
        </ul>
        <HomeSkeleton bottom-bg="#f0f9f4" v-else />
      </Transition>
    </HomePanel>
  </div>
</template>
<script>
// import { ref } from 'vue'
import HomePanel from './library/home-panel'
import { getNew } from '@/api/home'
import HomeSkeleton from './library/home-skeleton'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeNew',
  components: { HomePanel, HomeSkeleton },
  setup () {
    // const goods = ref([])
    // getNew().then(data => {
    // goods.value = data.result
    // })
    // 传入监听的dom和获取数据的函数
    const { target, result } = useLazyData(getNew)
    return { goods: result, target }
  }
}
</script>
<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
