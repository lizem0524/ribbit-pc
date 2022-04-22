<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle" :class="{ active: show }">
      <span class="value" v-if="fullLocation">{{ fullLocation }}</span>
      <span class="placeholder" v-else>{{placeholder}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="show">
      <div class="loading" v-if="loading"></div>
      <template v-else>
        <span class="ellipsis" @click="selectItem(item)" v-for="item in currList" :key="item.code">{{ item.name }}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择配送地址'
    }
  },
  setup (props, { emit }) {
    const show = ref(false)
    const allCityData = ref([]) // 总城市数据
    const currList = ref([]) // 当前展示的数据
    const loading = ref(false)
    // 传给父组件的收货地址数据
    const shippingAddress = reactive({
      provinceCode: '', // 省
      provinceName: '',
      cityCode: '', // 市
      cityName: '',
      countyCode: '', // 区/县
      countyName: '',
      fullLocation: ''// 完整地址
    })
    // 打开配送弹层
    const open = async () => {
      show.value = true
      loading.value = true
      allCityData.value = await getCityData()
      currList.value = allCityData.value
      loading.value = false
    }
    // 关闭配送弹层
    const close = () => {
      show.value = false
    }
    // 切换打开和关闭
    const toggle = () => {
      show.value ? close() : open()
    }
    // 点击组件外
    const target = ref(null)
    onClickOutside(target, () => {
      close()
    })
    // 点击列表事件
    const selectItem = item => {
      // 省/直辖
      if (item.level === 0) {
        shippingAddress.provinceCode = item.code
        shippingAddress.provinceName = item.name
        currList.value = currList.value.find(p => p.code === shippingAddress.provinceCode).areaList // 展示列表变为市级
      }
      // 市
      if (item.level === 1) {
        shippingAddress.cityCode = item.code
        shippingAddress.cityName = item.name
        currList.value = currList.value.find(c => c.code === shippingAddress.cityCode).areaList // 展示列表变区/县
      }
      // 区/县
      if (item.level === 2) {
        shippingAddress.countyCode = item.code
        shippingAddress.countyName = item.name
        shippingAddress.fullLocation = `${shippingAddress.provinceName} ${shippingAddress.cityName} ${shippingAddress.countyName}`
        close()
        emit('change', shippingAddress)
      }
    }

    return { show, toggle, target, loading, currList, shippingAddress, selectItem }
  }
}

// 获取一次城市数据，缓存
const getCityData = async () => {
  if (!window.cityData) {
    const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
    const { data } = await axios.get(url)
    window.cityData = data
  }
  return window.cityData
}
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
