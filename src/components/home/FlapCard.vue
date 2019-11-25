<template>
<div class='flap-card-wrapper' v-show="flapCardVisible">
  <div class="flap-card-bg">
    <div class="flap-card" v-for="(item, index) in flapCardList" :key="index" :style="{zIndex: item.zIndex}">
      <div class="flap-card-circle">
        <div class="flap-card-semi-circle flap-card-semi-circle-left" :style="semiCircleStyle(item, 'left')"></div>
        <div class="flap-card-semi-circle flap-card-semi-circle-right" :style="semiCircleStyle(item, 'right')"></div>
      </div>
    </div>
  </div>
  <div class="close-btn-wrapper" @click="close">
    <div class="icon-close" ></div>
  </div>
</div>
</template>

<script>
import { storeHomeMixin } from '../../utils/mixin'
import { flapCardList } from '../../utils/store'
export default {
  mixins:[storeHomeMixin],
  data() {
    return {
      flapCardList
    }
  },
  methods: {
    close() {
      this.setFlapCardVisible(false)
    },
    // 将卡片样式与数组绑定在一起，方便管理
    semiCircleStyle(item, dir) {
      return {
        backgroundColor: `rgb(${item.r},${item.g},${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
      }
    }
  },
}
</script>
<style lang='scss' scoped>
@import "../../assets/styles/global";

.flap-card-wrapper{
  @include absCenter;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: rgba(0,0,0,0.6);
  @include center;
  .flap-card-bg{
    position: relative;
    width: px2rem(64);
    height: px2rem(64);
    background: white;
    border-radius: px2rem(5);
    .flap-card{
      //因为图片过多溢出所以需要绝对定位居中来解决
      @include absCenter;
      width: px2rem(48);
      height: px2rem(48);
      .flap-card-circle{
        display: flex;
        width: 100%;
        height: 100%;
        .flap-card-semi-circle{
          // flex布局让图案各占一半
          flex: 0 0 50%;
          width:50%;
          height: 100%;
        }
        .flap-card-semi-circle-left {
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
          background-color: #ffc666;
          background-repeat: no-repeat;
          background-position: center right;
          // 左上为圆角
          border-radius: px2rem(24) 0 0 px2rem(24);
          transform-origin: right;
          backface-visibility: hidden;
          }
        .flap-card-semi-circle-right {
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
          background-repeat: no-repeat;
          background-position: center left;
          // 右下为圆角
          border-radius: 0 px2rem(24) px2rem(24) 0;
          transform-origin: left;
          backface-visibility: hidden;
        }
      }
    }
  }
  .close-btn-wrapper{
    position: absolute;
    left: 0;
    bottom: px2rem(30);
    width: 100%;
    z-index: 1100;
    @include center;
    .icon-close{
      width: px2rem(45);
      height: px2rem(45);
      border-radius: 50%;
      background: #333;
      font-size: px2rem(25);
      color:white;
      @include center;
    }
  }
}
</style>
