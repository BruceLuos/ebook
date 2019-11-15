<template>
  <div id="app">
    <span class="text">Abcd</span>
    <router-view/>
  </div>
</template>

<script>
export default {
  mounted () {
    this.$store.dispatch('setTest',9).then(() => {
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
@import "./assets/styles/global.scss";
.text{
  font-size: px2rem(40);
  font-family: 'Days One';
}
</style>
