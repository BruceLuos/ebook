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
    <!-- 图书目录列表 -->
    <scroll class="slide-contents-list"
            :top="156"
            :bottom="48"
            v-show="!searchVisible">
      <div class="slide-contents-item" v-for="(item, index) in navigation" :key="index">
        <span class="slide-contents-item-label" :class="{'selected': section === index}" :style="contentItemStyle(item)"
              @click="displayContent(item.href)">{{item.label}}</span>
        <span class="slide-contents-item-page">{{item.page}}</span>
      </div>
    </scroll>
    <!-- 搜索内容展示 -->
    <scroll class="slide-search-list"
            :top="66"
            :bottom="48"
            v-show="searchVisible">
      <div class="slide-search-item"
           v-for="(item, index) in searchList"
           :key="index"
           v-html="item.excerpt"
           @click="displayContent(item.cfi, true)"></div>
    </scroll>
</div>
</template>

<script>
 import { ebookMixin } from '../../utils/mixin'
  import Scroll from '../common/Scroll'
  import { px2rem } from '../../utils/utils'
export default {
  mixins: [ebookMixin],
  components: {
      Scroll
    },
  data() {
      return {
        searchVisible: false,
        searchList: null,
        searchText: ''
      }
    },
  methods: {
     search() {
       console.log('jj')
        if (this.searchText && this.searchText.length > 0) {
          this.doSearch(this.searchText).then(list => {
            this.searchList = list
            console.log(this.searchList)
            this.searchList.map(item => {
              // 为item添加一个excerpt属性将搜索内容searchText代替为html方便添加样式
              // 效果搜索关键字高亮
              item.excerpt = item.excerpt.replace(this.searchText, `<span class="content-search-text">${this.searchText}</span>`)
              return item
              // console.log(item)
            })
          })
        }
      },
      // 官方的全文搜索算法
      doSearch(q) {
        return Promise.all(
          this.currentBook.spine.spineItems.map(
            section => section.load(this.currentBook.load.bind(this.currentBook))
              .then(section.find.bind(section, q))
              .finally(section.unload.bind(section)))
        ).then(results => Promise.resolve([].concat.apply([], results)))
      },
      // 点击展示内容并对章节中的关键字进行高亮
    displayContent(target, highlight = false) {
        this.display(target, () => {
          this.hideTitleAndMenu()
          if (highlight) {
            // annotations管理高亮内容
            this.currentBook.rendition.annotations.highlight(target)
          }
        })
      },
      // 分级缩进，根据item.level进行判断等级
    contentItemStyle(item) {
        return {
          //1*15 2*15
          marginLeft: `${px2rem(item.level * 15)}rem`
        }
      },
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
    .slide-contents-book-wrapper {
      display: flex;
      width: 100%;
      height: px2rem(90);
      padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
      box-sizing: border-box;
      .slide-contents-book-img-wrapper {
        flex: 0 0 px2rem(45);
        .slide-contents-book-img {
          width: px2rem(45);
          height: px2rem(60);
        }
      }
      .slide-contents-book-info-wrapper {
        flex: 1;
        padding: 0 px2rem(10);
        box-sizing: border-box;
        .slide-contents-book-title {
          // width: px2rem(153.75);
          font-size: px2rem(14);
          line-height: px2rem(16);
          @include left;
          .slide-contents-book-title-text {
            @include ellipsis2(3);
          }
        }
        .slide-contents-book-author {
          // width: px2rem(153.75);
          font-size: px2rem(12);
          line-height: px2rem(14);
          margin-top: px2rem(5);
          @include left;
          .slide-contents-book-author-text {
            @include ellipsis2(1);
          }
        }
      }
      .slide-contents-book-progress-wrapper {
        flex: 0 0 px2rem(70);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        .slide-contents-book-progress {
          .progress {
            font-size: px2rem(14);
          }
          .progress-text {
            font-size: px2rem(12);
          }
        }
        .slide-contents-book-time {
          font-size: px2rem(12);
          margin-top: px2rem(5);
        }
      }

    }
    .slide-contents-list {
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-contents-item {
        display: flex;
        padding: px2rem(20) 0;
        box-sizing: border-box;
        .slide-contents-item-label {
          flex: 1;
          font-size: px2rem(14);
          line-height: px2rem(16);
          @include ellipsis;
        }
        .slide-contents-item-page {
          flex: 0 0 px2rem(30);
          font-size: px2rem(10);
          @include right;
        }
      }
    }
    .slide-search-list {
      width: 100%;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-search-item {
        font-size: px2rem(14);
        line-height: px2rem(16);
        padding: px2rem(20) 0;
        box-sizing: border-box;
      }
    }
  }
</style>
