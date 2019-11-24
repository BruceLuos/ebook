<template>
  <div class="search-bar-wrapper" >
      <div class="title-search-wrapper" :class="{'show-search': ifShowSearchPage}" ref="titleSearchWrapper">
        <!-- 顶部标题的显示 -->
      <transition name="title">
        <div class="title-search-page-wrapper" v-show="!ifShowSearchPage">
          <span class="title-text title">{{$t('home.title')}}</span>
          <div class="icon-shake-wrapper">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <!-- 返回图标 -->
      <div class="icon-back-wrapper" :class="{'show-search': ifShowSearchPage}" >
        <span class="icon-back icon"></span>
      </div>
      <!-- 搜索框 -->
      <div class="search-wrapper" :class="{'show-search': ifShowSearchPage}">
        <div class="search-back-wrapper" :class="{'show-search': ifShowSearchPage}">
          <span class="icon-back icon" :class="{'show-search': ifShowSearchPage}"></span>
        </div>
        <div class="search-bg">
          <span class="icon-search icon"></span>
          <input type="text" class="search" :placeholder="$t('home.hint')" v-model="searchText">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {storeHomeMixin} from '../../utils/mixin'
export default {
  mixins: [storeHomeMixin],
  data () {
    return {
      searchText: null,
      ifShowSearchPage: true
    }
  },
  watch:{
    offsetY(offsetY){
      if (offsetY > 0) {
        this.hideTitle()
      } else {
        this.showTitle()
      }
    }
  },
  methods: {
    hideTitle() {
      this.ifShowSearchPage = false
    },
    showTitle() {
      this.ifShowSearchPage = true
    }
  },
}
</script>
<style lang='scss' scoped>
@import "../../assets/styles/global";

  .search-bar-wrapper {
    .title-search-wrapper {
      position: relative;
      z-index: 110;
      width: 100%;
      height: px2rem(94);
      background: white;
      box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
      &.show-search {
        height: px2rem(52);
      }
      &.hide-shadow {
        box-shadow: none;
      }
      .title-search-page-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 105;
        width: 100%;
        height: px2rem(42);
        @include center;
        .title-text {
          font-weight: bold;
        }
        .icon-shake-wrapper {
          position: absolute;
          right: 0;
          top: 0;
          z-index: 110;
          padding-right: px2rem(10);
          height: 100%;
          @include center;
        }
      }
      .icon-back-wrapper {
        position: absolute;
        left: px2rem(10);
        top: 0;
        z-index: 110;
        height: px2rem(42);
        @include center;
        transition: all $homeAnimationTime linear;
        &.show-search {
          height: px2rem(52);
        }
      }
      .search-wrapper {
        position: absolute;
        top: px2rem(42);
        left: 0;
        z-index: 100;
        display: flex;
        padding: px2rem(10);
        width: 100%;
        box-sizing: border-box;
        transition: all $homeAnimationTime linear;
        &.show-search {
          top: 0;
        }
        .search-back-wrapper {
          flex: 0;
          width: 0;
          @include center;
          transition: all $homeAnimationTime linear;
          visibility: hidden;
          &.show-search {
            margin-right: px2rem(10);
            flex: 0 0 px2rem(20);
            width: px2rem(20);
          }
          .icon-back {
            font-size: 0;
            &.show-search {
              font-size: px2rem(20);
            }
          }
        }
        .search-bg {
          flex: 1;
          background: #f4f4f4;
          border-radius: px2rem(20);
          border: px2rem(1) solid #eee;
          box-sizing: border-box;
          padding: px2rem(5) px2rem(15);
          transition: all $homeAnimationTime linear;
          @include left;
          .icon-search {
            font-size: px2rem(16);
            color: #999;
          }
          .search {
            color: #666;
            width: 100%;
            height: px2rem(22);
            background: transparent;
            font-size: px2rem(12);
            margin-left: px2rem(10);
            border: none;
            &:focus {
              outline: none;
            }
            &::-webkit-input-placeholder {
              color: #ccc;
            }
          }
        }
      }
    }
    .hot-search-wrapper {
      width: 100%;
      height: 100%;
      background: white;
      overflow-x: hidden;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
        display: none;
      }
      .line {
        width: 100%;
        height: 0;
        border-top: px2rem(1) solid #eee;
        margin: px2rem(10) 0;
      }
    }
  }
</style>
