<template>
  <!-- 筛选区 -->
    <div class="sub-filter" v-if="filterData && !filterLoading">
      <div class="item">
        <div class="head">品牌：</div>
        <div class="body">
          <!-- <a href="javascript:;">全部</a> -->
          <a @click="changeBrand(prop.id)" :class="{ active: prop.id === filterData.brands.selectedBrand }" href="javascript:;" v-for="prop in filterData.brands" :key="prop.id">{{ prop.name }}</a>
        </div>
      </div>
      <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
        <div class="head">{{ item.name }}：</div>
        <div class="body">
          <!-- <a href="javascript:;">全部</a> -->
          <a @click="changeProp(item,prop.id)" :class="{ active: prop.id === item.selectedProp }" href="javascript:;" v-for="prop in item.properties" :key="prop.id" >{{ prop.name }}</a>
        </div>
      </div>
    </div>
    <div v-else class="sub-filter">
      <XtxSkeleton class="item" width="800px" height="40px" />
      <XtxSkeleton class="item" width="800px" height="40px" />
      <XtxSkeleton class="item" width="600px" height="40px" />
      <XtxSkeleton class="item" width="600px" height="40px" />
      <XtxSkeleton class="item" width="600px" height="40px" />
    </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()
    const filterData = ref(null)
    const filterLoading = ref(false)
    watch(
      () => route.params.id,
      newVal => {
        // 当有新值，且地址为二级类目才发请求
        if (newVal && route.path === `/category/sub/${route.params.id}`) {
          filterLoading.value = true // 开始加载
          getSubCategoryFilter(route.params.id).then(data => {
            // 品牌添加全部
            data.result.brands.selectedBrand = null
            data.result.brands.unshift({ id: null, name: '全部' })
            // 属性添加全部
            data.result.saleProperties.forEach(item => {
              item.selectedProp = null
              item.properties.unshift({ id: null, name: '全部' })
            })
            filterData.value = data.result
            filterLoading.value = false // 加载结束
          })
        }
      },
      { immediate: true }
    )
    // 获取筛选参数的函数
    const getFilterParams = () => {
      const obj = { brandId: null, attrs: [] }
      obj.brandId = filterData.value.brands.selectedBrand
      filterData.value.saleProperties.forEach(item => { // item { id:'2,name:'颜色',selectedProp:'123',properties:[{id:123,name:'黑色'}]}
        if (item.selectedProp) {
          const prop = item.properties.find(prop => item.selectedProp === prop.id) // 返回prop {id:123,name:'黑色'}
          obj.attrs.push({ groupName: item.name, propertyName: prop.name })
        }
      })
      if (obj.attrs.length === 0) obj.attrs = null
      return obj
    }
    // 记录当前选择的品牌
    const changeBrand = (brandId) => {
      if (filterData.value.brands.selectedBrand === brandId) return
      filterData.value.brands.selectedBrand = brandId
      emit('filter-change', getFilterParams())
    }
    // 记录选择的属性
    const changeProp = (item, propId) => {
      if (item.selectedProp === propId) return
      item.selectedProp = propId
      emit('filter-change', getFilterParams())
    }

    return { filterData, filterLoading, changeBrand, changeProp, getFilterParams }
  }
}
</script>
<style scoped lang="less">
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
  .xtx-skeleton {
    padding: 10px 0;
  }
}
</style>
