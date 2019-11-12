// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from '@/vuex/store'
import global from '@/components/global.js'

Vue.config.productionTip = false

// axios.defaults.withCredentials = true
Vue.prototype.$axios = axios

Vue.use(ElementUI)

// http request 拦截器
axios.interceptors.request.use(config => {
  // 在发送请求前
  let pathname = location.pathname;
  if (sessionStorage.getItem('token')) {
    if (pathname != '/' && pathname != '/login') {
      config.headers.common['token'] = sessionStorage.getItem('token');
    }
  }
  return config;
}, err => {
  return Promise.reject(error);
})
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 这里写清除token的代码
          sessionStorage.setItem("token", null);
          sessionStorage.setItem("role", null);
          console.log(router.currentRoute.fullPath)
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath //登录成功后跳入浏览的当前页面
            } 
          })
      }
    }
    return Promise.reject(error.response)
  });


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
