import defaultImg from '@/assets/images/200.png'
// 图片的懒加载和统一错误默认图片的指令
const lazy = {
  mounted (el, binding) {
    const observe = new IntersectionObserver(([{ isIntersecting }]) => {
      if (isIntersecting) {
        // 停止监听
        observe.unobserve(el)
        // 图片路径错误处理
        el.onerror = () => {
          el.src = defaultImg
        }
        // 给图片添加src属性
        el.src = binding.value
      }
    }, { threshold: 0 })
    // 监听el
    observe.observe(el)
  }
}
export default {
  install (app) {
    app.directive('lazy', lazy)
  }
}
