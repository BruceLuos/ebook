<template>
<div class='shelf-footer' v-show="isEditMode">
   <div class="shelf-footer-tab-wrapper" v-for="item in tabs" :key="item.index" @click="onTabClick(item)">
      <div class="shelf-footer-tab" :class="{'is-selected': isSelected}">
        <!-- 开启私密与关闭私密的不同图标 -->
        <div class="icon-private tab-icon" v-if="item.index === 1 && !isPrivate"></div>
        <div class="icon-private-see tab-icon" v-if="item.index === 1 && isPrivate"></div>
        <div class="icon-download tab-icon" v-if="item.index === 2 && !isPrivate"></div>
        <div class="icon-download-remove tab-icon" v-if="item.index === 2 && isPrivate"></div>
        <div class="icon-move tab-icon" v-if="item.index === 3"></div>
        <div class="icon-shelf tab-icon" v-if="item.index === 4"></div>
        <div class="tab-text" :class="{'remove-text': item.index === 4}">{{label(item)}}</div>
      </div>
    </div>
</div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin'
import { saveBookShelf, removeLocalStorage } from '../../utils/localstorage'
import { download } from '../../api/store'
import { removeLocalForage } from '../../utils/localForage'

export default {
  mixins: [storeShelfMixin],
   computed: {
      isSelected() {
        return this.shelfSelected && this.shelfSelected.length > 0
      },
      tabs() {
        return [
          {
            label: this.$t('shelf.private'),
            label2: this.$t('shelf.noPrivate'),
            index: 1
          },
          {
            label: this.$t('shelf.download'),
            label2: this.$t('shelf.delete'),
            index: 2
          },
          {
            label: this.$t('shelf.move'),
            index: 3
          },
          {
            label: this.$t('shelf.remove'),
            index: 4
          }
        ]
      },
      // 计算属性是否私密,前两本书私密，然后选择一本不是私密的书，状态变成不是私密
      isPrivate() {
        if (!this.isSelected) {
          return false
        } else {
          // 被选择书籍全部设置私密状态
          return this.shelfSelected.every(item => item.private)
        }
      },
      isDownload() {
        if (!this.isSelected) {
          return false
        } else {
          return this.shelfSelected.every(item => item.cache)
        }
    }
  },
  data () {
    return {
      popupMenu: null
    }
  },
  methods: {
    // 缓存书籍详情
    async downloadSelectedBook () {
      for(let i = 0; i< this.shelfSelected.length; i++) {
        // 等到缓存完毕后将书籍缓存状态修改为true
        await this.downloadBook(this.shelfSelected[i])
          .then(book => {
              book.cache = true
            })
      }
    },
    // 缓存书籍
    downloadBook () {
      let text = ''
      // 提示框
      const toast = this.toast({
        text
      })
      // 让提示框进行展示
      toast.continueShow()
      return new Promise((resolve, reject) => {
        download(book, book =>{
          // 下载成功时去除掉toast实例以方便后面的操作创建新的实例更新内容
          toast.remove()
          resolve(book)
        }, reject, progressEvent =>{
          console.log(progressEvent)
          const progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%'
          text = this.$t('shelf.progressDownload').replace('$1', `${book.fileName}.epub(${progress})`)
          // 提示框中的数据更新
          toast.updateText(text)
        })
      })
    },
    // 任何操作成功后
    onComplete() {
      this.hidePopup()
      this.setIsEditMode(false)
      saveBookShelf(this.shelfList)
    },
    // 设置私密状态
    setPrivate () {
      console.log('hhh')
      let isPrivate
      //切换私密状态
      if (this.isPrivate) {
        isPrivate = false
      } else {
        isPrivate = true
      }
      // 将选择里的书籍都设为私密
      this.shelfSelected.forEach(book => {
        book.private = isPrivate
      })
      this.onComplete()
      // 私密提示框的切换
      if (isPrivate) {
        this.simpleToast(this.$t('shelf.setPrivateSuccess'))
      } else {
        this.simpleToast(this.$t('shelf.closePrivateSuccess'))
      }
    },
    // 设置缓存 使用async await等到下载完成后才执行下面的步骤
    async setDownload () {
       if (this.isDownload) {
          this.removeSelectedBook()
        } else {
          await this.downloadSelectedBook()
          saveBookShelf(this.shelfList)
          this.simpleToast(this.$t('shelf.setDownloadSuccess'))
        }
    },
    // 删除选择的已缓存书籍
    removeSelectedBook() {
      Promise.all(this.shelfSelected.map(book => this.removeBook(book)))
        .then(books => {
          books.map(book => {
            book.cache = false
          })
          saveBookShelf(this.shelfList)
          this.simpleToast(this.$t('shelf.removeDownloadSuccess'))
        })
    },
    removeBook(book) {
      return new Promise((resolve, reject) => {
        removeLocalStorage(`${book.categoryText}/${book.fileName}-info`)
        removeLocalForage(`${book.fileName}`)
        resolve(book)
      })
    },
    // 书籍移除书架
    removeSelected () {
      // 遍历已选择书籍数组,将数据与完整书籍列表数据进行比较，过滤掉相同的书籍
      // 并重新赋值给已选择书籍数值
      this.shelfSelected.forEach(selected => {
        this.setShelfList(this.shelfList.filter(book =>book !== selected))
      })
      this.setShelfSelected([])
      this.onComplete()
    },
    hidePopup () {
      this.popupMenu.hide()
    },
    // 私密模式
    showPrivate () {
      this.popupMenu = this.popup({
        title: this.isPrivate ? this.$t('shelf.closePrivateTitle') : this.$t('shelf.setPrivateTitle'),
        btn: [
          {
            text: this.isPrivate ? this.$t('shelf.close') : this.$t('shelf.open'),
            click: () => {
              // 设置私密书籍
              this.setPrivate()
            }
          },
          {
            text: this.$t('shelf.cancel'),
            click: () => {
              this.hidePopup()
            }
          }
        ]
      }).show()
    },
    // 缓存模式
    showDownload () {
      this.popupMenu = this.popup({
        title: this.isDownload ? this.$t('shelf.removeDownloadTitle') : this.$t('shelf.setDownloadTitle'),
        btn: [
          {
            text: this.isDownload ? this.$t('shelf.delete') : this.$t('shelf.open'),
            click: () => {
              // 开始缓存
              this.setDownload()
            }
          },
          {
            text: this.$t('shelf.cancel'),
            click: () => {
              this.hidePopup()
            }
          }
        ]
      }).show()
    },
    // 移出书架
    showRemove () {
      let title
      if (this.shelfSelected.length === 1) {
        title = this.$t('shelf.removeBookTitle').replace('$1', `《${this.shelfSelected[0].title}》`)
      } else {
        title = this.$t('shelf.removeBookTitle').replace('$1', this.$t('shelf.selectedBooks'))
      }
      this.popupMenu = this.popup({
        title: title,
        btn: [
          {
            text: this.$t('shelf.removeBook'),
            type: 'danger',
            click: () => {
              this.removeSelected()
            }
          },
          {
            text: this.$t('shelf.cancel'),
            click: () => {
              this.hidePopup()
            }
          }
        ]
      }).show()
    },
    // 编辑模式时底部bar的事件
    onTabClick(item) {
      if(!this.isSelected) {
        return
      }
      // 根据点击时获取的index来进行展示不同的提示框
      switch (item.index) {
        case 1:
          this.showPrivate()
          break
        case 2:
          this.showDownload()
          break
        case 3:

          break
        case 4:
          this.showRemove()
          break
      }
    },
    label(item) {
      switch (item.index) {
        case 1:
          return this.isPrivate ? item.label2 : item.label
        case 2:
          return this.isDownload ? item.label2 : item.label
        default:
          return item.label
      }
    }
  }
}
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.shelf-footer{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 120;
  display: flex;
  width: 100%;
  height: px2rem(48);
  background: white;
  box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, .1);
  .shelf-footer-tab-wrapper {
      flex: 1;
      width: 25%;
      height: 100%;
      .shelf-footer-tab {
        width: 100%;
        height: 100%;
        opacity: .5;
        @include columnCenter;
        // 书籍被选择时显示
        &.is-selected {
          opacity: 1;
        }
        .tab-icon {
          font-size: px2rem(20);
          color: #666;
        }
        .tab-text {
          margin-top: px2rem(5);
          font-size: px2rem(12);
          color: #666;
          &.remove-text {
            color: $color-pink;
          }
        }
        .icon-shelf {
          color: $color-pink;
        }
      }
    }
}
</style>
