<template>
<div class='shelf-item'>
  <component :is="item" :data="data"></component>
</div>
</template>

<script>
import ShelfBook from './ShelfBook'
import ShelfCategory from './ShelfItemCategory'
import ShelfAdd from './ShelfItemAdd'
import { storeShelfMixin } from '../../utils/mixin'
export default {
  mixins: [storeShelfMixin],
  props: {
    data: Object
  },
  computed: {
    item() {
      return this.data.type === 1 ? this.book :(this.data.type === 2 ? this.category :this.add)
    }
  },
  data() {
    return {
      book: ShelfBook,
      category: ShelfCategory,
      add:ShelfAdd
    }
  }
}
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
</style>
