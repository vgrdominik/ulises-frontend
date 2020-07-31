export const state = () => ({
  token: '',
  lastUrl: null,
  user: null,
})

export const getters = {
  getUser: (state) => {
    return (state.user === 'null')? null : state.user
  }
}

export const actions = {
  setLastUrl(state, lastUrl) {
    state.commit('updateLastUrl', lastUrl)
  },

  setToken(state, token) {
    this.$axios.setToken(token, 'Bearer')
    let domain = (window.location.host.slice(0, 9) === 'localhost') ?  'localhost' : '.' + window.location.host
    let myDate = new Date();
    myDate.setMonth(myDate.getMonth() + 12);
    window.document.cookie = 'token=' + token + ";expires=" + myDate
      + ";domain=" + domain + ";path=/";
    state.commit('updateToken', token)
  },

  fetchUser (state) {
    this.$axios.get('/api/user')
      .then((response) => {
        if (response.data && response.data.data) {
          let myDate = new Date();
          let domain = (window.location.host.slice(0, 9) === 'localhost') ?  'localhost' : '.' + window.location.host
          myDate.setMonth(myDate.getMonth() + 12);
          window.document.cookie = 'user=' + encodeURI(JSON.stringify(response.data.data)) + ";expires=" + myDate
            + ";domain=" + domain + ";path=/";
          state.commit('updateUser', response.data.data)
        } else {
          state.commit('removeUser')
        }
      })
      .catch(() => state.user = null)
  },
}

export const mutations = {
  updateLastUrl (state, lastUrlUpdated) {
    state.lastUrl = lastUrlUpdated
  },
  updateToken (state, tokenUpdated) {
    state.token = tokenUpdated
  },
  updateUser (state, userUpdated) {
    state.user = userUpdated
  },
  removeUser (state) {
    state.user = null
  },
}
