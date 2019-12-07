<template>
  <div class='store-shelf'>
    <shelf-title></shelf-title>
    <scroll :top="0" class="store-shelf-store-wrapper">
      <shelf-search></shelf-search>
    </scroll>
  </div>
</template>

<script>
import ShelfTitle from '../../components/shelf/ShelfTitle'
import Scroll from '../../components/common/Scroll'
import ShelfSearch from '../../components/shelf/ShelfSearch'
export default {
  components: {
    ShelfTitle,
    Scroll,
    ShelfSearch
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
    background: red;
  }
}
</style>
