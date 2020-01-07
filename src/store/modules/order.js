const state = {
  quoteSku: null
}

const mutations = {
  SET_QUOTE_SKU: (state, data) => {
    state.quoteSku = data
  }
}

const actions = {
  changeQuoteSku({ commit }, data) {
    commit('SET_QUOTE_SKU', data)
  }
}

export default {
  state,
  mutations,
  actions
}

