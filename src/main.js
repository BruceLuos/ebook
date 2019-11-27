import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import i18n from './lang/index'
import mock from './mock'
import './assets/styles/icon.css'
import './assets/styles/global.scss'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  mock,
  render: h => h(App)
}).$mount('#app')
