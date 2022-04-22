<template>
  <div class="xtx-form">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{ nickname }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <Form ref="formCom" :validation-schema="mySchema" v-slot="{ errors }" autocomplete="off">
      <!-- 手机号 -->
      <div class="xtx-form-item">
        <div class="field">
          <i class="icon iconfont icon-phone"></i>
          <Field v-model="form.mobile" name="mobile" :class="{ err: errors.mobile }" class="input" type="text" placeholder="绑定的手机号" />
        </div>
        <!-- 手机号错误提示 -->
        <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{ errors.mobile }}</div>
      </div>
      <!-- 验证码 -->
      <div class="xtx-form-item">
        <div class="field">
          <i class="icon iconfont icon-msg"></i>
          <input v-model="form.code" maxlength="6" class="input" type="text" placeholder="短信验证码" />
          <span class="code" @click="getCode">{{ time === 0 ? '发送验证码' : time + '秒后发送' }}</span>
        </div>
      </div>
      <!-- 提交按钮 -->
      <a href="javascript:;" @click="submit" class="submit" :class="{ disabled: form.code.length !== 6 }">立即绑定</a>
    </Form>
  </div>
</template>

<script>
import { ref, reactive, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { getQQBindCode, userQQBindLogin } from '@/api/user'
import Message from '@/components/Message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackBind',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    },
    nickname: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const formCom = ref(null)
    const router = useRouter()
    const store = useStore()
    // 表单数据
    const form = reactive({
      mobile: '',
      code: ''
    })
    // 表单验证规则
    const mySchema = {
      mobile: schema.mobile
    }
    // 绑定提交
    const submit = async () => {
      const valid = await formCom.value.validate()
      if (form.code.length !== 6) return
      if (valid) {
        try {
          const data = await userQQBindLogin(props.unionId, form.mobile, form.code)
          const { id, avatar, nickname, account, mobile, token } = data.result // 拿用户信息数据
          store.commit('user/setUser', { id, avatar, nickname, account, mobile, token }) // 存用户信息数据到vuex
          router.push(store.state.user.redirectUrl || '/') // 跳转到登录前页面
          await store.dispatch('cart/mergeCart') // 合并购物车
          Message({ type: 'success', text: 'QQ绑定成功' })
        } catch (e) {
          Message({ type: 'error', text: e.response.data.message || '绑定失败' })
        }
      }
    }

    // 发送短信验证码按钮
    let timer = null // 定时器
    const time = ref(0) // 倒计时
    // 点击按钮时
    const getCode = () => {
      // 手动校验手机号输入框(因为输入框没聚焦过不会校验)
      const valid = mySchema.mobile(form.mobile)
      // 手机号校验成功
      if (valid === true) {
        console.log(valid)
        // 当前定时器未启动时发送请求
        if (time.value === 0) {
          getQQBindCode(form.mobile)
            .then(() => {
              Message({ type: 'success', text: '发送成功' })
              clearInterval(timer)
              time.value = 60
              timer = setInterval(() => {
                time.value--
                if (time.value === 0) {
                  clearInterval(timer)
                }
              }, 1000)
            })
            .catch(e => {
              // 后端提示验证码发送失败
              if (e.response.data) {
                Message({ type: 'error', text: e.response.data.message || '验证码发送失败' })
              }
            })
        }
      } else {
        console.log(valid)
        // 校验失败时要手动提示错误消息
        formCom.value.setFieldError('mobile', valid)
      }
    }
    onUnmounted(() => {
      clearInterval(timer)
    })
    return { form, mySchema, getCode, time, formCom, submit }
  }
}
</script>

<style scoped lang="less">
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
