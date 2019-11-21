<template>
<div class="ebook-loading">
  <div class="ebook-loading-wrapper">
    <!-- 左右两边的线  两层循环-->
    <div class="ebook-loading-item" v-for="(item, index) in data" :key="index">
      <div class="ebook-loading-line-wrapper" v-for="(subItem, subIndex) in item" :key="subIndex">
        <!-- 具体的线 -->
        <div class="ebook-loading-line"></div>
        <!-- 蒙版 使用动画进行蒙版的宽度变化-->
        <div class="ebook-loading-mask"></div>
      </div>
    </div>
    <!-- 中间的线 -->
    <div class="ebook-loading-center"></div>
  </div>
</div>
</template>

<script>

export default {
  data() {
    return {
      // 用数组中的两个数组里的内容充当左右两边的线
      data: [
          [{}, {}, {}],
          [{}, {}, {}]
        ],
    }
  }
}
</script>
<style lang='scss' scoped>
  @import "../../assets/styles/global";

  .ebook-loading {
    position: relative;
    z-index: 400;
    width: px2rem(63);
    height: px2rem(40);
    background: transparent;
    border: px2rem(1.5) solid #d7d7d7;
    border-radius: px2rem(3);
    .ebook-loading-wrapper {
      display: flex;
      width: 100%;
      height: 100%;
      .ebook-loading-item {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: px2rem(7) 0;
        box-sizing: border-box;
        .ebook-loading-line-wrapper {
          flex: 1;
          padding: 0 px2rem(7);
          box-sizing: border-box;
          @include left;
          .ebook-loading-line {
            flex: 0 0 px2rem(16);
            width: px2rem(16);
            height: px2rem(2);
            background: #d7d7d7;
          }
          .ebook-loading-mask {
            flex: 0 0 0;
            width: 0;
            height: px2rem(2);
          }
        }
      }
      .ebook-loading-center {
        position: absolute;
        left: 50%;
        top: 0;
        width: px2rem(1.5);
        height: 100%;
        background: #d7d7d7;
      }
    }
  }
</style>
