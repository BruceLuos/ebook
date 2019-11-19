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
        <div class="content-page-tab"></div>
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
  mixins: [ebookMixin]
}
</script>
<style lang='scss' scoped>
@import "../../assets/styles/global";
.slide-content-wrapper{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 300;
  width: 100%;
  height: 100%;
  display: flex;
  .content{
    flex: 0 0 85%;
    width: 80%;
    height: 100%;
    .content-page-wrapper{
      .content-page{

      }
      .content-page-tab{

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
