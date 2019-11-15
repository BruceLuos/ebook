import Vue from 'vue'
import Vuex from 'vuex'
import Book from './modules/book'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Book
  }
})
