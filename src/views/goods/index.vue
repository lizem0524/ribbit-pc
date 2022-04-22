<template>
  <div class="xtx-goods-page">
    <div class="container" v-if="goods">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">>{{ goods.categories[1].name }}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{ goods.categories[0].name }}</XtxBreadItem>
        <XtxBreadItem>{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <!-- 图片+放大镜 -->
          <GoodsImage :images="goods.mainPictures" />
          <!-- 图片下销量信息 -->
          <GoodsSales />
        </div>
        <div class="spec">
          <!-- 商品名称价格 -->
          <GoodsName :goods="goods" />
          <GoodsSku  :goods="goods" @change="changeSku" />
          <XtxNumbox v-model="count" label="数量" :max="goods.inventory" />
          <XtxButton size="large" type="primary" style="margin-top: 20px" @click="addtCart">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs">
            <GoodsTabs />
          </div>
          <!-- 注意事项 -->
          <div class="goods-warn">
            <GoodsWarn />
          </div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot />
          <GoodsHot :type="2" />
        </div>
      </div>
    </div>
    <!-- 加载中 -->
    <div v-else class="loading container"></div>
  </div>
</template>

<script>
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image'
import GoodsSales from './components/goods-sales'
import GoodsName from './components/goods-name'
import GoodsSku from './components/goods-sku'
import GoodsTabs from './components/goods-tabs'
import GoodsHot from './components/goods-hot'
import GoodsWarn from './components/goods-warn'
import { getGoods } from '@/api/product'
import { provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Message from '@/components/Message'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsName, GoodsSku, GoodsTabs, GoodsHot, GoodsWarn },
  setup () {
    const goods = useGoods()
    provide('goods', goods)
    const count = ref(1)
    // 点击规格时，该组件的展示信息随之更新
    const changeSku = sku => {
      // 根据sku改变价格和库存
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      currSku.value = sku
    }
    // 加入购物车
    const store = useStore()
    const currSku = ref(null)
    const addtCart = async () => {
      if (currSku.value && currSku.value.skuId) {
        // 从sku中结构
        const { skuId, specsText: attrsText, inventory: stock } = currSku.value
        // 从goods中结构
        const { id, name, price, mainPictures } = goods.value
        // 添加购物车
        await store.dispatch('cart/addCart', {
          id: id,
          name,
          price,
          nowPrice: price,
          skuId,
          stock,
          attrsText,
          picture: mainPictures[0],
          count: count.value,
          selected: true,
          isEffective: true
        })
        Message({ type: 'success', text: '添加购物车成功' })
      } else {
        Message({ text: '请选择完整的规格' })
      }
    }
    return { goods, changeSku, count, addtCart }
  }
}
// 获取商品详情
const useGoods = () => {
  const goods = ref(null)
  const route = useRoute()
  watch(
    () => route.params.id,
    newVal => {
      goods.value = null // 销毁数据
      if (newVal && route.path === `/product/${newVal}`) {
        getGoods(route.params.id).then(data => {
          goods.value = data.result
          console.log(goods.value)
        })
      }
    },
    { immediate: true }
  )
  return goods
}
</script>

<style scoped lang="less">
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.loading {
  height: 600px;
  margin-top: 72px;
  background: #fff url('../../assets/images/loading.gif') no-repeat center;
}
</style>
