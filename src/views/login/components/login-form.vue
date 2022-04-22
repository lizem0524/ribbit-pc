<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin"> <i class="iconfont icon-user"></i> 使用账号登录 </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else> <i class="iconfont icon-msg"></i> 使用短信登录 </a>
    </div>
    <!-- 表单区域 -->
    <Form ref="formCom" class="form" :validation-schema="mySchema" v-slot="{ errors }" autocomplete="off">
      <!-- 用户名密码登录 -->
      <template v-if="!isMsgLogin">
        <!-- 用户名 -->
        <div class="form-item">
          <!-- 用户名输入框 -->
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field v-model="form.account" name="account" :class="{ error: errors.account }" type="text" placeholder="请输入用户名或手机号" />
          </div>
          <!-- 用户名错误提示 -->
          <div class="error" v-if="errors.account"><i class="iconfont icon-warning" />{{ errors.account }}</div>
        </div>
        <!-- 密码 -->
        <div class="form-item">
          <!-- 密码输入 -->
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field v-model="form.password" name="password" :class="{ error: errors.password }" type="password" placeholder="请输入密码" />
          </div>
          <!-- 密码错误提示 -->
          <div class="error" v-if="errors.password"><i class="iconfont icon-warning" />{{ errors.password }}</div>
        </div>
      </template>
      <!-- 手机短信登录 -->
      <template v-else>
        <div class="form-item">
          <!-- 手机号输入 -->
          <div class="input">
            <i class="iconfont icon-phone"></i>
            <Field v-model="form.mobile" name="mobile" :class="{ error: errors.mobile }" type="text" placeholder="请输入手机号" />
          </div>
          <!-- 手机号错误提示 -->
          <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{ errors.mobile }}</div>
        </div>
        <div class="form-item">
          <!-- 短信验证码 -->
          <div class="input">
            <i class="iconfont icon-msg"></i>
            <!-- name="code" :class="{ error: errors.code }" -->
            <input v-model="form.code" type="text" maxlength="6" placeholder="请输入验证码" />
            <span class="code" @click="getCode">{{ time === 0 ? '发送验证码' : `${time}后发送` }}</span>
          </div>
          <!-- <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{ errors.code }}</div> -->
        </div>
      </template>
      <!-- 同意条款 -->
      <div class="form-item">
        <!-- 同意按钮 -->
        <div class="agree">
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree"><i class="iconfont icon-warning" />{{ errors.isAgree }}</div>
      </div>
      <!-- 登录按钮 -->
      <a @click="login" href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
      <!-- qq登录 -->
      <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="@/assets/images/qq-login.png" alt="" />
      </a>
      <!-- 忘记密码和注册 -->
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
import { onUnmounted, reactive, ref, watch } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { userAccountLogin, getMobileCode, userMobileLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import Message from '@/components/Message'
// import QC from 'qc'
export default {
  name: 'LoginForm',
  components: { Form, Field },

  setup () {
    const isMsgLogin = ref(false) // 登录方式切换
    // 两种登录方式的表单数据
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })
    // vee-validate校验规则
    const mySchema = {
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }

    // 切换登录方式时清除表单数据
    const formCom = ref(null) // 表单dom
    watch(isMsgLogin, () => {
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      formCom.value.resetForm() // 清除验证
    })
    // 点击登录时整体表单校验
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const login = async () => {
      // 拿表单校验结果
      const valid = await formCom.value.validate()
      // 校验成功=>发登录请求
      if (valid) {
        try {
          let data = null
          // 判断登录方式
          if (isMsgLogin.value) {
            // 短信登录
            data = await userMobileLogin({ mobile: form.mobile, code: form.code })
          } else {
            // 用户名密码登录
            data = await userAccountLogin({ account: form.account, password: form.password })
          }
          // 存储用户信息
          if (data) {
            const { id, avatar, nickname, account, mobile, token } = data.result // 拿用户信息数据
            store.commit('user/setUser', { id, avatar, nickname, account, mobile, token }) // 存用户信息数据到vuex
            router.push(route.query.redirectUrl || '/') // 跳转到登录前页面
            await store.dispatch('cart/mergeCart')
            Message({ type: 'success', text: '登录成功' })
          }
          // 捕获登录失败异常
        } catch (e) {
          if (e.response.data) {
            Message({ type: 'error', text: e.response.data.message || '登录失败' })
          }
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
        // 当前定时器未启动时发送请求
        if (time.value === 0) {
          getMobileCode(form.mobile)
            .then(data => {
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
    // QQ登录
    // onMounted(() => {
    //   // 插入按钮的节点id
    //   QC.Login({
    //     btnId: 'qqLoginBtn'
    //   })
    // })

    return { isMsgLogin, form, mySchema, formCom, login, getCode, time }
  }
}
</script>
<style lang="less">
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
