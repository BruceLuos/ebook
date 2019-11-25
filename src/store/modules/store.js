const store = {
  state: {
    hostSearchOffsetY: 0,
    flapCardVisible: true
  },
  mutations: {
    SET_HOT_SEARCH_OFFSETY (state, offsetY) {
      state.hostSearchOffsetY = offsetY
    },
    SET_FLAP_CARD_VISIBLE (state, visible) {
      state.flapCardVisible = visible
    }
  }
}
export default store
