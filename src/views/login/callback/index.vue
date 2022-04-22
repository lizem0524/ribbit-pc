<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container" v-if="loading">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-else>
    <nav class="tab">
      <a @click="haveAccount = true" :class="{ active: haveAccount }" href="javascript:;">
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a @click="haveAccount = false" :class="{ active: !haveAccount }" href="javascript:;">
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="haveAccount">
      <CallbackBind :unionId="unionId" :nickname="nickname" :avatar="avatar" />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>
  <LoginFooter />
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import LoginHeader from '../components/login-header'
import LoginFooter from '../components/login-footer'
import CallbackBind from './callback-bind'
import CallbackPatch from './callback-patch'
import { userQQLogin } from '@/api/user'
import QC from 'qc'
import Message from '@/components/Message'
export default {
  name: 'LoginCallback',
  components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },
  setup () {
    // 此页面是QQ登录后QQ回跳的绑定小兔鲜账号信息的页面，地址是固定的(提交给腾讯)
    // 因此要做判断，如果绑定过将跳过该页面。
    const haveAccount = ref(true)
    const nickname = ref(null)
    const avatar = ref(null)
    const store = useStore()
    const router = useRouter()
    const unionId = ref(null)
    // 进入页面则加载，不给绑定过的用户看界面
    const loading = ref(true)
    // 判断QQ是否登录成功
    if (QC.Login.check()) {
      // 成功后拿用户信息
      QC.api('get_user_info').success(res => {
        nickname.value = res.data.nickname
        avatar.value = res.data.figureurl_qq_2
      })
      // 登录成功则拿QQ账号的唯一标识
      QC.Login.getMe(openId => {
        unionId.value = openId
        // 用唯一标识与后台确认是否绑定过小兔鲜账号
        userQQLogin(unionId.value)
        // 绑定过，则拿信息，跳转
          .then(data => {
            const { id, avatar, nickname, account, mobile, token } = data.result // 拿用户信息数据
            store.commit('user/setUser', { id, avatar, nickname, account, mobile, token }) // 存用户信息数据到vuex
            router.push(store.state.user.redirectUrl || '/') // 跳转到登录前页面
            store.dispatch('cart/mergeCart').then(() => {
              Message({ type: 'success', text: '登录成功' })
            })
          })
          // 没绑定过，在该页面绑定
          .catch(e => {
            loading.value = false
          })
      })
    }
    return { haveAccount, nickname, avatar, loading, unionId }
  }
}
</script>

<style scoped lang="less">
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
