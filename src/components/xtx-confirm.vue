<template>
  <div class="xtx-confirm" :class="{fade}">
    <div class="wrapper" :class="{fade}">
      <div class="header">
        <h3>{{ title }}</h3>
        <a @click="cancel" href="JavaScript:;" class="iconfont icon-close-new"></a>
      </div>
      <div class="body">
        <i class="iconfont icon-warning"></i>
        <span>{{ text }}</span>
      </div>
      <div class="footer">
        <XtxButton size="mini" type="gray" @click="cancel">取消</XtxButton>
        <XtxButton size="mini" type="primary" @click="submit">确认</XtxButton>
      </div>
    </div>
  </div>
</template>
<script>
import XtxButton from './xtx-button'
import { ref, onMounted } from 'vue'
export default {
  name: 'XtxConfirm',
  components: { XtxButton },
  props: {
    title: {
      type: String,
      default: '提示'
    },
    text: {
      type: String,
      default: ''
    },
    cancelCallback: {
      type: Function
    },
    submitCallback: {
      type: Function
    }
  },
  setup (props) {
    const fade = ref(false)
    // 过渡要在初始化后才能生效
    onMounted(() => {
      setTimeout(() => {
        fade.value = true
      }, 0)
    })
    const cancel = () => {
      props.cancelCallback()
    }
    const submit = () => {
      props.submitCallback()
    }
    return { cancel, submit, fade }
  }
}
</script>
<style scoped lang="less">
.xtx-confirm {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8888;
  background: rgba(0, 0, 0, 0);
  &.fade {
    transition: all 0.2s;
    background: rgba(0, 0, 0, 0.5);
  }
  .wrapper {
    width: 400px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    opacity: 0;
    &.fade {
      transition: all 0.2s;
      transform: translate(-50%, -50%);
      opacity: 1;
    }
    .header,
    .footer {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }
    .body {
      padding: 20px 40px;
      font-size: 16px;
      .icon-warning {
        color: @warnColor;
        margin-right: 3px;
        font-size: 16px;
      }
    }
    .footer {
      text-align: right;
      .xtx-button {
        margin-left: 20px;
      }
    }
    .header {
      position: relative;
      h3 {
        font-weight: normal;
        font-size: 18px;
      }
      a {
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #999;
        &:hover {
          color: #666;
        }
      }
    }
  }
}
</style>
