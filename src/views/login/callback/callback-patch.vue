<template>
  <Form ref="formCom" :validation-schema="mySchema" v-slot="{ errors }" autocomplete="off" class="xtx-form">
    <!-- 用户名 -->
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field v-model="form.account" name="account" :class="{ err: errors.account }" class="input" type="text" placeholder="请输入用户名" />
      </div>
      <!-- 用户名错误提示 -->
      <div v-if="errors.account" class="error"><i class="iconfont icon-warning" />{{ errors.account }}</div>
    </div>
    <!-- 密码 -->
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field v-model="form.password" name="password" :class="{ err: errors.password }"  class="input" type="password" placeholder="请输入密码" />
      </div>
      <!-- 密码格式错误提示 -->
      <div v-if="errors.password" class="error"><i class="iconfont icon-warning" />{{ errors.password }}</div>
    </div>
    <!-- 确认密码 -->
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field v-model="form.rePassword" name="rePassword" :class="{ err: errors.rePassword }"  class="input" type="password" placeholder="确认密码" />
      </div>
      <!-- 确认密码错误提示 -->
      <div v-if="errors.rePassword" class="error"><i class="iconfont icon-warning" />{{ errors.rePassword }}</div>
    </div>
    <!-- 手机号 -->
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field v-model="form.mobile" name="mobile" :class="{ err: errors.mobile }" class="input" type="text" placeholder="请输入手机号" />
      </div>
      <!-- 手机号错误提示 -->
      <div v-if="errors.mobile" class="error"><i class="iconfont icon-warning" />{{ errors.mobile }}</div>
    </div>
    <!-- 验证码 -->
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-msg"></i>
        <input v-model="form.code" class="input" type="text" maxlength="6" placeholder="请输入验证码" />
        <span @click="getCode" class="code">{{ time === 0 ? '发送验证码' : time + '秒后发送' }}</span>
      </div>
    </div>
    <!-- 提交 -->
    <a href="javascript:;"  @click="submit" class="submit" :class="{ disabled: form.code.length !== 6 }" >立即提交</a>
  </Form>
</template>

<script>
import { reactive, ref, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { getQQPatchCode, userQQPatchLogin } from '@/api/user'
import Message from '@/components/Message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackPatch',
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  components: { Form, Field },
  setup (props) {
    const store = useStore()
    const router = useRouter()
    const form = reactive({
      account: '',
      mobile: '',
      code: '',
      password: '',
      rePassword: ''
    })
    const mySchema = {
      account: schema.accountApi,
      mobile: schema.mobile,
      password: schema.password,
      rePassword: schema.rePassword
    }
    const submit = async () => {
      if (form.code.length !== 6) return
      const valid = await formCom.value.validate()
      if (valid) {
        try {
          const data = await userQQPatchLogin({ unionId: props.unionId, ...form })
          const { id, avatar, nickname, account, mobile, token } = data.result // 拿用户信息数据
          store.commit('user/setUser', { id, avatar, nickname, account, mobile, token }) // 存用户信息数据到vuex
          router.push(store.state.user.redirectUrl || '/') // 跳转到登录前页面
          await store.dispatch('cart/mergeCart') // 合并购物车
          Message({ type: 'success', text: '注册成功' })
        } catch (e) {
          Message({ type: 'error', text: e.response.data.message || '注册失败' })
        }
      }
    }
    // 发送短信验证码按钮
    const formCom = ref(null)
    let timer = null // 定时器
    const time = ref(0) // 倒计时
    // 点击按钮时
    const getCode = () => {
      // 手动校验手机号输入框(因为输入框没聚焦过不会校验)
      const valid = mySchema.mobile(form.mobile)
      // 手机号校验成功
      if (valid === true) {
        // 当前定时器未启动时发送请求
        if (time.value === 0) {
          getQQPatchCode(form.mobile)
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
        // 校验失败时要手动提示错误消息
        formCom.value.setFieldError('mobile', valid)
      }
    }
    onUnmounted(() => {
      clearInterval(timer)
    })
    return { mySchema, form, getCode, formCom, time, submit }
  }
}
</script>

<style scoped lang="less">
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
