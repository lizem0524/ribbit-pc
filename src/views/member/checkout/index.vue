<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem to="/cart">购物车</XtxBreadItem>
        <XtxBreadItem>填写订单</XtxBreadItem>
      </XtxBread>
      <div class="wrapper" v-if="order">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <CheckOutAddress @change="changeAddress" :addressList="order.userAddresses" />
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.goods" :key="item.skuId">
                <td>
                  <a href="javascript:;" class="info">
                    <img :src="item.picture" alt="" />
                    <div class="right">
                      <p>{{ item.name }}</p>
                      <p>{{ item.attrsText }}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{ item.price }}</td>
                <td>{{ item.count }}</td>
                <td>&yen;{{ item.totalPrice }}</td>
                <td>&yen;{{ item.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn" :class="{ active: reqParamsadd.deliveryTimeType === 1 }" @click="reqParamsadd.deliveryTimeType = 1" href="javascript:;">不限送货时间：周一至周日</a>
          <a class="my-btn" :class="{ active: reqParamsadd.deliveryTimeType === 2 }" @click="reqParamsadd.deliveryTimeType = 2" href="javascript:;">工作日送货：周一至周五</a>
          <a class="my-btn" :class="{ active: reqParamsadd.deliveryTimeType === 3 }" @click="reqParamsadd.deliveryTimeType = 3" href="javascript:;">双休日、假日送货：周六至周日</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn" :class="{ active: reqParamsadd.payType === 1 }" @click="reqParamsadd.payType = 1" href="javascript:;">在线支付</a>
          <a class="my-btn" :class="{ active: reqParamsadd.payType === 2 }" @click="reqParamsadd.payType = 2" href="javascript:;">货到付款</a>
          <span style="color: #999">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ order.summary.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥{{ order.summary.totalPrice }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>¥{{ order.summary.postFee }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">¥{{ order.summary.totalPayPrice }}</dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <XtxButton @click="submitOrderFn" type="primary">提交订单</XtxButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CheckOutAddress from './checkout-address'
import { createOrder, submitOrder, repurchaseOrder } from '@/api/checkout'
import { ref, provide, reactive } from 'vue'
import Message from '@/components/Message'
import { useRoute, useRouter } from 'vue-router'
export default {
  name: 'XtxPayCheckoutPage',
  components: { CheckOutAddress },
  setup () {
    // 页面数据
    const order = ref(null)
    const route = useRoute()
    // 判断是购物车提交还是订单再次购买
    const getOrder = async () => {
      let data = null
      if (route.query.orderId) {
        data = await repurchaseOrder(route.query.orderId)
      } else {
        data = await createOrder()
      }
      order.value = data.result
      reqParamsadd.goods = order.value.goods.map(({ skuId, count }) => ({ skuId, count }))
    }
    getOrder() // 初始化时拉取订单页面数据
    provide('getOrder', getOrder) // 给子组件使用

    // 结算提交订单信息
    const reqParamsadd = reactive({
      deliveryTimeType: 1,
      payType: 1,
      payChannel: 1,
      buyerMessage: '',
      // 商品信息，获取订单信息后设置
      goods: [],
      // 收货地址，切换收货地址或者组件默认的时候设置
      addressId: null
    })
    // 接收地址组件传来的当前收货地址
    const changeAddress = id => {
      reqParamsadd.addressId = id
    }
    // 提交订单
    const router = useRouter()
    const submitOrderFn = async () => {
      if (!reqParamsadd.addressId) return Message({ text: '请先添加收货地址' })
      const data = await submitOrder(reqParamsadd)
      Message({ type: 'success', text: '提交订单成功' })
      router.push(`/member/pay/?orderId=${data.result.id}`) // 带着订单id跳转
    }
    return {
      order,
      changeAddress,
      getOrder,
      reqParamsadd,
      submitOrderFn
    }
  }
}
</script>
<style scoped lang="less">
.xtx-pay-checkout-page {
  .wrapper {
    background: #fff;
    padding: 0 20px;
    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }
    .box-body {
      padding: 20px 0;
    }
  }
}
.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  .info {
    display: flex;
    text-align: left;
    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }
    .right {
      line-height: 24px;
      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }
  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }
    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;
      &:first-child {
        border-left: 1px solid #f5f5f5;
      }
      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}
.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;
  &.active,
  &:hover {
    border-color: @xtxColor;
  }
}
.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;
    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }
    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;
      &.price {
        font-size: 20px;
        color: @priceColor;
      }
    }
  }
}
.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}
</style>
