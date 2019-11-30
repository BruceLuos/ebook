<template>
<div class='book-home'>
  <search-bar></search-bar>
  <flap-card :data="random"></flap-card>
  <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
  <div class="banner-wrapper">
     <img class="banner" :src="banner">
  </div>
  <!-- 猜你喜欢 -->
  <guess-you-like :data="guessYouLike"></guess-you-like>
  <!-- 推荐 -->
  <recommend class="recommend" :data="recommend"></recommend>
  <!-- 精选 -->
  <featured
  class="featured"
  :titleText="$t('home.featured')"
  :btnText="$t('home.seeAll')"
  :data="featured"></featured>
  <!-- 分类 -->
  <div class="category-list-wapper" v-for="(item, index) in categoryList" :key="index">
    <category-book class="category-book" :data="item"></category-book>
  </div>
  <!--所有分类s -->
  <category class="category" :data="categorys"></category>
  </scroll>
</div>
</template>

<script>
import SearchBar from '../../components/home/searchBar'
import Scroll from '../../components/common/Scroll'
import FlapCard from '../../components/home/FlapCard'
import GuessYouLike from '../../components/home/GuessYouLike'
import Recommend from '../../components/home/Recommend'
import Featured from '../../components/home/Featured'
import CategoryBook from '../../components/home/CategoryBook'
import Category from '../../components/home/Category'
import {storeHomeMixin} from '../../utils/mixin'
import { home } from '../../api/store'
export default {
  mixins: [storeHomeMixin],
  components: {
    SearchBar,
    Scroll,
    FlapCard,
    GuessYouLike,
    Recommend,
    Featured,
    CategoryBook,
    Category
  },
  data () {
    return{
      scrollTop: 94,
      random: null,
      banner: null,
      guessYouLike: null,
      recommend: null,
      featured: null,
      categoryList: null,
      categorys: null
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
  .recommend{
    margin-top:px2rem(20);
  }
}
</style>
