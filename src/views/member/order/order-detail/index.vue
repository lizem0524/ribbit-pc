<template>
  <div class="order-detail-page" v-if="order">
    <!-- 操作栏 -->
    <DetailAction :order="order" />
    <!-- 步骤条 组件xtx-steps.vue-->
    <DetailStep :order="order" />
    <!-- 物流栏 -->
    <Suspense>
      <DetailLogistics v-if="[3, 4, 5].includes(order.orderState)" :order="order" />
      <template #fallback>
        <div class="loading">加载中...</div>
      </template>
    </Suspense>
    <!-- 订单商品信息 -->
    <DetailInfo :order="order"/>
  </div>
</template>
<script>
import DetailAction from './components/detail-action'
import DetailStep from './components/detail-step'
import DetailLogistics from './components/detail-logistics'
import DetailInfo from './components/detail-info'
import { getOrderDetail } from '@/api/order'
import { provide, ref } from 'vue'
import { useRoute } from 'vue-router'
export default {
  name: 'OrderDetailPage',
  components: { DetailAction, DetailStep, DetailLogistics, DetailInfo },
  setup () {
    const order = ref(null)
    const route = useRoute()
    // 详情页拉数据
    const getOrderDetailList = () => {
      getOrderDetail(route.params.id).then(data => {
        order.value = data.result
        console.log('加载')
      })
    }
    provide('getOrderDetailList', getOrderDetailList)
    getOrderDetailList()
    return { order, getOrderDetailList }
  }
}
</script>
<style scoped lang="less">
.order-detail-page {
  background: #fff;
  width: 100%;
  height: 100%;
}
.loading {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  color: #999;
}
</style>
