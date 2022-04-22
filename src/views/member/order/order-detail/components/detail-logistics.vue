<template>
  <div class="detail-logistics">
    <p>
      <span>{{logistics.list[0].time}}</span>
      <span>{{logistics.list[0].text}}</span>
    </p>
    <a href="javascript:;" @click="orderLogisticsCom.open(order)">查看物流</a>
  </div>
  <Teleport to="body">
    <OrderLogistics ref="orderLogisticsCom"/>
  </Teleport>
</template>
<script>
import { logisticsOrder } from '@/api/order'
import OrderLogistics from '../../order-list/components/order-logistics'
import { ref } from 'vue'
export default {
  name: 'DetailLogistics',
  components: { OrderLogistics },
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  async setup (props) {
    const data = await logisticsOrder(props.order.id)
    const logistics = ref(data.result)
    const orderLogisticsCom = ref(null)
    return { logistics, orderLogisticsCom }
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
