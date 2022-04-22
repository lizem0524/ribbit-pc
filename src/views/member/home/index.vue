<template>
  <div class="member-home">
    <!-- 顶层概览 -->
    <HomeOverview />
    <!-- 我的收藏 -->
    <HomePanel title="我的收藏">
      <GoodsItem v-for="item in collectGoods" :key="item.id" :goods="item"/>
    </HomePanel>
    <!-- 我的足迹 -->
    <HomePanel title="我的足迹">
      <GoodsItem v-for="item in browseHistory" :key="item.id" :goods="item" />
    </HomePanel>
    <!-- 猜你喜欢 -->
    <GoodsRelevant />
  </div>
</template>
<script>
import HomeOverview from './components/home-overview'
import HomePanel from './components/home-panel'
import GoodsRelevant from '@/views/goods/components/goods-relevant'
import GoodsItem from '@/views/category/TopCategory/goods-item'
import { getCollect, getBrowseHistory } from '@/api/member'
import { ref } from 'vue'
export default {
  name: 'MemberHome',
  components: { HomeOverview, HomePanel, GoodsRelevant, GoodsItem },
  setup () {
    // 我的收藏
    const collectGoods = ref([])
    getCollect({ page: 1, pageSize: 4 }).then(data => {
      collectGoods.value = data.result.items
    })
    // 我的足迹
    const browseHistory = ref(null)
    getBrowseHistory({ page: 1, pageSize: 4 }).then(data => {
      browseHistory.value = data.result.items
    })
    return { collectGoods, browseHistory }
  }
}
</script>
<style scoped lang="less">
.member-home {
  :deep(.slider) {
    padding: 0 20px;
  }
  :deep(.prev) {
    left: 0 !important;
  }
  :deep(.next) {
    right: 0 !important;
  }
}
</style>
