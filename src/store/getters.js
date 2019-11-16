const book = {
  // 使用getter来简便fileName的引用
  fileName: state => state.Book.fileName,
  menuVisible: state => state.Book.menuVisible
}
export default book
