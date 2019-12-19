<template>
  <div class='store-shelf'>
    <shelf-title :title="shelfCategory.title"></shelf-title>
    <scroll
    :top="0"
    :bottom="scrollBottom"
    ref="scroll"
    class="store-shelf-store-wrapper"
    @onScroll="onScroll"
    v-if="shelfCategory.itemList && shelfCategory.itemList.length > 0">
      <shelf-list :data="shelfCategory.itemList" :top="42"></shelf-list>
    </scroll>
    <div class="store-shelf-empty-view" v-else>{{$t('shelf.groupNone')}}'</div>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
import ShelfTitle from '../../components/shelf/ShelfTitle'
import Scroll from '../../components/common/Scroll'
import ShelfList from '../../components/shelf/ShelfList'
import ShelfFooter from '../../components/shelf/ShelfFooter'
import { storeShelfMixin } from '../../utils/mixin'
export default {
  mixins: [storeShelfMixin],
  components: {
    ShelfTitle,
    Scroll,
    ShelfList,
    ShelfFooter
  },
   watch: {
    isEditMode(isEditMode) {
      // 在编辑模式时让scroll距离底部的位置为48以展示隐藏掉的书籍标题
      this.scrollBottom = isEditMode ? 48 : 0
      // 在页面渲染完后刷新scroll
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    }
  },
  data() {
    return {
      scrollBottom: 0
    }
  },
  methods: {
    onScroll(offsetY) {
      this.setOffsetY(offsetY)
    }
  },
  mounted() {
    this.getCategoryList(this.$route.query.title)
    // 将数据类型设为分类
    this.setCurrentType(2)
  }
}
</script>
<style lang='scss' scoped>
@import "../../assets/styles/global";

.store-shelf{
  position: relative;
  z-index: 100;
  width: 100%;
  height: 100%;
  background: white;
  .store-shelf-store-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
    background: white;
  }
  .store-shelf-empty-view{
    position:absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: px2rem(14);
    color: #cccccc;
    @include center;
  }
}
</style>
