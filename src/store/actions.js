const actions = {
  setFileName: ({ commit }, fileName) => {
    return commit('set_filename', fileName)
  },
  setMenuVisible: ({ commit }, menuVisible) => {
    return commit('set_menuvisible', menuVisible)
  }
}
export default actions
