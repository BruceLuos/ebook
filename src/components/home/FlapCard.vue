<template>
<div class='flap-card-wrapper' v-show="flapCardVisible">
  <div class="flap-card-bg" :class="{'animation': runFlapCardAnimation}"  v-show="runFlapCardAnimation">
    <!-- 卡片 -->
    <div class="flap-card" v-for="(item, index) in flapCardList" :key="index" :style="{zIndex: item.zIndex}">
      <div class="flap-card-circle">
        <!-- 左边一半的卡片和右边一半的卡片 -->
        <div class="flap-card-semi-circle flap-card-semi-circle-left"
        :style="semiCircleStyle(item, 'left')" ref="left"></div>
        <div class="flap-card-semi-circle flap-card-semi-circle-right"
        :style="semiCircleStyle(item, 'right')" ref="right"></div>
      </div>
    </div>
    <!-- 小球 -->
    <div class="point-wrapper">
        <div class="point" :class="{'animation': runPointAnimation}" v-for="(item, index) in pointList"
             :key="index"></div>
      </div>
  </div>
  <!-- 推荐书籍 -->
  <div class="book-card" :class="{'animation': runBookCardAnimation}"  v-show="runBookCardAnimation">
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" :src="data ? data.cover : ''">
        </div>
        <div class="content-wrapper">
          <div class="title">{{data ? data.title : ''}}</div>
          <div class="author sub-title-medium">{{data ? data.author : ''}}</div>
          <div class="category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail(data)">{{$t('home.readNow')}}</div>
      </div>
    </div>
  <!-- 关闭 -->
  <div class="close-btn-wrapper" @click="close">
    <div class="icon-close" ></div>
  </div>
</div>
</template>

<script>
import { storeHomeMixin, showBookDetail } from '../../utils/mixin'
import { flapCardList, categoryText } from '../../utils/store'

export default {
  mixins:[storeHomeMixin],
  props: {
    data: Object
  },
  data() {
    return {
      flapCardList,
      front:0,
      back:1,
      intervalTime: 25,
      runFlapCardAnimation:false,
      pointList: null,
      runPointAnimation: false,
      runBookCardAnimation: false
    }
  },
  watch: {
    // 监听flapCardVisible发生变化时展示和隐藏卡片动画
    flapCardVisible(v) {
      if (v) {
        this.startAinmation()
      }
    }
  },
  methods: {
    // 类别文本
    categoryText() {
      if (this.data) {
        categoryText(this.data.category, this)
      } else {
        return ''
      }
    },
    close () {
      this.setFlapCardVisible(false)
      // this.stopFlapCardAnimation()
      this.stopAnimation()
      // this.startPointAnimation()
    },
    // 将卡片样式与数组绑定在一起，方便管理
    semiCircleStyle(item, dir) {
      return {
        backgroundColor: `rgb(${item.r},${item.g},${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
      }
    },
    // 卡片旋转
    rotate (index, type) {
      // 获取对应index的数据
      const item = this.flapCardList[index]
      let dom
      if(type === 'front') {
        // 正面的话就是右边的某一半卡片
        dom = this.$refs.right[index]
      } else {
        // 背面的左边的某一半卡片
        dom = this.$refs.left[index]
      }
      // 获取到dom后进行翻转
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`
      dom.style.backgroundColor = `rgb(${item.r},${item._g},${item.b})`
    },
    // 卡片旋转
    flapCardRotate () {
      // 获取背面和正面的卡片数据进行变化
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard.rotateDegree += 10
      frontFlapCard._g -= 5
      backFlapCard.rotateDegree -=10
      if(backFlapCard.rotateDegree < 90){
        // 转90度之前让背面卡片颜色加深
        backFlapCard._g += 5
      }
      // 这样目前只能看到前面右半部分的旋转
      // 所以要初始化后面左半部分的旋转角度,然后才能满足以下条件让背面显示出来
      if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
        backFlapCard.zIndex += 2
      }
      // 当转完180度时需要切换下一张卡片
      if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
        this.next()
      }
      this.rotate(this.front,'front')
      this.rotate(this.back,'back')
    },
    // 切换下一张卡片
    next () {
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      // 需要将之前转动的角度还原
      frontFlapCard.rotateDegree = 0
      backFlapCard.rotateDegree = 0
      frontFlapCard._g = frontFlapCard.g
      backFlapCard._g = backFlapCard.g
      this.rotate(this.front,'front')
      this.rotate(this.back,'back')
      // 指向下一个卡片
      this.front++
      this.back++
      let len = this.flapCardList.length
      if(this.front >= len) {
        this.front = 0
      }
      if(this.back >= len) {
        this.back = 0
      }
      // 同时也需要动态修改他们z-index才会切换
      // 100 => 96
      // 96 => 97
      this.flapCardList.forEach((item, index) => {
       item.zIndex = 100-((index - this.front + len) % len)
      })
      // 再一次初始化背面卡片
      this.prepare()

    },
    // 初始化背面卡片
    prepare () {
      const backFlapCard = this.flapCardList[this.back]
      backFlapCard.rotateDegree = 180
      //让背面卡片颜色先变浅
      backFlapCard._g = backFlapCard.g - 5*9
      this.rotate(this.back,'back')
    },
    // 重置动画
    reset () {
      this.front = 0
      this.back = 1
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100-index
        item._g = item.g
        item.rotateDegree = 0
        this.rotate(index, 'front')
        this.rotate(index, 'back')
      })
      this.runPointAnimation = false
      this.runBookCardAnimation = false
      this.runFlapCardAnimation = false
    },
    // 执行小球动画
    startPointAnimation () {
      this.runPointAnimation = true
      // 在动画执行完后停止动画
      // 去除clas animation
      setTimeout(() => {
        this.runPointAnimation = false
        console.log('750')
      },750);
    },
    // 执行卡片动画
    startFlapCardAnimation () {
      // 所以要初始化后面左半部分的旋转角度
        this.prepare()
      this.task = setInterval(() => {
        this.flapCardRotate()
      },this.intervalTime)
    },
    // 停止卡片动画
    stopFlapCardAnimation () {
      // 清除定时任务
      if(this.task) {
        clearInterval(this.task)
      }
      console.log('h')
      this.reset()
    },
    // 开始动画
    startAinmation () {
      this.runFlapCardAnimation = true
      this.timeout1 = setTimeout(() => {
        this.startFlapCardAnimation()
        this.startPointAnimation()
        console.log('300')
      },300)
      // 执行一定时间后将卡片隐藏
      this.timeout2 = setTimeout(() => {
        this.stopAnimation()
        this.runBookCardAnimation = true
      }, 2500);
    },
    // 停止所有动画
    stopAnimation () {
      this.runFlapCardAnimation = false
      if(this.task) {
        clearInterval(this.task)
      }
      this.reset()
      if(this.timeout1) {
        clearTimeout(this.timeout1)
      }
      if(this.timeout2) {
        clearTimeout(this.timeout2)
      }
    }
  },
  created() {
    this.pointList = []
    for (let i = 0; i<18; i++){
      this.pointList.push(`point${i}`)
    }
  }
}
</script>
<style lang='scss' scoped>
@import "../../assets/styles/global";
@import "../../assets/styles/flapCard";

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
    // 执行完动画就会变回原来这样隐藏
    transform: scale(0);
    opacity: 0;
    &.animation {
      animation: scale .3s ease-in both;
    }
    @keyframes scale {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      70% {
        transform: scale(1.3);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
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
    .point-wrapper{
      @include absCenter;
      .point{
        border-radius: 50;
        @include absCenter;
        // 通过scss的for循环来循环小球的动画
        &.animation {
          @for $i from 1 to length($moves) {
            // 给point里的子元素也就是小圆点添加动画
            &:nth-child(#{$i}) {
              @include move($i);
            }
          }
        }
      }
    }
  }
  .book-card {
      position: relative;
      width: 65%;
      // height: 70%;
      box-sizing: border-box;
      border-radius: px2rem(15);
      background: white;
      &.animation {
        animation: scale .3s ease-in both;
        @keyframes scale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
      .book-card-wrapper {
        width: 100%;
        height: 100%;
        margin-bottom: px2rem(30);
        @include columnTop;
        .img-wrapper {
          width: 100%;
          margin-top: px2rem(20);
          @include center;
          .img {
            width: px2rem(90);
            height: px2rem(130);
          }
        }
        .content-wrapper {
          padding: 0 px2rem(20);
          margin-top: px2rem(20);
          .title {
            color: #333;
            font-weight: bold;
            font-size: px2rem(18);
            line-height: px2rem(20);
            max-height: px2rem(40);
            text-align: center;
            @include ellipsis2(2)
          }
          .author {
            margin-top: px2rem(10);
            text-align: center;
          }
          .category {
            color: #999;
            font-size: px2rem(14);
            margin-top: px2rem(10);
            text-align: center;
          }
        }
        .read-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1100;
          width: 100%;
          border-radius: 0 0 px2rem(15) px2rem(15);
          padding: px2rem(15) 0;
          text-align: center;
          color: white;
          font-size: px2rem(14);
          background: $color-blue;
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
