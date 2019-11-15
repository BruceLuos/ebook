<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import './store/getters.js'
export default {
  mounted () {
    this.$store.dispatch('setFileName').then(() => {
      console.log(this.$store.state.Book.test)
    })
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 50 ? 50 : fontSize
  html.style.fontSize = fontSize + 'px'
  console.log(html.style.fontSize)
})
</script>
<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
