<template>
  <div class="search-bar-wrapper" >
      <div class="title-search-wrapper" :class="{'show-search': ifShowSearchPage, 'hide-shadow': ifHideShadow}" ref="titleSearchWrapper">
        <!-- 顶部标题的显示 -->
        <transition name="title">
          <div class="title-search-page-wrapper" v-show="!ifShowSearchPage">
            <span class="title-text title">{{$t('home.title')}}</span>
            <div class="icon-shake-wrapper" @click="showFlapCard">
              <span class="icon-shake icon"></span>
            </div>
          </div>
        </transition>
        <!-- 返回图标  -->
        <div class="icon-back-wrapper" :class="{'show-search': ifShowSearchPage}" @click="back">
          <span class="icon-back icon"></span>
        </div>
        <!-- 搜索框 -->
        <div class="search-wrapper" :class="{'show-search': ifShowSearchPage}">
          <div class="search-back-wrapper" :class="{'show-search': ifShowSearchPage}">
            <span class="icon-back icon" :class="{'show-search': ifShowSearchPage}"></span>
          </div>
          <div class="search-bg">
            <span class="icon-search icon"></span>
            <input type="text" class="search" :placeholder="$t('home.hint')" v-model="searchText" @click="showSearchPageAndHotSearch">
          </div>
        </div>
      </div>
      <!-- 搜索详情页热区 -->
      <transition name="host-search">
        <div class="hot-search-wrapper" v-if="ifShowSearchPage && ifShowHotSearch" ref="searchMaskWrapper">
          <hot-search :label="$t('home.hotSearch')"
                      :btn="$t('home.change')"
                      :hotSearch="searchList.hotSearch"></hot-search>
          <div class="line"></div>
          <hot-search :label="$t('home.historySearch')"
                      :btn="$t('home.clear')"
                      :hotSearch="searchList.historySearch"></hot-search>
        </div>
      </transition>
  </div>
</template>

<script>
import {storeHomeMixin} from '../../utils/mixin'
import { realPx } from '@/utils/utils'
import HotSearch from '@/components/home/hotSearch'
export default {
  components: {
    HotSearch
  },
  mixins: [storeHomeMixin],
  data () {
    return {
       searchList: {
          hotSearch: [
            {
              type: 1,
              text: 'Self-Reported Population Health',
              num: '1.8万'
            },
            {
              type: 1,
              text: 'Library and Information Sciences',
              num: '1.1万'
            },
            {
              type: 1,
              text: 'Global Business Strategy',
              num: '1.3万'
            },
            {
              type: 1,
              text: 'Corporate Data Quality',
              num: '1.0万'
            },
            {
              type: 1,
              text: 'Verrechnungspreise',
              num: '3.9万'
            }
          ],
          historySearch: [
            {
              type: 2,
              text: 'Computer Science'
            },
            {
              type: 1,
              text: 'Building the Infrastructure for Cloud Security'
            },
            {
              type: 2,
              text: 'ePub'
            },
            {
              type: 2,
              text: 'api'
            },
            {
              type: 2,
              text: 'Vue.js'
            },
            {
              type: 2,
              text: 'Nginx'
            },
            {
              type: 2,
              text: 'Java'
            },
            {
              type: 2,
              text: 'hdfs'
            },
            {
              type: 2,
              text: 'vuejs'
            },
            {
              type: 2,
              text: 'es6'
            },
            {
              type: 2,
              text: 'Intel'
            },
            {
              type: 1,
              text: 'Pro Git'
            },
            {
              type: 2,
              text: 'imooc'
            },
            {
              type: 2,
              text: 'Education'
            },
            {
              type: 2,
              text: 'Springer'
            },
            {
              type: 2,
              text: 'Environment'
            }
          ]
        },
        searchText: null,
        ifShowSearchPage: false,
        ifHideShadow: true,
        ifShowHotSearch: false
    }
  },
  watch:{
    offsetY(offsetY){
      if (offsetY > 0) {
        this.showTitle()
        this.hideShadow()
      } else {
        this.hideTitle()
        this.showShadow()

      }
    }
  },
  methods: {
    showFlapCard() {
      this.setFlapCardVisible(true)
    },
    hideTitle() {
      this.ifShowSearchPage = false
    },
    showTitle() {
      this.ifShowSearchPage = true
    },
    showHotSearch(){
      this.ifShowHotSearch = false
    },
     hideHotSearch() {
        this.ifShowHotSearch = false
        if(this.offsetY > 0){
          this.showTitle()
          this.hideShadow()

        } else {
          this.hideTitle()
          this.showShadow()
        }
      },
      showShadow() {
        this.ifHideShadow = false
      },
      hideShadow() {
        this.ifHideShadow = true
      },
      hideSearchPage() {
        this.ifShowSearchPage = false
        this.ifHideShadow = true
      },
      showSearchPage() {
         this.ifShowSearchPage = true
      },
      back() {
        this.searchText = ''
        this.showShadow()
        this.hideSearchPage()
        this.hideHotSearch()
      },
      showSearchPageAndHotSearch() {
        this.showSearchPage()
        this.hideShadow()
        this.ifShowHotSearch = true
        this.$nextTick(() => {
          // this.initHotSearch()
        })
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
