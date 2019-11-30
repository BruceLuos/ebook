<template>
<div class='book-home'>
  <search-bar></search-bar>
  <flap-card :data="random"></flap-card>
  <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
  <div class="banner-wrapper">
     <img class="banner" :src="banner">
  </div>
  <guess-you-like :data="guessYouLike"></guess-you-like>
  </scroll>
</div>
</template>

<script>
import SearchBar from '../../components/home/searchBar'
import Scroll from '../../components/common/Scroll'
import FlapCard from '../../components/home/FlapCard'
import GuessYouLike from '../../components/home/GuessYouLike'
import {storeHomeMixin} from '../../utils/mixin'
import { home } from '../../api/store'
export default {
  mixins: [storeHomeMixin],
  components: {
    SearchBar,
    Scroll,
    FlapCard,
    GuessYouLike
  },
  data () {
    return{
      scrollTop: 94,
      random: null,
      banner: null,
      guessYouLike: null
    }
  },
  methods: {
    // 获得scroll传来的offsetY将他存储到vuex中已便searchBar组件的使用
    onScroll(offsetY) {
      this.setOffsetY(offsetY)
      if (offsetY > 0) {
        this.scrollTop = 52
      } else {
        this.scrollTop = 97
      }
      this.$refs.scroll.refresh()
    }
  },
  mounted () {
    // 请求获取图书数据
    home().then(res => {
       if (res && res.status === 200) {
        const data = res.data
        // 生成随机index
        const randomIndex = Math.floor(Math.random() * data.random.length)
        // 把随机获取到的数据传给random
        this.random = data.random[randomIndex]
        this.banner = data.banner
        this.guessYouLike = data.guessYouLike
        this.recommend = data.recommend
        this.featured = data.featured
        this.categoryList = data.categoryList
        this.categorys = data.categories
      }
    })
  }
}
</script>
<style lang='scss' scoped>
 @import "../../assets/styles/global";
.book-home{
  width: 100%;
  height: 100%;
  background: white;
  .banner-wrapper{
    width: 100%;
    padding: px2rem(10);
    box-sizing: border-box;
    .banner{
      width: 100%;
      height: px2rem(150);
      // overflow: hidden;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
