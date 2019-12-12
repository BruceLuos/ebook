<template>
  <div class='store-shelf'>
    <shelf-title></shelf-title>
    <scroll :top="0" :bottom="scrollBottom" ref="scroll" class="store-shelf-store-wrapper" @onScroll="onScroll">
      <shelf-search></shelf-search>
      <shelf-list :data="shelfList"></shelf-list>
    </scroll>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
import ShelfTitle from '../../components/shelf/ShelfTitle'
import Scroll from '../../components/common/Scroll'
import ShelfSearch from '../../components/shelf/ShelfSearch'
import ShelfList from '../../components/shelf/ShelfList'
import ShelfFooter from '../../components/shelf/ShelfFooter'
import { storeShelfMixin } from '../../utils/mixin'
export default {
  mixins: [storeShelfMixin],
  components: {
    ShelfTitle,
    Scroll,
    ShelfSearch,
    ShelfList,
    ShelfFooter
  },
   watch: {
    isEditMode(isEditMode) {
      this.scrollBottom = isEditMode ? 48 : 0
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
    this.getShelfList()
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
}
</style>
