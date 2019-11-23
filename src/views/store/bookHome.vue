<template>
<div class='book-home'>
  <search-bar></search-bar>
</div>
</template>

<script>
import SearchBar from '../../components/home/searchBar'
export default {
  components: {
    SearchBar
  }
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
