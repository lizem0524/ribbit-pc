<template>
  <div class="xtx-tabs-panel" v-if="name===activeName">
    <slot />
  </div>
</template>
>
<script>
import { inject } from 'vue'
export default {
  name: 'XtxTabsPanel',
  props: {
    label: {
      type: String,
      default: ''
    },
    name: {
      type: [String, Number],
      default: ''
    }
  },
  setup () {
    // 接收tabs组件传来的响应式数据
    const activeName = inject('activeName')
    return { activeName }
  }
}
</script>

<style></style>
