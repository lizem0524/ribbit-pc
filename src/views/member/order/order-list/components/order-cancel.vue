<template>
  <XtxDialog title="取消订单" :visible="visible" @close="visible=false">
    <!-- 组件内容 -->
    <div class="cancel-info">
        <p>取消订单后，本单享有的优惠可能会一并取消，是否继续？</p>
        <p class="tip">请选择取消订单的原因（必选）：</p>
        <div class="btn">
          <a
            v-for="item in cancelReason"
            :key="item"
            href="javascript:;"
            :class="{ active: curText === item }"
            @click="curText = item"
          >
            {{ item }}
          </a>
        </div>
    </div>
    <!-- 按钮操作 -->
    <template #footer>
      <XtxButton type="gray" @click="visible=false" style="margin-right:20px">取消</XtxButton>
      <XtxButton type="primary" @click="submit">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { cancelReason } from '@/api/constants'
import { cancelOrder } from '@/api/order'
import Message from '@/components/Message'
import { ref } from 'vue'
export default {
  name: 'OrderCancel',
  setup (props, { emit }) {
    const curText = ref('') // 选中文字
    const visible = ref(false)
    const currOrder = ref(null) // 弹层弹出时要取消的订单
    // 弹层打开
    const open = (order) => {
      currOrder.value = order
      visible.value = true
    }
    // 确认取消
    const submit = async () => {
      if (!curText.value) return Message({ text: '请选择取消原因' })
      await cancelOrder({ orderId: currOrder.value.id, cancelReason: curText.value })
      Message({ type: 'success', text: '取消订单成功' })
      emit('cancel-success')
      visible.value = false
    }
    return { cancelReason, curText, visible, open, submit }
  }
}
</script>
<style scoped lang="less">
 .xtx-dialog ::v-deep .wrapper {
  width: 620px;
}
.cancel-info {
  p {
    font-size: 16px;
    line-height: 35px;
    &.tip {
      color: #999;
    }
  }
  .btn {
    padding-top: 21px;
    display: flex;
    flex-wrap: wrap;
    a {
      width: 256px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: #ffffff;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 20px;
      color: #666;
      &:nth-child(2n){
        margin-right: 0;
      }
      &:hover,&.active {
        background-color: #e3f9f4;
        border-color: @xtxColor;
      }
    }
  }
}
</style>
