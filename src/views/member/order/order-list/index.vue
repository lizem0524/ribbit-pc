<template>
  <div class="member-order" v-if="orderList">
    <XtxTabs v-model="activeName" @tab-click="changeTab">
      <XtxTabsPanel v-for="item in orderStatus" :key="item.name" :label="item.label" :name="item.name"> </XtxTabsPanel>
    </XtxTabs>
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem
      v-for="item in orderList"
      :key="item.id"
      :order="item"
      @on-cancel="orderCancel"
      @on-delete="orderDelete"
      @on-receipt="orderReceipt"
      @on-logistics="orderLogistics"
      />
    </div>

    <XtxPagination
    v-if="total"
    :total="total"
    v-model:currentPage="reqParams.page"
    :pageSize="reqParams.pageSize" />
    <OrderCancel ref="orderCancelCom" @cancel-success="cancelSuccess"/>
    <OrderLogistics ref="orderLogisticsCom"/>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import OrderItem from './components/order-item'
import OrderCancel from './components/order-cancel'
import { orderStatus } from '@/api/constants'
import { getOrder, deleteOrder, receiptOrder } from '@/api/order'
import Confirm from '@/components/Confirm'
import Message from '@/components/Message'
import OrderLogistics from './components/order-logistics'

export default {
  name: 'MemberOrder',
  components: { OrderItem, OrderCancel, OrderLogistics },
  setup () {
    const activeName = ref('all')
    const orderList = ref([]) // 订单列表
    const loading = ref(false)
    const total = ref(null)
    const reqParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    // 获取订单列表
    const getOrderList = async () => {
      loading.value = true
      const data = await getOrder(reqParams)
      total.value = data.result.counts
      orderList.value = data.result.items
      loading.value = false
    }
    // 点击导航切换
    const changeTab = tab => {
      reqParams.page = 1
      reqParams.orderState = tab.index
    }
    // 监听请求参数的变化发请求
    watch(
      reqParams,
      () => {
        getOrderList()
      },
      { immediate: true }
    )
    // 取消订单
    const orderCancelCom = ref(null)
    const orderCancel = (order) => {
      orderCancelCom.value.open(order)
    }
    const cancelSuccess = () => {
      getOrderList()
    }
    // 删除订单
    const orderDelete = async (order) => {
      try {
        await Confirm({ text: '确定删除订单吗？', title: '删除订单' })
        await deleteOrder(order.id)
        Message({ type: 'success', text: '删除成功' })
        getOrderList()
      } catch (e) {}
    }
    // 确认收货
    const orderReceipt = async (order) => {
      await Confirm({ text: '您确认收货吗？确认收货后钱款将打给商家', title: '确认收货' })
      await receiptOrder(order.id)
      Message({ type: 'success', text: '确认收货成功' })
      getOrderList()
    }
    // 查看物流
    const orderLogisticsCom = ref(null)
    const orderLogistics = (order) => {
      orderLogisticsCom.value.open(order)
    }
    return {
      activeName,
      changeTab,
      orderList,
      reqParams,
      orderStatus,
      loading,
      total,
      orderCancel,
      orderCancelCom,
      cancelSuccess,
      orderDelete,
      orderReceipt,
      orderLogistics,
      orderLogisticsCom
    }
  }
}
</script>

<style lang="less" scoped>
.member-order {
  height: 100%;
  background: #fff;
}
.order-list {
  background: #fff;
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../../assets/images/loading.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
