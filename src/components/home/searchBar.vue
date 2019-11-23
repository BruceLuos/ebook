<template>
  <div class="search-bar-wrapper">
    <div class="title-search-wrapper">
      <div class="icon-back-wrapper">
        <span class="icon-back icon"></span>
      </div>
      <div class="title-text-wrapper">
        <span class="title-text title">{{$t('home.title')}}</span>
      </div>
      <div class="icon-shake-wrapper">
        <span class="icon-shake icon"></span>
      </div>
      <div class="search-wrapper">
        <div class="search-bg">
            <span class="icon-search icon"></span>
          <input type="text" class="search" :placeholder="$t('home.hint')" v-model="searchText">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchText: null
    }
  }
}
</script>
<style lang='scss' scoped>
@import "../../assets/styles/global";

.search-bar-wrapper {
  .title-search-wrapper {
    position: relative;
    z-index: 110;
    width: 100%;
    height: px2rem(94);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
    .icon-back-wrapper {
      position: absolute;
      top: 0;
      left: px2rem(15);
      z-index: 105;
      height: px2rem(42);
      @include center;
    }
  }
  .title-text-wrapper {
    // width: 100%;
    @include center;
    height: px2rem(42);
  }
  .icon-shake-wrapper {
    position: absolute;
    right: px2rem(15);
    top: 0;
    z-index: 110;
    height: px2rem(42);
    @include center;
  }
  .search-wrapper{
    width: 100%;
    height: px2rem(52);
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .search-bg{
      width: 100%;
      background: #f4f4f4;
      border-radius: px2rem(20);
      border: px2rem(1) solid #eee;
      box-sizing: border-box;
      padding: px2rem(5) px2rem(15);
      @include left;
      .icon-search {
        font-size: px2rem(16);
        color: #999;
      }
      .search {
        color: #666;
        width: 100%;
        height: px2rem(22);
        background: transparent;
        font-size: px2rem(12);
        margin-left: px2rem(10);
        border: none;
        &:focus {
          outline: none;
        }
        &::-webkit-input-placeholder {
          color: #ccc;
        }
      }
    }

  }
}
</style>
