import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/book-store'
    },
    {
      path: '/ebook',
      component: () => import('./views/ebook/index.vue'),
      children: [{
        path: ':fileName',
        component: () => import('./components/ebook/EbookReader.vue')
      }]
    },
    {
      path: '/book-store',
      component: () => import('./views/store/index.vue'),
      redirect: '/book-store/home',
      children: [{
        path: 'home',
        component: () => import('./views/store/bookHome.vue')
      }, {
        path: 'list',
        component: () => import('./views/store/StoreList.vue')
      }, {
          path: 'detail',
          component: () => import('./views/store/StoreDetail.vue')
      }]
    }
  ]
})
