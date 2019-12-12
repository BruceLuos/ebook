<template>
  <transition name="fade">
    <div class='shelf-title'  :class="{'hide-shadow': ifHideShadow}" v-show="shelfTitleVisible">
      <!-- 标题 -->
      <div class="shelf-title-wrapper">
        <span class="shelf-title-text">{{$t('shelf.title')}}</span>
        <span class="shelf-title-sub-text" v-show="isEditMode">{{selectedText}}</span>
      </div>
      <!-- 清除缓存 -->
      <div class="shelf-title-btn-wrapper shelf-title-left">
        <span class="shelf-title-btn-text" @click="clearCache">{{$t('shelf.clearCache')}}</span>
      </div>
      <!-- 编辑模式 -->
      <div class="shelf-title-btn-wrapper shelf-title-right">
        <span class="shelf-title-btn-text" @click="onEditClick">{{isEditMode ? $t('shelf.cancel') : $t('shelf.edit')}}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import {storeShelfMixin} from '../../utils/mixin'
export default {
  mixins: [storeShelfMixin],
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
    selectedText() {
      // 判断选择的书籍数量进行显示
      const selectedNumber =  this.shelfSelected ? this.shelfSelected.length : 0
      return selectedNumber <= 0
      ? this.$t('shelf.selectBook')
      : selectedNumber === 1
      ? this.$t('shelf.haveSelectedBook').replace('$1',selectedNumber)
      : this.$t('shelf.haveSelectedBook').replace('$1',selectedNumber)
    }
  },
  methods: {
    onEditClick () {
      if(!this.isEditMode) {
        // 不是编辑模式的时候清空书架被选择列表
        this.setShelfSelected([])
        this.shelfList.forEach(item => item.selected = false)
      }
      this.setIsEditMode(!this.isEditMode)
    },
    clearCache () {
      console.log('clearCache')
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
