<template>
<div class='shelf-search-wrapper' :class="{'search-top': ifInputClicked, 'hide-shadow': ifHideShadow}">
  <!-- 搜索框 -->
  <div class="shelf-search" :class="{'search-top': ifInputClicked}">
    <div class="search-wrapper">
      <!-- 搜索图标 -->
      <div class="icon-search-wrapper">
        <span class="icon-search icon"></span>
      </div>
      <!-- 搜索框 -->
      <div class="search-input-wrapper">
        <input type="text"
        class="search-input"
        :placeholder="$t('shelf.search')"
        v-model="searchText"
        @click="onSearchClick">
      </div>
      <!-- 取消图标 -->
      <div class="icon-clear-wrapper"
           v-show="searchText.length > 0"
           @click="clearSearchText">
        <span class="icon-close-circle-fill"></span>
      </div>
    </div>
    <!-- 国际化切换 -->
    <div class="icon-locale-wrapper" v-if="!ifInputClicked" @click="switchLocale">
      <span class="icon-cn icon" v-if="lang === 'cn'"></span>
      <span class="icon-en icon" v-else></span>
    </div>
    <div class="cancel-btn-wrapper" @click="onCancelClick" v-else>
      <span class="cancel-text">{{$t('shelf.cancel')}}</span>
    </div>
  </div>
  <!-- 搜索切换 -->
  <transition name="hot-search-move">
    <div class="shelf-search-tab-wrapper" v-if="ifInputClicked">
      <div class="shelf-search-tab-item" v-for="item in tabs" :key="item.id" @click="onTabClick(item.id)">
        <span class="shelf-search-tab-text" :class="{'is-selected': item.id === selectedTab}">{{item.text}}</span>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
import { setLocalStorage } from '../../utils/localstorage'
import { storeShelfMixin } from '../../utils/mixin'


export default {
  mixins: [storeShelfMixin],
  data() {
    return {
      searchText:'',
      ifInputClicked: false,
      selectedTab: 1,
      ifHideShadow: true
    }
  },
  computed: {
    lang() {
      return this.$i18n.locale
    },
    tabs() {
      return [
        {
          id: 1,
          text: this.$t('shelf.default')
        },
        {
          id: 2,
          text: this.$t('shelf.progress')
        },
        {
          id: 3,
          text: this.$t('shelf.purchase')
        }
      ]
    }
  },
  methods: {
    // 搜索切换
    onTabClick (id) {
      this.selectedTab = id
    },
    // 清除内容
    clearSearchText () {
      this.searchText = ''
    },
    // 切换语言
    switchLocale () {
      if(this.lang === 'en') {
        this.$i18n.locale = 'cn'
      } else {
        this.$i18n.locale = 'en'
      }
      setLocalStorage('locale', this.$i18n.locale)
    },
    // 取消搜索
    onCancelClick() {
      this.ifInputClicked = false
      this.setShelfTitleVisible(true)
    },
    // 点击搜索框
    onSearchClick() {
      this.ifInputClicked = true
      this.setShelfTitleVisible(false)
    }
  },
}
</script>
<style lang='scss' scoped>
@import "../../assets/styles/global";


  .shelf-search-wrapper {
    position: relative;
    z-index: 105;
    width: 100%;
    height: px2rem(94);
    font-size: px2rem(16);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    &.hide-shadow {
      box-shadow: none;
    }
    &.search-top {
      position: fixed;
      left: 0;
      top: 0;
    }
    .shelf-search {
      position: absolute;
      top: px2rem(42);
      left: 0;
      z-index: 105;
      // 搜索框外部flex
      display: flex;
      width: 100%;
      // 给搜索框52的高度
      height: px2rem(52);
      transition: top $animationTime linear;
      // 点击标题框时将他向上移动
      &.search-top {
        top: 0;
      }
      .search-wrapper {
        // 搜索框内部flex
        flex: 1;
        display: flex;
        margin: px2rem(8) 0 px2rem(8) px2rem(10);
        border: px2rem(1) solid #ccc;
        border-radius: px2rem(3);
        .icon-search-wrapper {
          flex: 0 0 px2rem(22);
          @include right;
          .icon-search {
            font-size: px2rem(12);
          }
        }
        .search-input-wrapper {
          flex: 1;
          padding: 0 px2rem(10);
          box-sizing: border-box;
          @include center;
          .search-input {
            width: 100%;
            font-size: px2rem(14);
            border: none;
            color: #333;
            &:focus {
              outline: none;
            }
            &::-webkit-input-placeholder {
              font-size: px2rem(14);
              color: #ccc;
            }
          }
        }
        .icon-clear-wrapper {
          flex: 0 0 px2rem(24);
          @include left;
          .icon-close-circle-fill {
            font-size: px2rem(14);
            color: #ccc;
          }
        }
      }
      .icon-locale-wrapper {
        flex: 0 0 px2rem(55);
        @include center;
        .icon-cn, .icon-en {
          font-size: px2rem(22);
          color: #666;
        }
      }
      .cancel-btn-wrapper {
        flex: 0 0 px2rem(55);
        @include center;
        .cancel-text {
          font-size: px2rem(14);
          color: $color-blue;
        }
      }
    }
    .shelf-search-tab-wrapper {
      position: absolute;
      top: px2rem(52);
      left: 0;
      z-index: 105;
      display: flex;
      width: 100%;
      // 给切换bar 42的高度
      height: px2rem(42);
      .shelf-search-tab-item {
        flex: 1;
        @include center;
        .shelf-search-tab-text {
          font-size: px2rem(12);
          color: #999;
          &.is-selected {
            color: $color-blue;
          }
        }
      }
    }
  }
</style>
