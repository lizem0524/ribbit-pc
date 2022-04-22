<script>
import { provide, watch, ref } from 'vue'
export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    // 定义给panel的activename
    const activeName = ref(props.modelValue)
    // 监听aciveName变化，传值给父组件(双向绑定)
    watch(() => activeName.value, () => {
      emit('update:modelValue', activeName.value)
    })
    // 响应式的activeName提供给子组件panel
    provide('activeName', activeName)

    // 点击nav时，修改activeName
    const navClick = (name, index) => {
      activeName.value = name
      emit('tab-click', { name, index }) // 提交事件，方便父组件操作
    }
    return { navClick, activeName }
  },
  render () {
    const panels = this.$slots.default()
    const dynamicPanels = [] // 动态循环渲染的组件在children里，因此要特殊处理
    panels.forEach(item => {
      // 静态节点type.name有名字且children为空，循环渲染的children为数组，注释节点children为字符串，
      if (item.type.name === 'XtxTabsPanel') { // 有名字的是静态,children为null
        dynamicPanels.push(item)
      } else if (item.children instanceof Array) { // 判断children是否为数组
        item.children.forEach(item => {
          dynamicPanels.push(item)
        })
      }
    })
    const nav = (
      <nav>
        {dynamicPanels.map((item, i) => {
          return (
            <a
              onClick={() => this.navClick(item.props.name, i)} // JSX直接写函数会立即调用，因此要套在函数里返回
              class={ { active: item.props.name === this.activeName } }
              href="javascript:;"
            >
              {item.props.label}
            </a>)
        })}
      </nav>
    )
    return <div class="xtx-tabs">{[nav, dynamicPanels]}</div>
  }
}
</script>

<style lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
