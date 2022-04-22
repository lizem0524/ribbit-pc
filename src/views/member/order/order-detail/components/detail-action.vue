<template>
  <div class="detail-action" v-if="order">
    <div class="state">
      <span class="iconfont icon-order-unpay"></span>
      <p>{{ orderStatus[order.orderState].label }}</p>
    </div>
    <div class="info">
      <p>订单编号：{{ order.id }}</p>
      <p>下单时间：{{ order.createTime }}</p>
    </div>
    <div class="btn">
      <!-- 待付款 -->
      <template v-if="order.orderState === 1 && order.countdown > -1">
        <XtxButton @click="$router.push('/member/pay?orderId=' + order.id)" type="primary" size="small">立即付款</XtxButton>
        <XtxButton type="gray" size="small" @click="orderCancelCom.open(order)">取消订单</XtxButton>
      </template>
      <template v-if="order.orderState === 1 && order.countdown <= -1">
        <XtxButton type="gray" size="small">订单超时</XtxButton>
      </template>
      <!-- 待发货 -->
      <template v-if="order.orderState === 2">
        <XtxButton type="primary" size="small" @click="$router.push(`/member/checkout?orderId=${order.id}`)" >再次购买</XtxButton>
      </template>
      <!-- 待收货 -->
      <template v-if="order.orderState === 3" >
        <XtxButton type="primary" size="small" @click="orderReceipt">确认收货</XtxButton>
        <XtxButton type="plain" size="small" @click="$router.push(`/member/checkout?orderId=${order.id}`)" >再次购买</XtxButton>
      </template>
      <!-- 待评价 -->
      <template v-if="order.orderState === 4">
        <XtxButton type="primary" size="small" @click="$router.push(`/member/checkout?orderId=${order.id}`)">再次购买</XtxButton>
        <XtxButton type="plain" size="small">评价商品</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
      <!-- 已完成 -->
      <template v-if="order.orderState === 5">
        <XtxButton type="primary" size="small" @click="$router.push(`/member/checkout?orderId=${order.id}`)">再次购买</XtxButton>
        <XtxButton type="plain" size="small">查看评价</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
      <!-- 取消弹层 -->
      <Teleport to="body">
        <OrderCancel ref="orderCancelCom" @cancel-success="getOrderDetailList" />
      </Teleport>
    </div>
  </div>
</template>
<script>
import { orderStatus } from '@/api/constants'
import { receiptOrder } from '@/api/order'
import OrderCancel from '../../order-list/components/order-cancel'
import { inject, ref } from 'vue'
import Message from '@/components/Message'
import Confirm from '@/components/Confirm'
export default {
  name: 'OrderDetailAction',
  components: { OrderCancel },
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    const orderCancelCom = ref(null)
    const getOrderDetailList = inject('getOrderDetailList')
    // 确认收货
    const orderReceipt = async () => {
      try {
        await Confirm({ text: '您确认收货吗？确认收货后钱款将打给商家', title: '确认收货' })
        await receiptOrder(props.order.id)
        Message({ type: 'success', text: '确认收货成功' })
        getOrderDetailList()
      } catch (e) {}
    }
    return { orderStatus, orderCancelCom, orderReceipt, getOrderDetailList }
  }
}
</script>
<style scoped lang="less">
.detail-action {
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  .state {
    width: 220px;
    text-align: center;
    .iconfont {
      font-size: 40px;
      color: @xtxColor;
    }
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
  }
  .info {
    width: 240px;
    line-height: 30px;
    p {
      color: #999;
    }
  }
  .btn {
    flex: 1;
    text-align: right;
    margin-right: 100px;
    .xtx-button {
      margin-left: 20px;
    }
  }
}
</style>
