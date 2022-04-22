<template>
  <div class="cart-sku" ref="target">
    <!-- sku文字 -->
    <div class="attrs" @click="toggle()">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <!-- sku弹层 -->
    <div class="layer" v-if="visible">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <GoodsSku :skuId="skuId" :goods="goods" @change="changeSku"/>
        <XtxButton type="primary" size="mini" style="margin-left: 60px" @click="submit">确认</XtxButton>
      </template>
    </div>
  </div>
</template>
<script>
import { reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { getGoodsSku } from '@/api/cart'
import GoodsSku from '@/views/goods/components/goods-sku'
import Message from '@/components/Message'
export default {
  name: 'CartSku',
  components: { GoodsSku },
  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const visible = ref(false)
    const goods = ref(null)
    const loading = ref(true)
    let currSku = reactive({}) // 当前选中的sku信息
    // 切换弹层的打开关闭
    const open = () => {
      visible.value = true
      loading.value = true
      currSku.skuId = props.skuId
      getGoodsSku(props.skuId).then(data => {
        goods.value = data.result
        loading.value = false
      })
    }
    const close = () => {
      visible.value = false
    }
    const toggle = () => {
      visible.value ? close() : open()
    }
    const target = ref(null)
    onClickOutside(target, () => {
      close()
    })
    // 记录sku信息
    const changeSku = sku => {
      currSku = sku
    }
    // 确认修改sku信息
    const submit = () => {
      if (props.skuId === currSku.skuId) {
        close()
        return
      }
      if (currSku && currSku.skuId && props.skuId !== currSku.skuId) {
        emit('change', currSku)
        close()
      } else {
        Message({ text: '请选择完整的规格' })
      }
    }
    return { visible, toggle, target, goods, changeSku, currSku, loading, submit }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    cursor: pointer;
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: '';
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
