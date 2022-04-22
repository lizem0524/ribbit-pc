<template>
  <div class="xtx-cart-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem>首页</XtxBreadItem>
        <XtxBreadItem>购物车</XtxBreadItem>
      </XtxBread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120"><XtxCheckbox @change="checkAll" :modelValue="$store.getters['cart/isCheckAll']">全选</XtxCheckbox></th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <!-- 购物车无商品时展示的组件 -->
            <tr v-if="$store.getters['cart/validList'].length === 0">
              <td colspan="6">
                <CartNone />
              </td>
            </tr>
            <!-- 购物车商品 -->
            <tr v-else v-for="goods in $store.getters['cart/validList']" :key="goods.skuId">
              <td><XtxCheckbox @change="singleCheck(goods.skuId, $event)" :modelValue="goods.selected" /></td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${goods.id}`"><img :src="goods.picture" alt="" /></RouterLink>
                  <div>
                    <p class="name ellipsis">{{ goods.name }}</p>
                    <!-- 选择规格组件 -->
                    <CartSku :skuId="goods.skuId" :attrsText="goods.attrsText" @change="updateCartSku(goods.skuId,$event)"/>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ goods.nowPrice }}</p>
                <p v-if="goods.price - goods.nowPrice > 0">
                  比加入时降价 <span class="red">&yen;{{ goods.price - goods.nowPrice }}</span>
                </p>
              </td>
              <td class="tc">
                <XtxNumbox @change="updateCount(goods.skuId,$event)" :modelValue="goods.count" :max="goods.stock" />
              </td>
              <td class="tc">
                <p class="f16 red">&yen;{{ (goods.nowPrice * goods.count).toFixed(2) }}</p>
              </td>
              <!-- 有效商品右侧操作栏 -->
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p><a @click="deleteCart(goods.skuId)" class="green" href="javascript:;">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody v-if="$store.getters['cart/invalidList'].length">
            <tr>
              <td colspan="6"><h3 class="tit">失效商品</h3></td>
            </tr>
            <tr v-for="goods in $store.getters['cart/invalidList']" :key="goods.skuId">
              <td><XtxCheckbox style="color: #eee" /></td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${goods.id}`"><img :src="goods.picture" alt="" /></RouterLink>
                  <div>
                    <p class="name ellipsis">{{ goods.name }}</p>
                    <p class="attr">{{ goods.attrsText }}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ goods.nowPrice }}</p>
              </td>
              <td class="tc">{{ goods.count }}</td>
              <td class="tc">
                <p>&yen;{{ (goods.nowPrice * goods.count).toFixed(2) }}</p>
              </td>
              <!-- 无效商品右侧操作栏 -->
              <td class="tc">
                <p><a @click="deleteCart(goods.skuId)" class="green" href="javascript:;">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <XtxCheckbox @change="checkAll" :modelValue="$store.getters['cart/isCheckAll']">全选</XtxCheckbox>
          <a @click="batchDeleteCart()" href="javascript:;">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a @click="batchDeleteCart(true)" href="javascript:;">清空失效商品</a>
        </div>
        <div class="total">
          共 {{ $store.getters['cart/validTotal'] }} 件商品，已选择 {{ $store.getters['cart/selectedTotal'] }} 件，商品合计：
          <span class="red">¥{{ $store.getters['cart/selectedAmount'] }}</span>
          <XtxButton type="primary" @click="checkout">下单结算</XtxButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodRelevant />
    </div>
  </div>
</template>
<script>
import GoodRelevant from '@/views/goods/components/goods-relevant'
import CartNone from './components/cart-none'
import CartSku from './components/cart-sku'
import { useStore } from 'vuex'
import Message from '@/components/Message'
import Confirm from '@/components/Confirm'
import { onUnmounted } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
export default {
  name: 'XtxCartPage',
  components: { GoodRelevant, CartNone, CartSku },
  setup () {
    const store = useStore()
    // 单条选中状态修改
    // 复选框状态只根据传入的:modelValue显示,点击时会修改vuex中的值
    let timer = null
    const singleCheck = (skuId, selected) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        store.dispatch('cart/updateCart', { skuId, selected })
      }, 400)
    }
    // 全选状态修改
    let timer2 = null
    const checkAll = selected => {
      clearTimeout(timer2)
      timer2 = setTimeout(() => {
        store.dispatch('cart/checkAllCart', selected)
      }, 300)
    }
    // 右侧单条删除
    const deleteCart = skuId => {
      Confirm({ title: '删除商品', text: '是否删除该商品？' })
        .then(() => {
          store.dispatch('cart/deleteCart', skuId).then(() => {
            Message({ type: 'success', text: '删除成功' })
          })
        }).catch(e => {})
    }
    // 删除选中商品或清空无效
    const batchDeleteCart = (isClearInvalid) => {
      console.log(isClearInvalid)
      Confirm({ title: '删除商品', text: isClearInvalid ? '是否清空无效商品？' : '是否删除选中商品？' })
        .then(() => {
          store.dispatch('cart/batchDeleteCart', isClearInvalid).then(() => {
            Message({ type: 'success', text: '删除成功' })
          })
        }).catch(e => {})
    }
    // 修改数量
    const updateCount = (skuId, count) => {
      store.dispatch('cart/updateCart', { skuId, count })
    }
    // 修改购物车sku信息
    const updateCartSku = (oldSkuId, newSku) => {
      store.dispatch('cart/updateCartSku', { oldSkuId, newSku })
    }
    // 结算按钮
    const router = useRouter()
    const checkout = async () => {
      try {
        if (store.getters['cart/selectedList'].length === 0) return Message({ text: '至少选中一件商品' })
        if (!store.state.user.profile.token) {
          await Confirm({ text: '登录后才可结算,是否去登录？', title: '下单结算' })
        }
        router.push('/member/checkout')
      } catch (e) {}
    }
    // 页面销毁时清除定时器
    onUnmounted(() => {
      clearTimeout(timer)
      clearTimeout(timer2)
    })
    return { singleCheck, checkAll, deleteCart, batchDeleteCart, updateCount, updateCartSku, checkout }
  }

}
</script>
<style scoped lang="less">
.tc {
  text-align: center;
  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor;
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.xtx-cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
