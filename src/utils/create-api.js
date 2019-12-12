import CreateAPI from 'vue-create-api'
import Vue from 'vue'
import Toast from '../components/common/Toast'
import Popup from '../components/common/Popup'
import GroupDialog from '../components/shelf/ShelfGroupDialog'

Vue.use(CreateAPI)
// 将复用组件扩展成vue实例中的方法api
Vue.createAPI(Toast, true)
Vue.createAPI(Popup, true)
Vue.createAPI(GroupDialog, true)
// 全局mixin更简化
Vue.mixin({
  methods: {
    // 提示框
    toast (settings) {
      return this.$createToast({
        $props: settings
      })
    },
    // 弹出框
    popup (settings) {
      return this.$createPopup({
        $props: settings
      })
    },
    simpleToast (text) {
      const toast = this.toast({
        text: text
      })
      toast.show()
      toast.updateText(text)
    },
    dialog (settings) {
      return this.$createGroupDialog({
        $props: settings
      })
    }
  }
})
