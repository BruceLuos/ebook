<template>
<div class='ebook-reader'>
  <div id='read'></div>
</div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { ebookMixin } from '../../utils/mixin'
// import { mapActions } from 'vuex'
import Epub from 'epubjs'
global.ePub = Epub
export default {
  mixins: [ebookMixin],
  computed: {
    // 这样就可以使用this.fileName来获取fileName
    // ...mapGetters(['fileName','menuVisible'])
  },
  methods: {
    // ...mapActions(['setMenuVisible']),
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
        this.setSettingVisible(-1)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    // 标题和菜单的显示
    hideTitleAndMenu () {
      // this.$store.dispatch('setMenuVisible', false)
      this.setMenuVisible(false)
      // 字体面板隐藏
      this.setSettingVisible(-1)
    },
    // 合并电子书url并解析渲染电子书
    initEpub () {
      // http://localhost:8080/#/ebook/Biomedicine|2014_Book_Self-ReportedPopulationHealthA
      const url = 'http://192.168.1.105:9090/epub/' + this.fileName + '.epub'
      console.log(url)
      // 解析获取book
      this.book = new Epub(url)
      // 将book对象存放在vuex中
      this.setCurrentBook(this.book)
      console.log(this.book)
      // 绑定dom read进行书籍的渲染
      this.rendition = this.book.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight
      })
      // 展示
      this.rendition.display()
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
          // event.preventDefault()
          event.stopPropagation()
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
    // this.$store.dispatch('setFileName', fileName).then(() => {
    //   this.initEpub()
    // })
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
}
</style>
