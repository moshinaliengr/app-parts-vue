const state = {
  showResults: false,
  storedMatches: [],
  partToSearch: "",
};

const getters = {
  showResults: (state) => state.showResults,
  storedMatches: (state) => state.storedMatches,
  partToSearch: (state) => state.partToSearch,
};

const mutations = {
  UPDATE_MODULE(state, storedMatches) {
    state.storedMatches = storedMatches;
  },

  SET_PART_SEARCH(state, partToSearch) {
    state.partToSearch = partToSearch;
  },

  SET_SHOW_RESULTS(state, showResults) {
    state.showResults = showResults;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
