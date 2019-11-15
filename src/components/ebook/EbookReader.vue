<template>
<div class='ebook-reader'>
  <div id='read'></div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Epub from 'epubjs'
global.ePub = Epub
export default {
  computed: {
    // 这样就可以使用this.fileName来获取fileName
    ...mapGetters(['fileName'])
  },
  methods: {
    initEpub () {
      const url = 'http://192.168.1.105:9090/epub/' + this.fileName + '.epub'
      console.log(url)
      // 解析获取book
      this.book = new Epub(url)
      console.log(this.book)
      // 绑定dom read进行书籍的渲染
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default'
      })
      // 展示
      this.rendition.display()
    }
  },
  mounted () {
    // console.log(this.fileName)
    const fileName = this.$route.params.fileName.split('|').join('/')
    console.log(fileName)
    this.$store.dispatch('setFileName', fileName).then(() => {
      this.initEpub()
    })
  }
}
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global.scss';
</style>
