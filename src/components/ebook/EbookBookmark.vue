<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <bookmark :color="color" :width="15" :height="35"></bookmark>
    </div>
  </div>
</template>

<script>
  import { realPx } from '../../utils/utils'
  import Bookmark from '../common/Bookmark'
  import { ebookMixin } from '../../utils/mixin'
  import { getBookmark, saveBookmark } from '../../utils/localStorage'

  const BLUE = '#346cbc'
  const WHITE = '#fff'
  export default {
    mixins: [ebookMixin],
    components: {
      Bookmark
    },
    computed: {
      height() {
        return realPx(35)
      },
      // 下拉的阈值
      threshold() {
        return realPx(55)
      },
      // 加入书签后的书签的位置布局
      fixedStyle() {
        return {
          position: 'fixed',
          top: 0,
          right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
        }
      }
    },
    watch: {
      offsetY(v) {
        // 在书籍解析完后才能进行下拉书签
        if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
          return
        }
        if (v >= this.height && v < this.threshold) {
          // 状态二
          this.beforeThreshold(v)
        } else if (v >= this.threshold) {
          // 状态三
          this.afterThreshold(v)
        } else if (v > 0 && v < this.height) {
          // 状态1：未超过书签的高度
          this.beforeHeight()
        } else if (v === 0) {
          // 状态四 书签 归位
          this.restore()
        }
      },
      // 获取缓存中的isBookmark
      // 判断当前页面是否加入书签
      isBookmark(isBookmark) {
        this.isFixed = isBookmark
        if (isBookmark) {
          // 修改书签颜色
          this.color = BLUE
        } else {
          this.color = WHITE
        }
      }
    },
    data() {
      return {
        text: '',
        color: WHITE,
        // 判断是否书签是就重新布局书签位置
        isFixed: false
      }
    },
    methods: {
      // 添加书签，缓存，记录书籍状态
      addBookmark() {
        // 从缓存中获取书签
        this.bookmark = getBookmark(this.fileName)
        // 不存在书签就初始化书签数组
        if (!this.bookmark) {
          this.bookmark = []
        }
        const currentLocation = this.currentBook.rendition.currentLocation()
        // 获取cfi中前半部分内容
        const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
        // 获取start中！后面的内容
        const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
        // 获取end中！后面的内容
        const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')
        // 拼接上面内容
        const cfirange = `${cfibase}!,${cfistart},${cfiend})`
        // 获取拼接内容的范围
        this.currentBook.getRange(cfirange).then(range => {
          // 获取到这个范围的文本并去除多余的空格
          const text = range.toString().replace(/\s\s/g, '')
          // 书签数组中添加信息
          this.bookmark.push({
            cfi: currentLocation.start.cfi,
            text: text
          })
          saveBookmark(this.fileName, this.bookmark)
        })
      },
      // 删除书签
      removeBookmark() {
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfi = currentLocation.start.cfi
        this.bookmark = getBookmark(this.fileName)
        if (this.bookmark) {
          // 过滤掉已存储的书签
          saveBookmark(this.fileName, this.bookmark.filter(item => item.cfi !== cfi))
          this.setIsBookmark(false)
        }
      },
      restore() {
        // 状态4：归位
        setTimeout(() => {
          this.$refs.bookmark.style.top = `${-this.height}px`
          this.$refs.iconDown.style.transform = 'rotate(0deg)'
        }, 200)
        if (this.isFixed) {
          this.setIsBookmark(true)
          this.addBookmark()
        } else {
          this.setIsBookmark(false)
          this.removeBookmark()
        }
      },
      beforeHeight() {
        // 状态1：未超过书签的高度
        if (this.isBookmark) {
          this.text = this.$t('book.pulldownDeleteMark')
          this.color = BLUE
          this.isFixed = true
        } else {
          this.text = this.$t('book.pulldownAddMark')
          this.color = WHITE
          this.isFixed = false
        }
      },
      beforeThreshold(v) {
        // 状态2：未到达零界状态 保持原来的状态
        this.$refs.bookmark.style.top = `${-v}px`
        this.beforeHeight()
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === 'rotate(180deg)') {
          iconDown.style.transform = 'rotate(0deg)'
        }
      },
      afterThreshold(v) {
        // 状态3：超越零界状态 切换图标颜色,提示文字，布局，旋转图标
        this.$refs.bookmark.style.top = `${-v}px`
        if (this.isBookmark) {
          this.text = this.$t('book.releaseDeleteMark')
          this.color = WHITE
          this.isFixed = false
        } else {
          this.text = this.$t('book.releaseAddMark')
          this.color = BLUE
          this.isFixed = true
        }
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === '' ||
          iconDown.style.transform === 'rotate(0deg)') {
          iconDown.style.transform = 'rotate(180deg)'
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(35);
    .ebook-bookmark-text-wrapper {
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;
      .ebook-bookmark-down-wrapper {
        font-size: px2rem(14);
        color: white;
        transition: all .2s linear;
        @include center;
      }
      .ebook-bookmark-text {
        font-size: px2rem(14);
        color: white;
      }
    }
    .ebook-bookmark-icon-wrapper {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(15);
    }
  }
</style>
