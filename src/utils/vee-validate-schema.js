import { userAccountCheck } from '@/api/user'
export default {
  // 用户名格式校验
  account (value) {
    // 非空校验
    if (!value) return '用户名不能为空'
    // 字母开头,6-20字符之间
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '必须以字母开头，且为6-20个字符'
    return true
  },
  // 用户名格式和唯一性校验
  async accountApi (value) {
    // 非空校验
    if (!value) return '用户名不能为空'
    // 字母开头,6-20字符之间
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '必须以字母开头，且为6-20个字符'
    const data = await userAccountCheck(value)
    if (data.result.valid) return '用户名已存在'
    return true
  },
  // 密码格式校验
  password (value) {
    // 非空
    if (!value) return '密码不能为空'
    // 6-24个字符
    if (!/\w{6,24}/.test(value)) return '密码为6-24个字符'
    return true
  },
  rePassword (value, { form }) {
    if (value !== form.password) return '两次输入不一致'
    return true
  },
  // 手机号格式校验
  mobile (value) {
    // 非空
    if (!value) return '手机不能为空'
    // 1开头，3-9,9个数字
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式不正确'
    return true
  },
  // 验证码校验
  code (value) {
    // 非空
    if (!value) return '验证码不能为空'
    // 1开头，3-9,9个数字
    if (!/^\d{6}$/.test(value)) return '验证码格式不正确'
    return true
  },
  // 是否勾选同意协议
  isAgree (value) {
    if (!value) return '请勾选用户协议'
    return true
  }
}
