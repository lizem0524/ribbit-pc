<template>
  <div class="home-category" @mouseleave="categoryId = null">
    <!-- 左侧分类 -->
    <ul class="menu">
      <!-- 一级分类 -->
      <li :class="{ active: categoryId && categoryId === item.id }" v-for="item in menuList" :key="item.id" @mouseenter="categoryId = item.id">
        <RouterLink :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
        <!-- 二级分类 -->
        <template v-if="item.children">
          <RouterLink v-for="sub in item.children" :key="sub.id" :to="`/category/sub/${sub.id}`">
            {{ sub.name }}
          </RouterLink>
        </template>
        <template v-else>
          <XtxSkeleton :width="'60px'" :height="'22px'" bg="rgba(255,255,255,0.2)" animated style="margin-right:5px"/>
          <XtxSkeleton :width="'60px'" :height="'22px'" bg="rgba(255,255,255,0.2)" animated style="margin-right:5px"/>
        </template>
      </li>
    </ul>
    <!-- 弹层 -->
    <div class="layer">
      <h4>{{ categoryId == 'brand' ? '品牌推荐' : '分类推荐' }} <small>根据您的购买或浏览记录推荐</small></h4>
      <!-- 分类弹层 -->
      <ul v-if="currCategory && currCategory.goods">
        <li v-for="item in currCategory.goods" :key="item.id">
          <RouterLink :to="`/product/${item.id}`">
            <img :src="item.picture" alt="" />
            <div class="info">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="desc ellipsis">{{ item.desc }}</p>
              <p class="price"><i>¥</i>{{ item.price }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>

      <!-- 品牌弹层 -->
      <ul v-if="currCategory && currCategory.brands">
        <li class="brand" v-for="item in brand.brands" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="" />
            <div class="info">
              <p class="place"><i class="iconfont icon-dingwei"></i>{{ item.place }}</p>
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="desc ellipsis-2">{{ item.desc }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { getBrand } from '@/api/home'
export default {
  name: 'HomeCategory',
  setup () {
    const store = useStore()
    // 自定义一个品牌分类
    const brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [{ id: 'brand-children', name: '品牌推荐' }],
      brands: []
    })
    const menuList = computed(() => {
      // 从vuex中拿分类，截取前2个二级分类，追加一个品牌分类，返回一个新分类列表
      const list = store.state.category.list.map(item => {
        return {
          id: item.id,
          name: item.name,
          children: item.children && item.children.slice(0, 2),
          goods: item.goods
        }
      })
      list.push(brand)
      return list
    })

    // 得到左侧分类的弹窗数据
    // 双向绑定一个当前选中分类的id
    const categoryId = ref(null)
    // 通过categoryId找出当前分类
    const currCategory = computed(() => {
      return menuList.value.find(item => item.id === categoryId.value)
    })
    // 请求品牌数据
    getBrand().then(data => {
      brand.brands = data.result
    })
    return { menuList, categoryId, currCategory, brand }
  }
}
</script>
<style scoped lang="less">
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover,
      &.active {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
  // 弹层样式
  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        &:nth-child(3n) {
          margin-right: 0;
        }
        &.brand {
          height: 180px;
          a {
            align-items: flex-start;
            img {
              width: 120px;
              height: 160px;
            }
            .info {
              p {
                margin-top: 8px;
              }
              .place {
                color: #999;
              }
            }
          }
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
            width: 95px;
            height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
    }
  }
}
.xtx-skeleton {
  animation: fade 1s linear infinite alternate;
}
@keyframes fade {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}
</style>
