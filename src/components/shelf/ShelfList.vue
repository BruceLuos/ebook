<template>
  <div class='shelf-list'>
    <div class="shelf-list-item-wrapper" v-for="item in data" :key="item.id">
      <shelf-item :data="item"></shelf-item>
    </div>
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
}
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.shelf-list{
  position: absolute;
  top: px2rem(94);
  width: 100%;
  left: 0;
  z-index: 100;
}
</style>
