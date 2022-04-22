<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  render () {
    // 拿到子节点的数组
    const items = this.$slots.default()
    // 创建新的子节点的空数组
    const dymanicItems = []
    // 新数组中根据条件添加item和i标签
    items.forEach((item, i) => {
      dymanicItems.push(item)
      if (i < items.length - 1) {
        dymanicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
      }
    })
    // 渲染新子节点
    return h('div', { class: 'xtx-bread' }, dymanicItems)
  }
}
</script>
<style lang="less">
// 去掉scoped 使之作用于xtx-bread-item.vue
.xtx-bread {
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all 0.4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}
</style>
