// 提供复用的逻辑函数
import { useIntersectionObserver } from '@vueuse/core'
import dayjs from 'dayjs'
import { ref, onUnmounted } from 'vue'

/**
 * 数据懒加载函数
 * @param {Object} target Dom对象
 * @param {Function} apiFn API函数
 * @returns dom,响应式result
 */
export const useLazyData = (apiFn) => {
  const target = ref(null)
  const result = ref([])
  // stop停止观察
  const { stop } = useIntersectionObserver(
    // 监听的目标元素
    target,
    // isIntersecting 是否进入可视区
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        stop()
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    { threshold: 0 } // 配置项 threshold为加载阈值，0-1之间，越小越早
  )
  return { result, target }
}

export const usePayTime = () => {
  const time = ref(null) // 倒计时秒数
  const timeText = ref('')// 倒计时文本
  let timer = null
  // 开启定时器函数
  /**
   *
   * @param {Integer} countdown -倒计时秒数
   */
  const startTimer = (countdown) => {
    clearInterval(timer)
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒') // 防止1秒空白
    timer = setInterval(() => {
      time.value--
      timeText.value = dayjs.unix(time.value).format('mm分ss秒')
      if (time.value <= 0) clearInterval(timer)
    }, 1000)
  }
  onUnmounted(() => {
    clearInterval(timer)
  })
  return { startTimer, timeText, time }
}
