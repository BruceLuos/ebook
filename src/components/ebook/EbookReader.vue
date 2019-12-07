<template>
<div class='ebook-reader'>
  <div id='read'></div>
  <div class="ebook-reader-mask"
         @click="onMaskClick"
         @touchmove="move"
         @touchend="moveEnd"
         @mousedown.left="onMouseEnter"
         @mousemove.left="onMouseMove"
         @mouseup.left="onMouseEnd"></div>
</div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { ebookMixin } from '../../utils/mixin'
// import { mapActions } from 'vuex'
import Epub from 'epubjs'
import { saveFontSize, getFontSize, saveFontFamily, getFontFamily, getTheme, saveTheme, getLocation } from '../../utils/localstorage'
import { flatten } from '../../utils/book'
global.ePub = Epub
export default {
  mixins: [ebookMixin],
  computed: {
    // 这样就可以使用this.fileName来获取fileName
    // ...mapGetters(['fileName','menuVisible'])
  },
  methods: {
    // ...mapActions(['setMenuVisible']),
      // 1 - 鼠标进入
      // 2 - 鼠标进入后的移动
      // 3 - 鼠标从移动状态松手
      // 4 - 鼠标还原

      // 鼠标抬起
      onMouseEnd(e) {
        if (this.mouseState === 2) {
          // 鼠标抬起时归零偏移量
          this.setOffsetY(0)
          this.firstOffsetY = null
          this.mouseState = 3
        } else {
          this.mouseState = 4
        }
        // 为了防止误碰触发状态三导致延迟
        // 检查鼠标点击间隔时间，小于这个时间则触发正常的点击事件
        // e.timestamp是指当前时间
        const time = e.timeStamp - this.mouseStartTime
        if (time < 100) {
          this.mouseState = 4
        }
        e.preventDefault()
        e.stopPropagation()
      },
      // 鼠标移动时
      onMouseMove(e) {
        if (this.mouseState === 1) {
          this.mouseState = 2
        } else if (this.mouseState === 2) {
          let offsetY = 0
          if (this.firstOffsetY) {
            // 获取鼠标移动偏移量
            offsetY = e.clientY - this.firstOffsetY
            this.setOffsetY(offsetY)
          } else {
            this.firstOffsetY = e.clientY
          }
        }
        e.preventDefault()
        e.stopPropagation()
      },
      // 点击鼠标开始
      onMouseEnter(e) {
        // 点击鼠标设为状态1，获取当前点击时间
        this.mouseState = 1
        this.mouseStartTime = e.timeStamp
        e.preventDefault()
        e.stopPropagation()
      },
      // 手指移动时
      move(e) {
        let offsetY = 0
        if (this.firstOffsetY) {
          // 移动的偏差
          offsetY = e.changedTouches[0].clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.changedTouches[0].clientY
        }
        e.preventDefault()
        e.stopPropagation()
      },
      // 移动结束,还原偏移量
      moveEnd(e) {
        this.setOffsetY(0)
        this.firstOffsetY = null
      },
      onMaskClick(e) {
        // 移动事件忽略掉
        if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
          return
        }
        const offsetX = e.offsetX
        const width = window.innerWidth
        if (offsetX > 0 && offsetX < width * 0.3) {
          this.prevPage()
        } else if (offsetX > 0 && offsetX > width * 0.7) {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
      },
    // 前一页
     prevPage () {
       if (this.rendition) {
           this.rendition.prev()
           this.hideTitleAndMenu()
       }
     },
    //  下一页
    nextPage () {
      if (this.rendition) {
          this.rendition.next()
          this.hideTitleAndMenu()
      }
    },
    // 标题和菜单的显示
    toggleTitleAndMenu () {
      // 底部菜单栏显示的时候
      if (this.menuVisible) {
        // 字体属性面板隐藏
      this.setSettingVisible(-1)
      // 字体设置面板隐藏
      this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    // 标题和菜单的显示
    // hideTitleAndMenu () {
    //   // this.$store.dispatch('setMenuVisible', false)
    //   this.setMenuVisible(false)
    //   // 字体属性面板隐藏
    //   this.setSettingVisible(-1)
    //   // 字体设置面板隐藏
    //   this.setFontFamilyVisible(false)
    // },
    // 初始化获取缓存中的字体大小
    initFontSize () {
        let fontSize = getFontSize(this.fileName)
        if (!fontSize) {
          saveFontSize(this.fileName, this.defaultFontSize)
        } else {
          this.rendition.themes.fontSize(fontSize)
          this.setDefaultFontSize(fontSize)
        }
      },
    // 初始化获取缓存中的字体
    initFontFamily () {
        let font = getFontFamily(this.fileName)
        if (!font) {
          saveFontFamily(this.fileName, this.defaultFontFamily)
        } else {
          this.rendition.themes.font(font)
          this.setDefaultFontFamily(font)
        }
      },
    // 手势
    initGesture () {
       // 翻页(计算手势移动位移和时间间隔)
      this.rendition.on('touchstart', event => {
      //  console.log(event)
       this.touchStartX = event.changedTouches[0].clientX
       this.touchStartTime = event.timeStamp
     })
      this.rendition.on('touchend', event => {
        // 位移位置
          const offsetX = event.changedTouches[0].clientX - this.touchStartX
          // 时间间隔
          const time = event.timeStamp - this.touchStartTime
          if (time < 500 && offsetX > 40) {
            // 前一页
            this.prevPage()
          } else if (time < 500 && offsetX < -40) {
            // 后一页
            this.nextPage()
          } else {
            this.toggleTitleAndMenu()
          }
          // 新版chrome会默认preventDefault是被动的所以会警告
          event.preventDefault()
          event.stopPropagation()
        })
    },
    // 初始化获取缓存中的主题，注册主题
    initTheme () {
       let defaultTheme = getTheme(this.fileName)
        if (!defaultTheme) {
          console.log('hhh')
          defaultTheme = this.themeList[0].name
          saveTheme(this.fileName, defaultTheme)
        }
        this.setDefaultTheme(defaultTheme)
         // 注册主题进电子书中
        this.themeList.forEach(theme => {
          this.rendition.themes.register(theme.name, theme.style)
        })
        this.rendition.themes.select(defaultTheme)
    },
    // 电子书的渲染
    initRendition () {
       // 绑定dom read进行书籍的渲染
      this.rendition = this.book.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight
      })
      // 展示电子书  在这过程中获取存储在localstorage中的字体属性
      const location = getLocation(this.fileName)
      console.log(this.fileName)
      console.log(location)
        this.display(location, () => {
          this.initTheme()
          this.initFontSize()
          this.initFontFamily()
          this.initGlobalStyle()
        })
      // 加载不同的字体样式资源
        // 通过hooks这个钩子函数
        console.log(this.rendition)
        this.rendition.hooks.content.register(contents => {
          // addStylesheet参数要求为一个url
          // 所以我们需要把资源放在nginx上
         Promise.all([
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
          ]).then(() => {
          })
        })
    },
    // 获取书籍信息
    parseBook () {
      // 获取书籍图片
      this.book.loaded.cover.then(cover => {
          this.book.archive.createUrl(cover).then(url => {
            this.setCover(url)
          })
        })
        // 获取书籍信息
        this.book.loaded.metadata.then(metadata => {
          this.setMetadata(metadata)
        })
        // 获取目录数据
        this.book.loaded.navigation.then(nav => {
          // toc是一级目录
          const navItem = flatten(nav.toc)
          // 查看是否含有父级
          function find (item, level = 0) {
            return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
          }
          // 为一级内容添加标识level
          navItem.forEach(item => {
            item.level = find(item)
          })
          this.setNavigation(navItem)
        })
    },
    // 合并电子书url并解析渲染电子书
    initEpub () {
      // http://localhost:8080/#/ebook/Biomedicine|2014_Book_Self-ReportedPopulationHealthA
      const url = process.env.VUE_APP_RES_URL + '/epub/' + this.fileName + '.epub'
      console.log(url)
      // 解析获取book
      this.book = new Epub(url)
      // 将book对象存放在vuex中
      this.setCurrentBook(this.book)
      console.log(this.book)
      console.log(this.fileName)
      // 电子书的渲染
      this.initRendition()
      // 手势
      // this.initGesture()
      // 获取书籍信息
      this.parseBook()
      // 分页算法 ，需要在book解析完后才可以进行分页
      this.book.ready.then(() => {
          return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
        }).then(locations => {
          // console.log(locations)
          // 根据数据结构看出location哪些页数是属于navigation中章节
          this.navigation.forEach(nav => {
            nav.pagelist = []
          })
          locations.forEach(item => {
            const loc = item.match(/\[(.*)\]!/)[1]
            // console.log(loc)
            this.navigation.forEach(nav => {
              if (nav.href) {
                const href = nav.href.match(/^(.*)\.html$/)[1]
                // console.log(href)
                // 根据locations和navigation中过滤数据中相同名字的数据加入pagelist
                if (href === loc) {
                  nav.pagelist.push(item)
                }
              }
            })
            let currentPage = 1
            this.navigation.forEach((nav, index) => {
              // 封面时页数为1
              if (index === 0) {
                // 初始化当前页数为1
                nav.page = 1
              } else {
                nav.page = currentPage
              }
              // 当前页数
              currentPage += nav.pagelist.length + 1
            })
          })
          this.setPagelist(locations)
          this.setBookAvailable(true)
          // 分页成功后也需要刷新章节进度
          this.refreshLocation()
        })
    }
  },
  mounted () {
    // 拆分路由地址
    const fileName = this.$route.params.fileName.split('|').join('/')
    // console.log(fileName)
    // 分发fileName在vuex中修改
    this.setFileName(fileName).then(() => {
      this.initEpub()
    })
  }
}
</script>
<style lang='scss' rel="stylesheet/scss" scoped>
@import '../../assets/styles/global';
*{
  touch-action: none;
}
.ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask {
      position: absolute;
      top: 0;
      left: 0;
      background: transparent;
      z-index: 150;
      width: 100%;
      height: 100%;
    }
}
</style>
