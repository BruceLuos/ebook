const book = {
  state: {
    fileName: '',
    menuVisible: false
  },
  mutations: {
    'set_filename': (state, fileName) => {
      state.fileName = fileName
    },
    'set_menuvisible': (state, menuVisible) => {
      state.menuVisible = menuVisible
    }
  }
}
export default book
