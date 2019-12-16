/* eslint-disable no-undef */
import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book'
import { getBookmark, saveLocation, getBookShelf, saveBookShelf } from './localstorage'
import { shelf } from '../api/store'
import { gotoBookDetail, appendAddToShelf, computeId, removeAddFromShelf } from './store'

export const storeShelfMixin = {
  computed: {
    ...mapGetters([
      'isEditMode',
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'offsetY',
      'shelfCategory',
      'currentType'
    ])
  },
  methods: {
    ...mapActions([
      'setIsEditMode',
      'setShelfList',
      'setShelfSelected',
      'setShelfTitleVisible',
      'setOffsetY',
      'setShelfCategory',
      'setCurrentType'
    ]),
    // 跳转到详情页
    showBookDetail (book) {
      gotoBookDetail(this, book)
    },
    // 获取分类列表数据
    getCategoryList (title) {
      this.getShelfList().then(() => {
        const categoryList = this.shelfList.filter(book => book.type === 2 && book.title === title)[0]
        this.setShelfCategory(categoryList)
      })
    },
    // 获取书架数据
    getShelfList () {
      // 从localstorege中获得
      let shelfList = getBookShelf()
      if (!shelfList) {
        shelf().then(response => {
          if (response.status === 200 && response.data && response.data.bookList) {
            shelfList = appendAddToShelf(response.data.bookList)
            saveBookShelf(shelfList)
            return this.setShelfList(shelfList)
          }
        })
      } else {
        return this.setShelfList(shelfList)
      }
    },
    moveOutOfGroup (f) {
      this.setShelfList(this.shelfList.map(book => {
        if (book.type === 2 && book.itemList) {
          book.itemList = book.itemList.filter(subBook => !subBook.selected)
        }
        return book
      })).then(() => {
        const list = computeId(appendAddToShelf([].concat(
          removeAddFromShelf(this.shelfList), ...this.shelfSelected)))
        this.setShelfList(list).then(() => {
          this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
          if (f) f()
        })
      })
    }
  }
}
export const storeHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY',
      'flapCardVisible'
    ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY',
      'setFlapCardVisible'
    ]),
    showBookDetail (book) {
      // gotoBookDetail(this, book)
      console.log('showbookdetail')
      // this.flapCardVisible = false
      this.$router.push({
        path: '/book/detail',
        query: {
          fileName: book.fileName,
          category: book.categoryText
        }
      })
    }
  }
}

export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark'
    ]),
    // 主题列表
    themeList () {
      return themeList(this)
    },
    // getSectionName () {
    //   return this.section ? this.navigation[this.section].label : ''
    // }
    getSectionName () {
      if (this.section) {
        // 获得当前章节对象
        const sectionInfo = this.currentBook.section(this.section)
        // 获取当前章节名
        if (sectionInfo && sectionInfo.href && this.currentBook && this.currentBook.navigation) {
          console.log(this.currentBook.navigation)
          return this.currentBook.navigation.get(sectionInfo.href).label
        }
        return ''
      }
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark'
    ]),
    // 初始化全局主题样式
    initGlobalStyle () {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },
    refreshLocation () {
      // 获取电子书的currentLocation对象里面有登记当前章节的开始位置等信息
      const currentLocation = this.currentBook.rendition.currentLocation()
      if (currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi
        const progress = this.currentBook.locations.percentageFromCfi(startCfi)
        this.setProgress(Math.floor(progress * 100))
        // 章节的刷新
        this.setSection(currentLocation.start.index)
        // 缓存章节进度
        saveLocation(this.fileName, startCfi)
        // 判断书签是否存在修改书签状态
        const bookmark = getBookmark(this.fileName)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
        if (this.pagelist) {
          const totalPage = this.pagelist.length
          const currentPage = currentLocation.start.location
          if (currentPage && currentPage > 0) {
            this.setPaginate(currentPage + ' / ' + totalPage)
          } else {
            this.setPaginate('')
          }
        } else {
          this.setPaginate('')
        }
      }
    },
    // 电子书的展示
    display (target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          if (cb) {
            cb()
          }
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (cb) {
            cb()
          }
        })
      }
    },
    // 隐藏标题栏和地步菜单栏
   // 标题和菜单的显示
   hideTitleAndMenu () {
    // this.$store.dispatch('setMenuVisible', false)
    this.setMenuVisible(false)
    // 字体属性面板隐藏
    this.setSettingVisible(-1)
    // 字体设置面板隐藏
    this.setFontFamilyVisible(false)
   },
    // 获取阅读时间
    getReadTimeText () {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    }
  }
}
