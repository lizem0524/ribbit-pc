<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img :class="{ selected: val.selected, disabled: val.disabled }" @click="clickSpecs(val, item.values)" v-if="val.picture" :src="val.picture" :title="val.name" alt="" />
          <span :class="{ selected: val.selected, disabled: val.disabled }" @click="clickSpecs(val, item.values)" v-else>{{ val.name }}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerSet from '@/vender/power-set'
const spliter = '★'
const getPathMap = skus => {
  // 得到所有sku集合
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory > 0) {
      // 有库存的sku
      const valueArr = sku.specs.map(val => val.valueName) // ['棕色',39]
      const valueArrPowerSet = powerSet(valueArr) // [[],['棕色'],['39'],['棕色', '39']]
      valueArrPowerSet.forEach(arr => {
        const key = arr.join(spliter) // 数组转为字符串['棕色']=>'棕色'    ['棕色', '39'] => 棕色★41
        if (!pathMap[key]) {
          pathMap[key] = [sku.id]
        } else {
          pathMap[key].push(sku.id)
        }
      })
    }
  })
  return pathMap
}
// 获取当前选中的按钮的数组
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => { // 遍历每行
    const selectedVal = item.values.find(val => val.selected) // 遍历每行按钮，拿选中的按钮数据，
    arr.push(selectedVal ? selectedVal.name : undefined) // 有选中的就把名字添加到arr,空的就添加undefined
  })
  return arr // ['棕色',undefined]
}

// 更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  // 每一个按钮的disabled状态来决定
  specs.forEach((item, i) => {
    const SelectedValues = getSelectedValues(specs)
    item.values.forEach(val => {
      // 选中的按钮的行不应做判断，但此处只能做到当前按钮
      if (val.selected) return
      // 拿到未选中按钮的值，根据规格行数，按顺序存入到SelectedValues中
      SelectedValues[i] = val.name // i=0 ['棕色',undefined] i=1 ['棕色','73cm']
      // 去掉undefined，数组拼接字符串
      const key = SelectedValues.filter(value => value).join(spliter) // '米色★73cm'
      // 字典中查找，确定按钮的禁用状态
      val.disabled = !pathMap[key]
    })
  })
}

// 默认选中
const initDefaultSelected = (goods, skuId) => {
  const sku = goods.skus.find(sku => sku.id === skuId) // 根据id从skus中拿到sku
  goods.specs.forEach(item => {
    // 找到sku.specs中与和item同一规格中的选中按钮名
    const valueName = sku.specs.find(spec => spec.name === item.name).valueName
    // 在item.values中找到该按钮名，添加选中属性
    const val = item.values.find(val => val.name === valueName)
    val.selected = true
  })
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      tyle: Object,
      default: () => ({})
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)
    // 根据传入的skuId自动选中按钮
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }
    // 初始化时判断按钮是否禁用
    updateDisabledStatus(props.goods.specs, pathMap)
    // 点击按钮时
    const clickSpecs = (val, values) => {
      if (val.disabled) return
      // 样式排他
      if (!val.selected) {
        values.forEach(item => {
          item.selected = false
        })
      }
      // 样式选中
      val.selected = !val.selected
      updateDisabledStatus(props.goods.specs, pathMap)
      // 通知父组件
      // 已选中按钮的数组(无undefined)
      const validSelectedValues = getSelectedValues(props.goods.specs).filter(v => v)
      if (validSelectedValues.length === props.goods.specs.length) {
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        // 提交给父组件
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name} : ${c.valueName}`, '').trim()
        })
      } else {
        emit('change', {}) // 传空为了父组件判断规格是否选择完整，不完整不能购买
      }
    }

    return { clickSpecs, pathMap }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
