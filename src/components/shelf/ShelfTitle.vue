<template>
  <transition name="fade">
    <div class='shelf-title'  :class="{'hide-shadow': ifHideShadow}" v-show="shelfTitleVisible">
      <!-- 标题 -->
      <div class="shelf-title-wrapper">
        <span class="shelf-title-text">{{title}}</span>
        <span class="shelf-title-sub-text" v-show="isEditMode">{{selectedText}}</span>
      </div>
      <!-- 清除缓存 -->
      <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showClear">
        <span class="shelf-title-btn-text" @click="clearCache">{{$t('shelf.clearCache')}}</span>
      </div>
      <!-- 编辑模式 -->
      <div class="shelf-title-btn-wrapper shelf-title-right" v-if="showEdit">
        <span class="shelf-title-btn-text" @click="onEditClick">{{isEditMode ? $t('shelf.cancel') : $t('shelf.edit')}}</span>
      </div>
      <!-- 返回按钮 -->
      <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showBack">
        <span class="icon-back" @click="back"></span>
      </div>
      <!-- 分组组件显示的编辑内容 -->
      <div class="shelf-title-btn-wrapper"
           :class="{'shelf-title-left': changeGroupLeft, 'shelf-title-right': changeGroupRight}" @click="changeGroup"
           v-if="showChangeGroup">
        <span class="shelf-title-btn-text">{{$t('shelf.editGroup')}}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import {storeShelfMixin} from '../../utils/mixin'
import { clearLocalStorage } from '../../utils/localstorage'
import { clearLocalForage } from '../../utils/localForage'
export default {
  mixins: [storeShelfMixin],
  props:{
    ifShowBack: {
      type: Boolean,
      default: false
    },
    title: String

  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        this.ifHideShadow = false
      } else {
        this.ifHideShadow = true
      }
    }
  },
  data () {
    return {
      ifHideShadow: true
    }
  },
  computed: {
    // 根据书架类型和编辑状态进行切换分组组件的状态
    emptyCategory() {
      // 分组书架为空时
        return !this.shelfCategory || !this.shelfCategory.itemList || this.shelfCategory.itemList.length === 0
      },
      showEdit() {
        // 展示编辑状态要求为主书架或者分组书架不为空
        return this.currentType === 1 || !this.emptyCategory
      },
      showClear() {
        return this.currentType === 1
      },
      showBack() {
        // 不在编辑状态下并且处于分组书架中
        return this.currentType === 2 && !this.isEditMode
      },
      showChangeGroup() {
        // 编辑状态下并且处于分组书架中
        return this.currentType === 2 && (this.isEditMode || this.emptyCategory)
      },
      changeGroupLeft() {
        return !this.emptyCategory
      },
      changeGroupRight() {
        return this.emptyCategory
      },
      selectedText() {
        // 判断选择的书籍数量进行显示
        const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
        return selectedNumber <= 0 ? this.$t('shelf.selectBook') : (selectedNumber === 1 ? this.$t('shelf.haveSelectedBook').replace('$1', selectedNumber) : this.$t('shelf.haveSelectedBooks').replace('$1', selectedNumber))
      },
      popupCancelBtn() {
        return this.createPopupBtn(this.$t('shelf.cancel'), () => {
          this.hidePopup()
        })
      }
  },
  methods: {
      onComplete() {
        this.hidePopup()
        this.setShelfList(this.shelfList.filter(book => book.id !== this.shelfCategory.id)).then(() => {
          saveBookShelf(this.shelfList)
          this.$router.go(-1)
          this.setIsEditMode(false)
        })
      },
      deleteGroup() {
        if (!this.emptyCategory) {
          this.setShelfSelected(this.shelfCategory.itemList)
          this.moveOutOfGroup(this.onComplete)
        } else {
          this.onComplete()
        }
      },
      changeGroupName() {
        this.hidePopup()
        this.dialog({
          showNewGroup: true,
          groupName: this.shelfCategory.title
        }).show()
      },
      hidePopup() {
        this.popupMenu.hide()
      },
      createPopupBtn(text, onClick, type = 'normal') {
        return {
          text: text,
          type: type,
          click: onClick
        }
      },
      showDeleteGroup() {
        this.hidePopup()
        setTimeout(() => {
          this.popupMenu = this.popup({
            title: this.$t('shelf.deleteGroupTitle'),
            btn: [
              this.createPopupBtn(this.$t('shelf.confirm'), () => {
                this.deleteGroup()
              }, 'danger'),
              this.popupCancelBtn
            ]
          }).show()
        }, 200)
      },
      changeGroup() {
        this.popupMenu = this.popup({
          btn: [
            this.createPopupBtn(this.$t('shelf.editGroupName'), () => {
              this.changeGroupName()
            }),
            this.createPopupBtn(this.$t('shelf.deleteGroup'), () => {
              this.showDeleteGroup()
            }, 'danger'),
            this.popupCancelBtn
          ]
        }).show()
      },
    back () {
      this.$router.go(-1)
      // 取消后退后的编辑模式
      this.setIsEditMode(false)
    },
    // 编辑模式的切换
    onEditClick () {
      if(!this.isEditMode) {
        // 不是编辑模式的时候清空书架被选择列表
        this.setShelfSelected([])
        this.shelfList.forEach(item => {
          item.selected = false
          // 如果item中还存在数据也就是存在分类列表数据遍历让他们的选择情况为false
          if(item.itemList) {
            item.itemList.forEach(subItem => {
              subItem.selected = false
            })
          }
        })
      }
      this.setIsEditMode(!this.isEditMode)
    },
    // 清除书架缓存
    clearCache () {
      console.log('clearCache')
      clearLocalStorage()
      clearLocalForage()
      // 清空书架列表并重新获取书架列表默认数据
      this.setShelfList([])
      this.setShelfSelected([])
      this.getShelfList()
      this.simpleToast(this.$t('shelf.clearCacheSuccess'))
    }
  },
}
</script>
<style lang='scss' scoped>
@import "../../assets/styles/global";
.shelf-title{
  position: relative;
  z-index: 150;
  width: 100%;
  height: px2rem(42);
  background: white;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
  &.hide-shadow {
    box-shadow: none;
  }
  .shelf-title-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);
    @include columnCenter;
    .shelf-title-text{
      font-size: px2rem(16);
      line-height: px2rem(20);
      font-weight: bold;
      color: #333;
    }
    .shelf-title-sub-text{
      font-size: px2rem(10);
      color: #333;
    }
  }
  .shelf-title-btn-wrapper{
    position: absolute;
    top: 0;
    box-sizing: border-box;
    height: 100%;
    @include center;
    .shelf-title-btn-text{
      font-size: px2rem(14);
      color: #666;
    }
     .icon-back {
        font-size: px2rem(20);
        color: #666;
    }
    &.shelf-title-left{
      left: 0;
      padding-left: px2rem(15);
    }
    &.shelf-title-right{
      right: 0;
      padding-right: px2rem(15);
    }
  }
}
</style>
