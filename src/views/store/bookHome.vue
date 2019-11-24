<template>
<div class='book-home'>
  <search-bar></search-bar>
  <scroll :top="94" @onScroll="onScroll">
    <div>1111111111111111111111111</div>
     <div>1111111111111111111111111</div>
     <div>1111111111111111111111111</div>
     <div>1111111111111111111111111</div>
     <div>1111111111111111111111111</div>
     <div>1111111111111111111111111</div>
     <div>1111111111111111111111111</div>
      <div>1111111111111111111111111</div>
       <div>1111111111111111111111111</div>
        <div>1111111111111111111111111</div>
        <div>1111111111111111111111111</div>
        <div>1111111111111111111111111</div>
        <div>1111111111111111111111111</div>
        <div>1111111111111111111111111</div>
        <div>1111111111111111111111111</div>
     <div>1111111111111111111111111</div>
     <div>1111111111111111111111111</div>
     <div>1111111111111111111111111</div>
     <div>1111111111111111111111111</div>
     <div>1111111111111111111111111</div>
     <div>1111111111111111111111111</div>
      <div>1111111111111111111111111</div>
       <div>1111111111111111111111111</div>
        <div>1111111111111111111111111</div>
        <div>1111111111111111111111111</div>
        <div>1111111111111111111111111</div>
        <div>1111111111111111111111111</div>
        <div>1111111111111111111111111</div>
  </scroll>
</div>
</template>

<script>
import SearchBar from '../../components/home/searchBar'
import Scroll from '../../components/common/Scroll'
import {storeHomeMixin} from '../../utils/mixin'
export default {
  mixins: [storeHomeMixin],
  components: {
    SearchBar,
    Scroll
  },
  methods: {
    // 获得scroll传来的offsetY将他存储到vuex中已便searchBar组件的使用
    onScroll(offsetY) {
      this.setOffsetY(offsetY)
    }
  },
}
</script>
<style lang='scss' scoped>
 @import "../../assets/styles/global";
.book-home{
  width: 100%;
  height: 100%;
  background: white;
}
</style>
