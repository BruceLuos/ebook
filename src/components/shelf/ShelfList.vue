<template>
  <div class="shelf-list" :style="{top: shelfListTop}">
    <!-- 使用这个可以给每个遍历元素都加上id或class -->
    <transition-group name="list"
                      tag="div"
                      id="shelf-list">
      <div class="shelf-list-item-wrapper" v-for="item in data" :key="item.id">
        <!-- 书架书籍 -->
        <shelf-item :data="item" :style="{height: itemHeight}"></shelf-item>
        <!-- 书籍标题 -->
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">{{item.title}}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin'
import ShelfItem from './ShelfItem'
import { realPx, px2rem } from '../../utils/utils'

export default {
mixins: [storeShelfMixin],
components: {
  ShelfItem
},
props: {
  top: {
    type: Number,
    default: 94
  },
  data: Array
},
computed: {
    shelfListTop() {
      return px2rem(this.top) + 'rem'
    },
    // 图片的自适应的高度
    itemHeight() {
      // w / 250 = h / 350
      // h = w / 250 * 350
      return ((window.innerWidth - realPx(120)) / 3) / 250 * 350 + 'px'
    }
  }
}
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.shelf-list {
  position: absolute;
  left: 0;
  z-index: 100;
  width: 100%;
  #shelf-list {
    display: flex;
    // 打横排列 可以换行
    flex-flow: row wrap;
    width: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .shelf-list-item-wrapper {
      // 一行可以排三本书
      flex: 0 0 33.33%;
      width: 33.33%;
      padding: px2rem(15);
      box-sizing: border-box;
      // 过渡动画,添加在需要变化的元素中
      &.list-leave-active {
        display: none;
      }
      &.list-move {
        transition: transform .5s;
      }
      .shelf-list-title-wrapper {
        margin-top: px2rem(10);
      }
    }
  }
}
</style>
