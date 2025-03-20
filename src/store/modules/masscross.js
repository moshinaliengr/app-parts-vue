const state = {
  showResults: false,
  crossParts: [],
};

const getters = {
  showResults: (state) => state.showResults,
  crossParts: (state) => state.crossParts,
  partToSearch: (state) => state.partToSearch,
};

const mutations = {
  UPDATE_MODULE(state, storedModule) {
    state.crossParts = crossParts;
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
