<template>
<div class='ebook-slide-contents'>
  <!-- 搜索框 -->
  <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <!-- 标签 -->
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <!-- 搜索框 -->
        <input class="slide-contents-search-input"
               type="text"
               v-model="searchText"
               :placeholder="$t('book.searchHint')"
               @keyup.enter.exact="search()"
               @click="showSearchPage">
      </div>
      <!-- 取消搜索 -->
      <div class="slide-contents-search-cancel"
           v-if="searchVisible"
           @click="hideSearchPage()">{{$t('book.cancel')}}
      </div>
  </div>
    <!-- 图书信息 -->
  <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <!-- 书籍图片 -->
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" class="slide-contents-book-img">
      </div>
      <!-- 图书信息 -->
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">
          <span class="slide-contents-book-title-text">{{metadata.title}}</span>
        </div>
        <div class="slide-contents-book-author">
          <span class="slide-contents-book-author-text">{{metadata.creator}}</span>
        </div>
      </div>
      <!-- 图书阅读进度 -->
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{progress + '%'}}</span>
          <span class="progress-text">{{$t('book.haveRead2')}}</span>
        </div>
        <div class="slide-contents-book-time">{{getReadTimeText()}}</div>
      </div>
    </div>
</div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
export default {
  mixins: [ebookMixin],
  data() {
      return {
        searchVisible: false,
        searchList: null,
        searchText: ''
      }
    },
  methods: {
    showSearchPage() {
        this.searchVisible = true
      },
      hideSearchPage() {
        this.searchVisible = false
        this.searchText = ''
        this.searchList = null
      }
  }
}
</script>
<style lang='scss' scoped>
  @import "../../assets/styles/global";

  .ebook-slide-contents {
    width: 100%;
    font-size: 0;
    .slide-contents-search-wrapper {
      display: flex;
      width: 100%;
      height: px2rem(36);
      margin: px2rem(20) 0 px2rem(10) 0;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-contents-search-input-wrapper {
        flex: 1;
        @include center;
        .slide-contents-search-icon {
          flex: 0 0 px2rem(28);
          font-size: px2rem(12);
          @include center;
        }
        .slide-contents-search-input {
          flex: 1;
          width: 100%;
          height: px2rem(32);
          font-size: px2rem(14);
          background: transparent;
          border: none;
          &:focus {
            outline: none;
          }
        }
      }
      .slide-contents-search-cancel {
        flex: 0 0 px2rem(50);
        font-size: px2rem(14);
        @include right;
      }
    }
  }
</style>
