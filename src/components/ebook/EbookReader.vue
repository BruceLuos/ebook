<template>
<div class='ebook-reader'>
  <div id="read"></div>
</div>
</template>

<script>
import {mapGetters} from 'vuex'
import Epub from 'epubjs'
global.ePub = Epub
export default {
  computed: {
    // 这样就可以使用this.fileName来获取fileName
    ...mapGetters(['fileName'])
  },
  methods: {
    initEpub () {

    }
  },
  mounted () {
    const baseUrl = 'http:/192.168.1.105:9090/'
    const fileName = this.$route.params.fileName.split('|').join('/')
    this.$store.dispatch('setFileName',fileName).then(() => {
      this.initEpub()
    })
    console.log(`${baseUrl}${fileName}.epub`)
  }
}
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global.scss';
</style>
