export const state = () => ({
  showFooter: true,
})

export const actions = {
  setShowFooter(state, showFooter) {
    state.commit('updateShowFooter', showFooter)
  },
}

export const mutations = {
  updateShowFooter (state, showFooter) {
    state.showFooter = showFooter
  },
}
