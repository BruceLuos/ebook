import Vue from 'vue'
import VueI18N from 'vue-i18n'
import en from './en'
import cn from './cn'
import { getLocale, saveLocale } from '../utils/localstorage'

Vue.use(VueI18N)

const messages = {
  en,
  cn
}

// 从缓存中获取当前翻译内容用的语言
let locale = getLocale()
if (!locale) {
  // 默认是中文
  locale = 'cn'
  saveLocale(locale)
}

const i18n = new VueI18N({
  locale,
  messages
})

export default i18n
