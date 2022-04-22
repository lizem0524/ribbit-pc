<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem v-if="category.top" :to="`/category/${category.top.id}`">{{ category.top.name }}</XtxBreadItem>
    <Transition name="fade-right" mode="out-in">
      <XtxBreadItem :key="category.sub.id" v-if="category.sub">{{ category.sub.name }}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>

<script>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
export default {
  setup () {
    const store = useStore()
    const route = useRoute()
    // 根据当前路由的id，获取当前一级和二级类目的 id,name
    const category = computed(() => {
      const cate = {}
      store.state.category.list.forEach(top => {
        const sub = top.children && top.children.find(sub => sub.id === route.params.id)
        if (sub) {
          cate.top = { id: top.id, name: top.name }
          cate.sub = { id: sub.id, name: sub.name }
        }
      })
      return cate
    })
    return {
      category
    }
  }
}
</script>

<style></style>
