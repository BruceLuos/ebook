<template>
<div class='ebook' ref="ebook">
  <ebook-title></ebook-title>
  <ebook-reader></ebook-reader>
  <ebook-menu></ebook-menu>
</div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader'
import EbookTitle from '../../components/ebook/EbookTitle'
import EbookMenu from '../../components/ebook/EbookMenu'
import { getReadTime, saveReadTime } from '../../utils/localStorage'
import { ebookMixin } from '../../utils/mixin'
export default {
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu
  },
   watch: {
      offsetY(v) {
        if (!this.menuVisible && this.bookAvailable) {
          if (v > 0) {
            this.move(v)
          } else if (v === 0) {
            this.restore()
          }
        }
      }
    },
  methods: {
    // 清除移动
    restore() {
        this.$refs.ebook.style.top = 0
        this.$refs.ebook.style.transition = 'all .2s linear'
        setTimeout(() => {
          this.$refs.ebook.style.transition = ''
        }, 200)
      },
      move(v) {
        this.$refs.ebook.style.top = v + 'px'
      },
    // 记录时间
    startLoopReadTime () {
        let readTime = getReadTime(this.fileName)
        console.log(readTime)
        if (!readTime) {
          readTime = 0
        }
        this.task = setInterval(() => {
          readTime++
          if (readTime % 30 === 0) {
            // 将阅读时间缓存
            saveReadTime(this.fileName, readTime)
          }
        }, 1000)
      }
  },
  mounted () {
    this.startLoopReadTime()
  },
  beforeDestroy () {
      if (this.task) {
        clearInterval(this.task)
      }
    }
}
</script>
<style lang='scss' scoped>
@import "../../assets/styles/global";
// 为阅读器添加绝对布局让reader中的蒙版相对他布局
.ebook {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
