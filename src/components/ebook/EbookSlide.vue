<template>
<transition name="fade">
  <div class='slide-content-wrapper' v-show="menuVisible && settingVisible === 3">
    <transition name="slide-right">
  <!-- 左侧目录 -->
    <div class="content" v-if="settingVisible === 3">
      <div class="content-page-wrapper">
        <!-- 内容列表 动态组件-->
        <div class="content-page"></div>
        <!-- 切换组件 -->
        <div class="content-page-tab">
          <div class="content-page-tab-item"
                   :class="{'selected': currentTab === 1}"
                   @click="selectTab(1)">
                {{$t('book.navigation')}}
              </div>
              <div class="content-page-tab-item"
                   :class="{'selected': currentTab === 2}"
                   @click="selectTab(2)">
                {{$t('book.bookmark')}}
              </div>
        </div>
      </div>
    </div>
    </transition>
  <!-- 右侧背景 -->
    <div class="content-bg" @click="hideTitleAndMenu()"></div>
  </div>
</transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
export default {
  mixins: [ebookMixin],
  data() {
      return {
        currentTab: 1
        // content: EbookSlideContents,
        // bookmark: EbookSlideBookmark
      }
    },
    methods: {
      selectTab (tab) {
        this.currentTab = tab
      }
    }
}
</script>
<style lang='scss' scoped>
@import "../../assets/styles/global";
.slide-content-wrapper{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 900;
  width: 100%;
  height: 100%;
  display: flex;
  .content{
    flex: 0 0 85%;
    width: 80%;
    height: 100%;
    .content-page-wrapper{
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      .content-page{
        flex: 1;
        width: 100%;
        overflow: hidden;
      }
      .content-page-tab{
        display: flex;
        flex: 0 0 px2rem(48);
        // background: red;
        width: 100%;
        height: px2rem(48);
        .content-page-tab-item {
            flex: 1;
            font-size: px2rem(12);
            @include center;
          }
      }
    }
  }
  .content-bg{
    flex: 0 0 15%;
    width: 15%;
    height: 100%;
  }
}
</style>
