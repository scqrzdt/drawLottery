// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false;

//引入数字图片元件
import {Reel} from '@/utils/real.js';
Vue.prototype.$Reel = Reel;

//引入Ajax 请求库
import {axios} from 'axios';
Vue.prototype.$axios = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
