<template>
  <div class="xtx-checkbox" @click="changeChecked()">
    <i v-if="modelValue" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot /></span>
  </div>
</template>
<script>
// import { ref } from 'vue'
// import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    const changeChecked = () => {
      emit('update:modelValue', !props.modelValue) // 修改父组件双向绑定的值
      emit('change', !props.modelValue) // 值给父组件的$event
    }
    // const checked = useVModel(props, 'modelValue', emit)
    // const changeChecked = () => {
    //   checked.value = !checked.value
    // }
    return { changeChecked }
  }
}
</script>
<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
