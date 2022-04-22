// 能够显示xtx-message组件的函数
// 可以导入直接使用，也可以挂载在vue实例原型上
import XtxMessage from './xtx-message'
import { createVNode, render } from 'vue'
// DOM容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-massage-container')
document.body.appendChild(div)
// 定时器标识
let timer = null
export default ({ type, text }) => {
  // 将组件编译为虚拟dom节点
  const vnode = createVNode(XtxMessage, { type, text })
  render(vnode, div)
  clearInterval(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
