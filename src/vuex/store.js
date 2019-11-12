import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseUrl: 'https://hk.wistechx.cn:8081/stock',
    // baseUrl: 'http://192.168.0.106:8080/stock',
    currentRole: null, // 当前用户角色
    isLogin: false,
    token: '',
    imgUrl:''
  },
  getters,
  mutations,
  actions
})
