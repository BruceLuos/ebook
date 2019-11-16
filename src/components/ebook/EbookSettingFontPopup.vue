<template>
<div class='ebook-popup-list' v-show="fontFamilyVisible">
  <div class="ebook-popuo-title">
    <div class="ebook-popup-title-icon" @click="hide">
      <span class="icon-down2"></span>
    </div>
    <span class="ebook-popup-title-text">选择字体</span>
  </div>
  <div class="ebook-popup-list-wrapper"></div>
</div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
export default {
  mixins: [ebookMixin],
  methods: {
    hide () {
      this.setFontFamilyVisible(false)
    }
  },
}
</script>
<style lang='scss' scoped>
@import "../../assets/styles/global";

.ebook-popup-list{
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 300;
  width: 100%;
  background: white;
  box-shadow: 0 px2rem(-4) px2rem(6) rgba(0,0,0,.1);
  .ebook-popup-title{
    .ebook-popup-title-icon{

    }
    .ebook-popup-title-text{

    }
  }
  .ebook-popup-list-wrapper{

  }
}
</style>
