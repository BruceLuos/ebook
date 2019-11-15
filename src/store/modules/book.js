const book = {
  state: {
    fileName: ''
  },
  mutations: {
    'set_filename': (state, fileName) => {
      state.fileName = fileName
    }
  },
  actions: {
    setFileName: ({ commit }, fileName) => {
      return commit('set_filename', fileName)
    }
  }
}
export default book
