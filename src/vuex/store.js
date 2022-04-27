import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // baseUrl: 'https://hk.wistechx.cn/HermesApi', // 正式
    //baseUrl: 'http://hk.wistechx.cn:8081/stock',
    baseUrl: 'http://192.168.0.164:8081/stock',
    baseCompanyUrl: "http://192.168.0.164:8081",
    // baseWechatUrl: "http://192.168.0.164:8081/wechat/api",
    currentRole: null, // 当前用户角色
    isLogin: false,
    token: '',
    type: '',
    imgUrl: '',
    imgUrl2: ''
  },
  getters,
  mutations,
  actions
})
