<template>
<div class='shelf-footer' v-show="isEditMode"></div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin'
export default {
  mixins: [storeShelfMixin]
}
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.shelf-footer{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 120;
  display: flex;
  width: 100%;
  height: px2rem(48);
  background: white;
  box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, .1);
}
</style>
