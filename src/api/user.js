import request from '@/utils/request'

/**
 * 用户名密码登录
 * @param {String} account -账号
 * @param {String} password -密码
 * @returns
 */
export const userAccountLogin = ({ account, password }) => request('/login', 'post', { account, password })

/**
 * 获取手机验证码
 * @param {String} mobile -手机号
 * @returns
 */
export const getMobileCode = (mobile) => request('/login/code', 'get', { mobile })

/**
 * 手机验证码登录
 * @param {String} mobile -手机号
 * @param {String} code -验证码
 * @returns
 */
export const userMobileLogin = ({ mobile, code }) => request('/login/code', 'post', { mobile, code })

/**
 *
 * @param {String} unionId -QQ登录唯一标识
 * @param {*} source -客户端类型  1 PC
 * @returns
 */
export const userQQLogin = (unionId, source = 1) => request('login/social', 'post', { unionId, source })

/**
 * 获取QQ绑定已有账号的验证码
 * @param {String} mobile -手机号
 * @returns
 */
export const getQQBindCode = (mobile) => request('/login/social/code', 'get', { mobile })

/**
 * QQ登录-绑定已有账号
 * @param {String} unionId -QQ登录唯一标识
 * @param {String} mobile  -手机号
 * @param {String} code    -验证码
 * @returns
 */
export const userQQBindLogin = (unionId, mobile, code) => request('/login/social/bind', 'post', { unionId, mobile, code })

/**
 * 校验用户名是否存在
 * @param {String} account -用户名
 * @returns
 */
export const userAccountCheck = (account) => request('/register/check', 'get', { account })

/**
 * 获取QQ完善信息的验证码
 * @param {String} mobile -手机号
 * @returns
 */
export const getQQPatchCode = (mobile) => request('/register/code', 'get', { mobile })

/**
 *QQ完善信息新注册
 * @param {String} unionId -QQ登录唯一标识
 * @param {String} account -用户名
 * @param {String} password -密码
 * @param {String} mobile  -手机号
 * @param {String} code    -验证码
 * @returns
 */
export const userQQPatchLogin = ({ unionId, mobile, code, account, password }) => request(`/login/social/${unionId}/complement`, 'post', { mobile, code, account, password })
