// 能够显示xtx-confirm组件的函数
// 可以导入直接使用，也可以挂载在vue实例原型上
import XtxConfirm from './xtx-confirm'
import { createVNode, render } from 'vue'
// DOM容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)
// 定时器标识
export default ({ title, text }) => {
  // 将组件编译为虚拟dom节点
  return new Promise((resolve, reject) => {
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('cancel'))
    }
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    const vnode = createVNode(XtxConfirm, { title, text, cancelCallback, submitCallback })
    render(vnode, div)
  })
}
