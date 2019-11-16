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
  },
  actions: {
    setFileName: ({ commit }, fileName) => {
      return commit('set_filename', fileName)
    },
    setMenuVisible: ({ commit }, menuVisible) => {
      return commit('set_menuvisible', menuVisible)
    }
  }
}
export default book
