import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import i18n from './lang/index'
// import './mock'
import './assets/styles/icon.css'
import './assets/styles/global.scss'
import './utils/boost'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
