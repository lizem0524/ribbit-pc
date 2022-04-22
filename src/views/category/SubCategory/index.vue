<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 筛选 -->
      <SubFilter @filter-change="filterChange"/>
      <!-- 商品面板 -->
      <div class="goods-list">
        <!-- 排序组件 -->
        <SubSort @sort-change="sortChange"/>
        <!-- 商品列表 -->
        <ul>
          <li v-for="goods in goodsList" :key="goods.id">
            <GoodsItem :goods="goods" />
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <XtxInfiniteLoading :loading="loading" :finished="finished" @infinite="getData"/>
      </div>
    </div>
  </div>
</template>

<script>
import SubBread from './sub-bread'
import SubFilter from './sub-filter'
import SubSort from './sub-sort'
import GoodsItem from '../TopCategory/goods-item'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getSubCategoryGoods } from '@/api/category'
export default {
  name: 'SubCategory',
  components: { SubBread, SubFilter, SubSort, GoodsItem },
  setup () {
    // 加载中
    const loading = ref(false)
    // 全部加载完毕
    const finished = ref(false)
    const goodsList = ref([])
    // 请求参数
    const route = useRoute()
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    // 进入加载组件的可视区
    const getData = () => {
      reqParams.categoryId = route.params.id
      loading.value = true
      getSubCategoryGoods(reqParams).then(data => {
        if (data.result.items.length) {
          goodsList.value.push(...data.result.items) // 把新页数的数据追加到goodsList
          reqParams.page++ // 每次加载，页码加1
        } else {
          // 没有数据，全部加载完成
          finished.value = true
        }
        loading.value = false
      })
    }
    // 同路由规则切换，监听地址栏id
    watch(() => route.params.id, (newVal) => {
      if (newVal && route.path === `/category/sub/${newVal}`) {
        reqParams = {
          page: 1,
          pageSize: 20
        }
        finished.value = false
        goodsList.value = []
      }
    })
    // 排序改变，重新发起请求
    const sortChange = (sortParams) => {
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      finished.value = false
      goodsList.value = []
      getData(reqParams)
    }
    // 筛选改变，重新发起请求
    const filterChange = (filterParams) => {
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      finished.value = false
      goodsList.value = []
      getData(reqParams)
    }
    return { getData, loading, finished, goodsList, sortChange, filterChange }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
