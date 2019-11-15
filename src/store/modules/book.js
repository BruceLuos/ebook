const book = {
  state: {
    test: 1
  },
  mutations: {
    'set_test': (state, newTest) => {
      state.test = newTest
    }
  },
  actions: {
    setTest: ({ commit, state }, newTest) => {
      return commit('set_test', newTest)
    }
  }
}
export default book
